import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { detectDirection, layoutDirectionForSequencedQuiz } from "@/utils/detectDirection";

/**
 * Walk quiz editor values (flat rows, groups, line-connect, blank-space, consonant-blend) and
 * detect Arabic / RTL for the whole form area.
 */
export function getFormLayoutDirection(title, quizes) {
  const t = title != null ? String(title) : "";
  const parts = [t];

  const visit = (q) => {
    if (q == null) return;
    if (Array.isArray(q)) {
      q.forEach(visit);
      return;
    }
    if (typeof q === "string") {
      if (q.trim()) parts.push(q);
      return;
    }
    if (typeof q !== "object") return;

    if (q.title != null) {
      if (Array.isArray(q.title)) {
        q.title.forEach((s) => {
          if (s != null && String(s).trim()) parts.push(String(s));
        });
      } else if (String(q.title).trim()) {
        parts.push(String(q.title));
      }
    }
    if (q.name != null && String(q.name).trim()) {
      parts.push(String(q.name));
    }
    for (const k of ["stem", "blend", "full", "wrongBlends", "answer", "line"]) {
      if (q[k] != null && String(q[k]).trim()) {
        parts.push(String(q[k]));
      }
    }
    if (Array.isArray(q.items)) {
      q.items.forEach(visit);
    }
    if (Array.isArray(q.root)) {
      q.root.forEach(visit);
    }
    if (q.left) {
      visit(q.left);
    }
    if (q.right) {
      visit(q.right);
    }
  };

  visit(Array.isArray(quizes) ? quizes : []);

  const flat = parts.join(" ").trim();
  if (flat) {
    return detectDirection(flat);
  }
  // Fallback: same as a simple sequenced title + top-level .title only
  return layoutDirectionForSequencedQuiz({
    title: t,
    quizes: (Array.isArray(quizes) ? quizes : []).map((x) => ({
      id: x?.id,
      title: typeof x?.title === "string" ? x.title : "",
    })),
  });
}

export function useQuizFormLayoutDir() {
  const { control } = useFormContext();
  const title = useWatch({ control, name: "title" });
  const quizes = useWatch({ control, name: "quizes" });
  const layoutDir = useMemo(
    () => getFormLayoutDirection(title, quizes),
    [title, quizes]
  );
  return {
    layoutDir,
    isRtl: layoutDir === "rtl",
  };
}

/**
 * e.g. rearrange: include alternative order line strings
 */
export function getFormLayoutDirectionWithExtra(
  title,
  quizes,
  extraText = ""
) {
  const extra = String(extraText ?? "").trim();
  if (extra && detectDirection(extra) === "rtl") {
    return "rtl";
  }
  return getFormLayoutDirection(title, quizes);
}
