import { useEffect, useState } from "react";
import userService from "@/services/user";

const DEBOUNCE_MS = 500;
const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const emptyResult = { recognized: false, name: "", verified: false };

// Debounced GET /user/check-email lookup — reusable anywhere a form needs
// to recognize a returning email as the user types it.
export function useDebouncedCheckEmail(email) {
  const [result, setResult] = useState(emptyResult);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEmailValid(email)) {
      setResult(emptyResult);
      return undefined;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const response = await userService.checkEmail(email);
      if (response.ok && response.body?.exists) {
        setResult({ recognized: true, name: response.body.name, verified: response.body.verified });
      } else {
        setResult(emptyResult);
      }
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [email]);

  return { ...result, loading };
}
