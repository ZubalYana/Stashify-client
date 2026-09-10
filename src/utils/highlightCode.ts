import hljs from "highlight.js";

const ALIASES: Record<string, string> = {
  "plain text": "plaintext",
  plaintext: "plaintext",
  text: "plaintext",
  "c++": "cpp",
  "c#": "csharp",
  "f#": "fsharp",
  "objective-c": "objectivec",
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  golang: "go",
  html: "xml",
  jsx: "javascript",
  tsx: "typescript",
};

export function highlightCode(code: string, language: string): string {
  const raw = (language ?? "").trim();
  const key = raw.toLowerCase();
  const compact = key.replace(/[\s_]+/g, "");
  const candidate = ALIASES[key] ?? ALIASES[compact] ?? compact;

  const lang =
    (hljs.getLanguage(candidate) ? candidate : null) ??
    (hljs.getLanguage(key) ? key : null) ??
    "plaintext";

  try {
    return hljs.highlight(code, { language: lang }).value;
  } catch {
    return hljs.highlight(code, { language: "plaintext" }).value;
  }
}
