import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrekkerVerificationModal from "@/components/TrekkerVerificationModal/TrekkerVerificationModal";

// Any current or future entry point to a Trekker-only action (AI chat,
// purchase, ...) calls guardAction(fn) instead of calling fn directly.
// No active session at all -> /join (the verification modal's endpoint
// requires a session and would just fail for an anonymous visitor).
// Logged in but unverified -> the verification modal, and fn fires
// automatically once they complete it. Verified -> fn runs immediately.
export function useRequireTrekker() {
  const userId = useSelector((state) => state.user.id);
  const verified = useSelector((state) => state.user.verified);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pendingAction = useRef(null);

  const guardAction = (action) => {
    if (!userId) {
      navigate("/join");
      return;
    }
    if (verified) {
      action();
      return;
    }
    pendingAction.current = action;
    setOpen(true);
  };

  const handleSuccess = () => {
    pendingAction.current?.();
    pendingAction.current = null;
  };

  const verificationModal = (
    <TrekkerVerificationModal open={open} setOpen={setOpen} onSuccess={handleSuccess} />
  );

  return { guardAction, verificationModal };
}
