// Repairs duplicated schemes (e.g. "https:https://x.com") and adds a scheme
// when missing, then validates the result is a real http(s) URL.
export function normalizeUrl(input) {
  if (!input) return null;

  let value = input.trim();
  if (!value) return null;

  value = value.replace(/^https?:\/{0,2}(https?:\/\/)/i, "$1");

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}
