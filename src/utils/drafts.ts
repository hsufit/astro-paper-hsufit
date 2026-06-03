import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

type DraftEntry = CollectionEntry<"drafts">;

const stripMarkdownExtension = (path: string) => path.replace(/\.mdx?$/i, "");

const splitDraftPath = (path: string) =>
  stripMarkdownExtension(path).split(/[\\/]/).filter(Boolean);

const humanizeSegment = (segment: string) =>
  segment
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());

export const getDraftSlug = (draft: Pick<DraftEntry, "id">) =>
  splitDraftPath(draft.id).map(segment => slugifyStr(segment)).join("/");

export const getDraftPath = (draft: Pick<DraftEntry, "id">) =>
  `/draft/${getDraftSlug(draft)}`;

export const getDraftTitle = (draft: Pick<DraftEntry, "id" | "data">) => {
  if (draft.data.title) return draft.data.title;

  const segments = splitDraftPath(draft.id);
  return humanizeSegment(segments.at(-1) ?? "Draft");
};

export const getDraftSourcePath = (draft: Pick<DraftEntry, "id">) =>
  `source/_drafts/${draft.id}${/\.mdx?$/i.test(draft.id) ? "" : ".md"}`;
