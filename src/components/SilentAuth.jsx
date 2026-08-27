import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, logout } from "@/redux/userSlice";
import userService from "../services/user";

// Runs once on app load. GET /user/me is the single source of truth for
// "am I logged in, as what role" — it reads the httpOnly session_token
// cookie server-side, so this just asks the backend and syncs redux.
export default function SilentAuth() {
  const hadPersistedUser = !!useSelector((state) => state.user.id);
  const persistedImage = useSelector((state) => state.user.image);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    userService.getMe().then((me) => {
      if (cancelled) return;

      if (me.ok) {
        // getMe's Image lookup can race with a profile-photo upload and
        // report null for an instant even though a photo exists — don't
        // let that transient null erase an image we already had for this
        // same session.
        dispatch(addUser({ ...me.body, image: me.body.image ?? persistedImage }));
      } else if (hadPersistedUser) {
        // redux-persist kept a stale user in localStorage from a session
        // that's no longer valid server-side — clear it so the app
        // reflects reality instead of showing someone as logged in forever.
        dispatch(logout());
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
