import { useEffect } from "react";

const SESSION_KEY = "st_tracked";
const apiUrl = import.meta.env.VITE_API_URL;

function getDeviceType(ua) {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobile|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") || undefined,
    utmMedium: p.get("utm_medium") || undefined,
    utmCampaign: p.get("utm_campaign") || undefined,
  };
}

export default function VisitorTracker({ country, language }) {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let sessionId = localStorage.getItem("st_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("st_session_id", sessionId);
    }

    const payload = {
      sessionId,
      country: country || undefined,
      language: language || navigator.language?.split("-")[0] || undefined,
      referrer: document.referrer || undefined,
      landingPage: window.location.pathname,
      ...getUtmParams(),
    };

    fetch(`${apiUrl}/visitor/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => sessionStorage.setItem(SESSION_KEY, "1"))
      .catch(() => {});
  }, []);

  return null;
}
