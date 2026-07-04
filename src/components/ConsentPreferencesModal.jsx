import { useDispatch, useSelector } from "react-redux";
import { savePreferences, closePreferences } from "../redux/cookieSlice.js";
import { useState, useEffect } from "react";

export default function ConsentPreferencesModal() {
  const dispatch = useDispatch();
  const { showPreferences, consent } = useSelector((state) => state.cookies);

  const [prefs, setPrefs] = useState({
    analytics: false,
    preferences: false,
    marketing: false,
  });

  useEffect(() => {
    if (consent) {
      setPrefs({
        analytics: consent.analytics,
        preferences: consent.preferences,
        marketing: consent.marketing,
      });
    }
  }, [consent]);

  if (!showPreferences) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-main-900 w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-white">
          Cookie Preferences
        </h2>

        <div className="space-y-4">
          {Object.keys(prefs).map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="capitalize text-zinc-700 dark:text-zinc-100 font-medium">
                {cat}
              </span>

              <input
                type="checkbox"
                checked={prefs[cat]}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    [cat]: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-main-400 text-white"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => dispatch(closePreferences())}
            className="button"
          >
            Cancel
          </button>

          <button
            onClick={() => dispatch(savePreferences(prefs))}
            className="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
