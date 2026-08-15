import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, logout } from "@/redux/userSlice";
import userService from "../services/user";

// Runs once on app load. redux-persist already keeps the whole user slice
// (including the JWT) in localStorage, so `user.id` being set on mount
// proves nothing about whether that JWT is still valid — it survives
// untouched long after the 7-day JWT itself has expired. So this always
// checks the current token against the backend first, and only falls back
// to the long-lived traveler_session httpOnly cookie (from a prior
// /join → magic-link login) if that check fails or there's no token at
// all. No-ops (and stays silent) for anyone without that cookie, e.g.
// first-time visitors or password-based (admin/business) users.
export default function SilentAuth() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const hadStaleToken = !!user.token;

      if (user.token) {
        const currentTokenStillValid = await userService.verifyTokenRequest(user.token);
        if (currentTokenStillValid || cancelled) return;
      }

      const refreshResponse = await userService.refreshTravelerSession();
      if (cancelled) return;

      if (refreshResponse.ok) {
        const authToken = refreshResponse.body.token;
        const verifyResponse = await userService.verifyTokenRequest(authToken);
        if (!verifyResponse || cancelled) return;

        sessionStorage.setItem("token", authToken);
        dispatch(
          addUser({
            id: verifyResponse.body.id,
            name: verifyResponse.body.name,
            email: verifyResponse.body.email,
            isAdmin: verifyResponse.body.isAdmin,
            isSuperAdmin: verifyResponse.body.isSuperAdmin,
            role: verifyResponse.body.role,
            token: authToken,
          })
        );
        return;
      }

      // No cookie to recover with either. If we had a token that just
      // failed verification, the persisted user/id is now stale — without
      // this, ProtectedRoute (which only checks `user.id` truthiness, not
      // token validity) would keep letting them into pages that will 401
      // on every request. Clear it so the app reflects reality.
      if (hadStaleToken) {
        dispatch(logout());
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
