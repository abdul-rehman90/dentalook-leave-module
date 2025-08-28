"use client"
import { useState, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial width
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default useWindowWidth;
