import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

import { PersistGate } from "redux-persist/integration/react";

// Cross-tab login sync: a magic-link email opens in a new tab, which logs in
// correctly (dispatch(addUser(...)) updates redux-persist's localStorage
// snapshot for that tab). Any other already-open tab — e.g. the /join tab the
// user was waiting on — never learns about it, since PersistGate only
// rehydrates once, on each tab's own initial load. Reload the tab when we see
// another tab actually log in or out, so it re-hydrates fresh via
// PersistGate. Safe from self-triggering: per spec, the `storage` event only
// fires in OTHER tabs than the one that wrote the value, never in the
// writing tab itself, so this can't loop within a single tab.
//
// persist:root is rewritten on ANY change to a persisted slice — not just
// user, but also theme, cart, shop, and guide (which Header.jsx updates on
// every in-app navigation). Comparing the raw strings reloaded every open
// tab on nearly any action in any other tab, not just real login/logout.
// Only reload when the user slice's id actually changed.
//
// redux-persist double-encodes: the parsed persist:root object's `user`
// property is itself a JSON string, not a nested object, so this needs two
// JSON.parse calls.
const getPersistedUserId = (rawValue) => {
  if (!rawValue) return undefined;
  const root = JSON.parse(rawValue);
  return JSON.parse(root.user).id;
};

window.addEventListener("storage", (event) => {
  if (event.key !== "persist:root") return;

  try {
    const oldUserId = getPersistedUserId(event.oldValue);
    const newUserId = getPersistedUserId(event.newValue);

    if (oldUserId !== newUserId) {
      window.location.reload();
    }
  } catch {
    // Malformed persist:root on either side — fail safe, don't reload on
    // something we can't actually verify is a real login/logout change.
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
