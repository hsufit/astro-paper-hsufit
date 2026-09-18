import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const astroRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const repositoryRoot = path.dirname(astroRoot);

const exists = async target => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const assertGeneratedTarget = target => {
  const relativeTarget = path.relative(astroRoot, target);

  if (
    relativeTarget === "" ||
    relativeTarget.startsWith("..") ||
    path.isAbsolute(relativeTarget)
  ) {
    throw new Error(`Refusing to replace path outside AstroPaper: ${target}`);
  }
};

const replaceDirectory = async (source, destination, label) => {
  if (!(await exists(source))) {
    console.log(`[sync] ${label} source not found; skipping.`);
    return;
  }

  assertGeneratedTarget(destination);
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
  console.log(`[sync] ${label} copied to ${path.relative(astroRoot, destination)}.`);
};

await replaceDirectory(
  path.join(repositoryRoot, "html_page"),
  path.join(astroRoot, "dist", "html_page"),
  "Standalone HTML pages"
);

await replaceDirectory(
  path.join(astroRoot, "dist", "pagefind"),
  path.join(astroRoot, "public", "pagefind"),
  "Pagefind assets"
);
