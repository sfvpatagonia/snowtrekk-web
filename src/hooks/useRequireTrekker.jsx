import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import TrekkerVerificationModal from "@/components/TrekkerVerificationModal/TrekkerVerificationModal";

// Any current or future entry point to a Trekker-only action (AI chat,
// purchase, ...) calls guardAction(fn) instead of calling fn directly.
// Verified users pass straight through; unverified travelers see the
// verification modal, and fn fires automatically once they complete it.
export function useRequireTrekker() {
  const verified = useSelector((state) => state.user.verified);
  const [open, setOpen] = useState(false);
  const pendingAction = useRef(null);

  const guardAction = (action) => {
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
