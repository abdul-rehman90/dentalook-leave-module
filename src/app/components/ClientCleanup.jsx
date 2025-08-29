"use client";

import { useEffect } from "react";

export default function ClientCleanup() {
  useEffect(() => {
    const clearKeys = () => {
      try {
        localStorage.removeItem("leaveRequestId");
      } catch (e) {
        // noop
      }
    };

    window.addEventListener("beforeunload", clearKeys);
    window.addEventListener("pagehide", clearKeys);

    return () => {
      window.removeEventListener("beforeunload", clearKeys);
      window.removeEventListener("pagehide", clearKeys);
    };
  }, []);

  return null;
}


