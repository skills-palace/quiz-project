/**
 * Comma/Arabic comma–separated extra answer lines for word bank / rearrange / reorder.
 * Each line must use the same words as in `quizes` (by exact title) in some order.
 */

function tokenizeLine(line) {
  if (line == null) return [];
  return String(line)
    .split(/[,،]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sameMultisetOfIds(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

/**
 * @param {string[]} lines - e.g. ["How, I, can, help, you?"]
 * @param {{ id: string, title: string }[]} quizes
 * @returns {string[][] | null} id sequences, or null if a line is invalid
 */
export function buildAlternativeSequencesFromLines(lines, quizes) {
  if (!quizes || quizes.length === 0) return [];
  const baseIds = quizes.map((q) => q.id);
  const out = [];
  const primaryKey = baseIds.join("\u0001");

  const rawLines = Array.isArray(lines) ? lines : [];
  for (const line of rawLines) {
    const tokens = tokenizeLine(line);
    if (tokens.length === 0) continue;
    if (tokens.length !== quizes.length) return null;
    const ids = [];
    for (const t of tokens) {
      const w = quizes.find(
        (q) => String(q.title ?? "").trim() === t
      );
      if (!w) return null;
      ids.push(w.id);
    }
    if (!sameMultisetOfIds(ids, baseIds)) return null;
    const k = ids.join("\u0001");
    if (k === primaryKey) continue;
    if (out.some((ex) => ex.join("\u0001") === k)) continue;
    out.push(ids);
  }
  return out;
}

/**
 * @param {string[][]|undefined} sequences
 * @param {{ id: string, title: string }[]} quizes
 * @returns {string[]}
 */
export function alternativeSequencesToLines(sequences, quizes) {
  if (!Array.isArray(sequences) || !quizes?.length) return [];
  return sequences
    .map((ids) => {
      if (!Array.isArray(ids)) return "";
      return ids
        .map((id) => quizes.find((q) => q.id === id)?.title)
        .filter((t) => t != null && String(t) !== "")
        .join(", ");
    })
    .filter((line) => line.length > 0);
}
