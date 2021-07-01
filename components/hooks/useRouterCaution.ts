import { useEffect } from "react";

export const useRouterCaution = () => {
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    const message =
      "Caution: Reloading or closing the window will immediately stop the actions that are being performed.";
    e.returnValue = message;
    return message;
  };
};
