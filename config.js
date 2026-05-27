window.LANGUAGE_API_BASE = window.LANGUAGE_API_BASE || "";
window.LANGUAGE_MEDIA_BASE = window.LANGUAGE_MEDIA_BASE || "";

if (
  !window.LANGUAGE_MEDIA_BASE &&
  (window.location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname))
) {
  window.LANGUAGE_MEDIA_BASE = "http://127.0.0.1:9877";
}
