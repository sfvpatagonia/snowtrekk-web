import { useDispatch, useSelector } from "react-redux";
import { acceptAll, rejectAll, openPreferences } from "../redux/cookieSlice";
import { useEffect } from "react";
import { setConsentFromCookie } from "../redux/cookieSlice";

export default function ConsentManager() {
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const found = cookies.find((row) =>
      row.startsWith("snowtrekk_cookie_consent="),
    );

    if (found) {
      const parsed = JSON.parse(decodeURIComponent(found.split("=")[1]));
      dispatch(setConsentFromCookie(parsed));
    } else {
      dispatch(setConsentFromCookie(null));
    }
  }, []);
  const dispatch = useDispatch();
  const showBanner = useSelector((state) => state.cookies.showBanner);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-120 bg-main-200  text-white  shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm md:text-base text-black">
          This website uses cookies to ensure you get the best experience on our
          site.
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => dispatch(openPreferences())}
            className="button"
          >
            Config
          </button>

          <button onClick={() => dispatch(rejectAll())} className="button">
            Reject
          </button>

          <button onClick={() => dispatch(acceptAll())} className="button">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
