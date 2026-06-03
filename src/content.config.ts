import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

// Use the markdown source out of the framework
// export const BLOG_PATH = "src/data/blog";
export const BLOG_PATH = "../source/_posts";
export const DRAFT_PATH = "../source/_drafts";

const optionalDate = z.preprocess(value => {
  if (value === undefined || value === null || value === "") return undefined;

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.valueOf()) ? undefined : date;
}, z.date().optional().nullable());

const draftTags = z.preprocess(value => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return undefined;
}, z.array(z.string()).default(["draft"]));

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const drafts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: `./${DRAFT_PATH}` }),
  schema: z.object({
    title: z.coerce.string().optional(),
    description: z.coerce.string().optional(),
    pubDatetime: optionalDate,
    modDatetime: optionalDate,
    tags: draftTags,
  }),
});

export const collections = { blog, drafts };
