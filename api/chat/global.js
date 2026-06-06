const { ensureLedgerSchema, getAuthUser, getPool, normalizeChatText, readJsonBody, sendJson, setCors } = require("../_utils");

const blockedLiveChatTerms = [
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "cunt", "dick",
  "pussy", "slut", "whore", "nigger", "nigga", "faggot", "retard", "kike"
];

function containsBlockedLiveChatTerm(text) {
  const normalized = String(text || "").toLowerCase().replace(/[@$!1|0*._-]/g, "");
  return blockedLiveChatTerms.some((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i").test(normalized));
}

async function getLiveChatCooldown(db, userId) {
  const existing = await db.query(
    `select cooldown_until as "cooldownUntil"
     from live_chat_moderation
     where user_id = $1 and cooldown_until is not null and cooldown_until > now()`,
    [userId]
  );
  return existing.rows[0]?.cooldownUntil || null;
}

async function recordLiveChatViolation(db, userId) {
  const result = await db.query(
    `insert into live_chat_moderation (user_id, violation_count, window_start, updated_at)
     values ($1, 1, now(), now())
     on conflict (user_id) do update set
       violation_count = case
         when live_chat_moderation.window_start < now() - interval '1 minute' then 1
         else live_chat_moderation.violation_count + 1
       end,
       window_start = case
         when live_chat_moderation.window_start < now() - interval '1 minute' then now()
         else live_chat_moderation.window_start
       end,
       cooldown_until = case
         when live_chat_moderation.window_start >= now() - interval '1 minute'
          and live_chat_moderation.violation_count + 1 >= 3 then now() + interval '5 minutes'
         else live_chat_moderation.cooldown_until
       end,
       updated_at = now()
     returning violation_count as "violationCount", cooldown_until as "cooldownUntil"`,
    [userId]
  );
  return result.rows[0] || { violationCount: 1, cooldownUntil: null };
}

module.exports = async function globalChat(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET" && req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });

  try {
    const db = getPool();
    if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
    await ensureLedgerSchema();
    const authUser = await getAuthUser(req);

    if (req.method === "GET") {
      const afterId = Number.parseInt(req.query.afterId || "0", 10);
      const language = normalizeChatText(req.query.language || "", 32);
      const params = [Number.isFinite(afterId) ? afterId : 0];
      let whereClause = "where id > $1";
      if (language) {
        params.push(language);
        whereClause += " and language = $2";
      }
      const result = await db.query(
        `select id, user_id as "userId", author, message, language, created_at as "createdAt"
         from global_chat_messages
         ${whereClause}
         order by id asc
         limit 80`,
        params
      );
      return sendJson(req, res, 200, { messages: result.rows });
    }

    const payload = await readJsonBody(req);
    const message = normalizeChatText(payload.message);
    if (!message) return sendJson(req, res, 400, { error: "Message is required." });

    const userId = normalizeChatText(authUser?.id || payload.userId || "anonymous", 128);
    const cooldownUntil = await getLiveChatCooldown(db, userId);
    if (cooldownUntil) return sendJson(req, res, 429, { error: "Live chat cooldown active.", cooldownUntil });

    if (containsBlockedLiveChatTerm(message)) {
      const moderation = await recordLiveChatViolation(db, userId);
      if (moderation.cooldownUntil) {
        return sendJson(req, res, 429, {
          error: "Live chat cooldown active after 3 blocked messages in 1 minute.",
          cooldownUntil: moderation.cooldownUntil
        });
      }
      return sendJson(req, res, 400, {
        error: "Live chat message blocked by the language filter.",
        remainingWarnings: Math.max(0, 3 - Number(moderation.violationCount || 1))
      });
    }

    const author = normalizeChatText(authUser?.displayName || payload.author || "Guest", 64);
    const language = normalizeChatText(payload.language || "site", 32);
    const result = await db.query(
      `insert into global_chat_messages (user_id, author, message, language)
       values ($1, $2, $3, $4)
       returning id, user_id as "userId", author, message, language, created_at as "createdAt"`,
      [userId, author, message, language]
    );
    sendJson(req, res, 200, { message: result.rows[0] });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
