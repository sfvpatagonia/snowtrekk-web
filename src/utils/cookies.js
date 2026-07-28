export const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(
    JSON.stringify(value),
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

export const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) => row.startsWith(name + "="));
  if (!found) return null;

  try {
    return JSON.parse(decodeURIComponent(found.split("=")[1]));
  } catch {
    return null;
  }
};
