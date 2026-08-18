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
// another tab write a new value to the persisted store, so it re-hydrates
// fresh via PersistGate. Safe from self-triggering: per spec, the `storage`
// event only fires in OTHER tabs than the one that wrote the value, never in
// the writing tab itself, so this can't loop within a single tab.
window.addEventListener("storage", (event) => {
  if (event.key === "persist:root" && event.newValue !== event.oldValue) {
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
