import { useState } from "react";
import TermsForShops from "./components/TermsForShops";
import { Checkbox } from "@mui/material";
import NewShopForm from "./components/NewShopForm";

export default function CreateShopTab() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeView, setActiveView] = useState(0);

  const ActiveView = () => {
    switch (activeView) {
      case 0:
        return (
          <>
            <TermsForShops />
            <form className="flex flex-col w-full max-w-4xl">
              <div className="flex items-center gap-2 ">
                <Checkbox
                  checked={termsAccepted}
                  onClick={() => setTermsAccepted(!termsAccepted)}
                />
                <span>I accept the terms and conditions</span>
              </div>
              <div className="flex justify-center">
                <button
                  className="button"
                  type="submit"
                  disabled={!termsAccepted}
                  onClick={() => setActiveView(1)}
                >
                  Next
                </button>
              </div>
            </form>
          </>
        );
      case 1:
        return <NewShopForm />;
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center max-w-full gap-2 overflow-hidden py-4 text-main-0 dark:text-main-1000 ">
      <ActiveView />
    </main>
  );
}
