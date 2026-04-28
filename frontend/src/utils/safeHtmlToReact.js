import parse from "html-react-parser";
import { htmlToPlainText } from "./htmlToPlainText";

/**
 * html-react-parser can throw on hostile/malformed HTML. Fallback to plain text (SSR-safe).
 */
export function safeHtmlToReact(html) {
  if (html == null || html === "") return null;
  const s = String(html);
  try {
    return parse(s);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[safeHtmlToReact] parse failed", e);
    }
    return htmlToPlainText(s);
  }
}
