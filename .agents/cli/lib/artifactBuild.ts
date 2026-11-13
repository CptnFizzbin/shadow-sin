import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"

/** Limits the Artifact publisher enforces on a multi-file page. */
const artifactLimits = {
  maxFilesPerPublish: 255,
  maxTextFileBytes: 16 * 1024 * 1024,
  maxBinaryFileBytes: 15 * 1024 * 1024,
  maxPublishBytes: 64 * 1024 * 1024,
}

/** Files Vite copies from `public/` that only mean something on the real host. */
export const hostOnlyFiles = ["CNAME", "robots.txt"]

const textExtensions = new Set([".html", ".js", ".mjs", ".css", ".json", ".svg", ".txt", ".webmanifest", ".map"])

const replacementCharacter = "�"

/** Every file under `dir`, as `/`-separated paths relative to it, sorted. */
function listFiles(dir: string): string[] {
  const files: string[] = []

  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) walk(fullPath)
      else files.push(path.relative(dir, fullPath).split(path.sep).join("/"))
    }
  }

  walk(dir)
  return files.sort()
}

function isTextFile(filePath: string): boolean {
  return textExtensions.has(path.extname(filePath).toLowerCase())
}

/**
 * Rewrites every literal U+FFFD in `content` as the escape that `extension`'s format reads back as
 * the same character. The Artifact publisher refuses a file containing a literal U+FFFD, assuming
 * it marks a botched encoding, even where a library uses it on purpose (micromark's
 * `replacementCharacter` constant).
 */
function escapeReplacementCharacters(content: string, extension: string): string {
  if (!content.includes(replacementCharacter)) return content

  const escapes: Record<string, string> = {
    ".css": "\\FFFD ",
    ".html": "&#xFFFD;",
    ".svg": "&#xFFFD;",
  }
  const escape = escapes[extension.toLowerCase()] ?? "\\uFFFD"

  return content.split(replacementCharacter).join(escape)
}

/** Applies {@link escapeReplacementCharacters} to every text file under `dir`, returning the files it changed. */
export function escapeReplacementCharactersInDir(dir: string): string[] {
  const changed: string[] = []

  for (const file of listFiles(dir).filter(isTextFile)) {
    const fullPath = path.join(dir, file)
    const content = readFileSync(fullPath, "utf8")
    const escaped = escapeReplacementCharacters(content, path.extname(file))
    if (escaped !== content) {
      writeFileSync(fullPath, escaped, "utf8")
      changed.push(file)
    }
  }

  return changed
}

export interface BuildFile {
  path: string
  bytes: number
}

/** Problems that would make the Artifact publisher refuse `files`, as human-readable messages. */
export function findLimitProblems(files: BuildFile[]): string[] {
  const problems: string[] = []
  const supportingFiles = files.filter((file) => file.path !== "index.html")

  if (supportingFiles.length > artifactLimits.maxFilesPerPublish) {
    problems.push(
      `${supportingFiles.length} supporting files exceed the ${artifactLimits.maxFilesPerPublish}-file limit per publish`,
    )
  }

  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
  if (totalBytes > artifactLimits.maxPublishBytes) {
    problems.push(`${formatBytes(totalBytes)} exceeds the ${formatBytes(artifactLimits.maxPublishBytes)} publish limit`)
  }

  for (const file of files) {
    const limit = isTextFile(file.path) ? artifactLimits.maxTextFileBytes : artifactLimits.maxBinaryFileBytes
    if (file.bytes > limit) problems.push(`${file.path} is ${formatBytes(file.bytes)}, over the ${formatBytes(limit)} limit`)
  }

  return problems
}

/**
 * Root-relative asset references (`"/assets/…"`) in built JS, CSS and HTML. An artifact is served
 * under a sub-path, so these would 404; a build made with `--base ./` should have none.
 */
export function findRootRelativeAssetReferences(content: string): string[] {
  const matches = content.match(/["'`(]\/(?:assets|favicon)[\w./-]*/g) ?? []
  return [...new Set(matches.map((match) => match.slice(1)))]
}

export function readBuildFiles(dir: string): BuildFile[] {
  return listFiles(dir).map((file) => ({ path: file, bytes: statSync(path.join(dir, file)).size }))
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** The arguments an Artifact `publish` call needs for the build in `outDir`. */
export interface PublishManifest {
  file_path: string
  root: string
  files: { path: string }[]
  /**
   * Paths the previous build in the same folder had and this one doesn't. Chunk names change with
   * every build, so when republishing to the same artifact, remove these with `null` entries.
   */
  stale: string[]
  description: string
  label: string
}

export function createPublishManifest(
  outDir: string,
  files: BuildFile[],
  { description, label, previous }: { description: string, label: string, previous?: PublishManifest },
): PublishManifest {
  const supportingFiles = files.filter((file) => file.path !== "index.html").map((file) => ({ path: file.path }))
  const current = new Set(supportingFiles.map((file) => file.path))
  const previousPaths = [...(previous?.files.map((file) => file.path) ?? []), ...(previous?.stale ?? [])]

  return {
    file_path: path.join(outDir, "index.html"),
    root: outDir,
    files: supportingFiles,
    // Stale paths carry over until a build has them again, in case the last publish skipped them.
    stale: [...new Set(previousPaths)].filter((stalePath) => !current.has(stalePath)).sort(),
    description,
    label,
  }
}
