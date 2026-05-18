const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// 1. Update mascotOptions to 32 emojis
const newMascots = `const mascotOptions = [
  "🦊", "🐉", "🐼", "🐯", "🐰", "🐻", "🐺", "🦅",
  "🐸", "🦭", "🦁", "🐒", "🐘", "🐙", "🐧", "🦄",
  "🐢", "🦋", "🐍", "🐴", "🦌", "🦇", "🐳", "🦍",
  "🦏", "🦛", "🐊", "🦈", "🐪", "🦒", "🦘", "🦡"
];`;
script = script.replace(/const mascotOptions = \[\s*"Fox"[\s\S]*?\];/, newMascots);

// 2. Modify renderMascotGrid
const newRenderMascotGrid = `function renderMascotGrid() {
  if (!els.mascotGrid) return;
  const selected = appState.profile.customization.mascot;
  els.mascotGrid.replaceChildren(...mascotOptions.map((name, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = \`mascot-option\${name === selected ? " is-selected" : ""}\`;
    button.dataset.mascot = name;
    button.innerHTML = \`<span style="font-size: 2rem; line-height: 1;">\${name}</span>\`;
    return button;
  }));
}`;
script = script.replace(/function renderMascotGrid\(\) \{[\s\S]*?\}\s*function getLevelInfo/, newRenderMascotGrid + '\n\nfunction getLevelInfo');

// 3. Context Menu logic
const contextMenuLogic = `
// Social Context Menu logic
const socialContextMenu = document.getElementById("socialContextMenu");
let ctxMenuTarget = null;
let unsolicitedMsgCount = 3;

document.addEventListener("contextmenu", (e) => {
  const item = e.target.closest("li[data-person]");
  if (item && item.parentElement.id.includes("List")) {
    e.preventDefault();
    ctxMenuTarget = item.dataset.person;
    socialContextMenu.style.left = e.pageX + "px";
    socialContextMenu.style.top = e.pageY + "px";
    socialContextMenu.hidden = false;
  } else {
    socialContextMenu.hidden = true;
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#socialContextMenu")) {
    socialContextMenu.hidden = true;
  }
});

document.getElementById("ctxVisitProfile")?.addEventListener("click", () => {
  if (ctxMenuTarget) openPersonProfile(ctxMenuTarget);
  socialContextMenu.hidden = true;
});

document.getElementById("ctxAddFriend")?.addEventListener("click", () => {
  alert("Friend request sent to " + ctxMenuTarget);
  socialContextMenu.hidden = true;
});

document.getElementById("ctxSendMessage")?.addEventListener("click", () => {
  if (unsolicitedMsgCount > 0) {
    unsolicitedMsgCount--;
    document.getElementById("ctxMessageCount").textContent = unsolicitedMsgCount;
    alert("Message sent to " + ctxMenuTarget);
  } else {
    alert("You have reached your limit of unsolicited messages.");
  }
  socialContextMenu.hidden = true;
});
`;

script += contextMenuLogic;

// 4. Clippy Guide logic
const clippyLogic = `
// Clippy Guide
const clippyGuide = document.getElementById("clippyGuide");
const clippyAvatar = document.getElementById("clippyAvatar");
const clippyMessage = document.getElementById("clippyMessage");

function updateClippy() {
  if (!clippyGuide) return;
  const targetLang = appState.targetLanguage;
  clippyGuide.hidden = false;
  clippyAvatar.innerHTML = \`<span style="font-size: 3rem; line-height: 70px;">\${appState.profile.customization.mascot || "🦊"}</span>\`;
  
  if (appState.activeView === "practice") {
    clippyMessage.textContent = \`Hover over words to translate them! Practice makes perfect in \${targetLang}!\`;
  } else if (appState.activeView === "stories") {
    clippyMessage.textContent = \`Read stories to immerse yourself in \${targetLang}.\`;
  } else if (appState.activeView === "profile") {
    clippyMessage.textContent = \`Customize your profile, check your \${targetLang} achievements, and make friends!\`;
  } else {
    clippyMessage.textContent = \`Welcome to Language Learners!\`;
  }
}

// Intercept switchView to update Clippy
const originalSwitchView = switchView;
switchView = function(viewId) {
  originalSwitchView(viewId);
  updateClippy();
};

// Initialize clippy periodically if mascot changes
setInterval(updateClippy, 2000);
`;
script += clippyLogic;

// 5. Achievements Logic based on language
const achievementsLogic = `
function renderAchievements() {
  if (!els.achievementsList) return;
  const lang = appState.targetLanguage.charAt(0).toUpperCase() + appState.targetLanguage.slice(1);
  const achievements = [
    { name: \`\${lang} Beginner\`, desc: \`Read 10 words in \${lang}\`, progress: 100 },
    { name: \`\${lang} Storyteller\`, desc: \`Read 5 stories in \${lang}\`, progress: 40 },
    { name: \`\${lang} Master\`, desc: \`Learn 1000 words in \${lang}\`, progress: 15 }
  ];
  
  els.achievementsList.replaceChildren(...achievements.map(a => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.background = "rgba(0,0,0,0.05)";
    div.style.borderRadius = "8px";
    div.style.marginBottom = "8px";
    div.innerHTML = \`
      <div style="font-weight: bold;">\${a.name}</div>
      <div style="font-size: 0.85rem; color: #555;">\${a.desc}</div>
      <div style="width: 100%; height: 8px; background: #ddd; border-radius: 4px; margin-top: 6px;">
        <div style="width: \${a.progress}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
      </div>
    \`;
    return div;
  }));
}

// Hook into target language switch
const originalSwitchTargetLanguage = switchTargetLanguage;
switchTargetLanguage = function(language) {
  originalSwitchTargetLanguage(language);
  renderAchievements();
  updateClippy();
};

// Also hook into switchView because achievements might be rendered on profile open
const originalRenderProfile = renderProfile;
renderProfile = function() {
  originalRenderProfile();
  renderAchievements();
};
`;

script += achievementsLogic;

fs.writeFileSync('script.js', script);
console.log("Updates applied successfully.");
