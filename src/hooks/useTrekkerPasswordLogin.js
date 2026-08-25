import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";
import userService from "@/services/user";

// POST /login -> getMe -> addUser, the same sequence CredentialsLogin uses.
// Shared by TravelerJoin's inline recognized-Trekker path and the
// standalone TrekkerLogin page so that sequence exists in one place.
export function useTrekkerPasswordLogin(email) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await userService.logIn({ email, password });
      if (!response.ok) {
        setError(response.message || "Invalid credentials");
        return false;
      }

      const me = await userService.getMe();
      if (!me.ok) {
        setError(me.message || "Could not load your account");
        return false;
      }

      dispatch(addUser(me.body));
      return true;
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error, intentá de nuevo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { password, setPassword, submit, loading, error };
}
