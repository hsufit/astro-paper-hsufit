import type { CollectionEntry } from "astro:content";
import { getPath } from "./getPath";

const HEXO_TIMEZONE = "Asia/Taipei";

const trimLeadingSlash = (path: string) => path.replace(/^\/+/, "");

const withTrailingSlash = (path: string) =>
  path.endsWith("/") ? path : `${path}/`;

const getHexoDatePath = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HEXO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const dateParts = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

export const getHexoRedirectSlug = (post: CollectionEntry<"blog">) => {
  const postPath = trimLeadingSlash(getPath(post.id, post.filePath, false));
  return `${getHexoDatePath(post.data.pubDatetime)}/${postPath}`;
};

export const getPostRedirectTarget = (post: CollectionEntry<"blog">) =>
  withTrailingSlash(getPath(post.id, post.filePath));
