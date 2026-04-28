/** Plain text for TTS / search. Safe when `document` is unavailable (SSR). */
export function htmlToPlainText(html = "") {
  const withoutImages = String(html).replace(/<img\b[^>]*>/gi, "");
  if (typeof document === "undefined") {
    return withoutImages.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const doc = new DOMParser().parseFromString(withoutImages, "text/html");
  return (doc.body?.textContent || "").replace(/\s+/g, " ").trim();
}
