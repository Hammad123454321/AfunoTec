"use client";

import { useEffect } from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Only initialize once
    if (window.googleTranslateLoaded) return;

    // Suppress the removeChild error
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(
      this: Node,
      child: T
    ): T {
      try {
        if (this.contains(child)) {
          return originalRemoveChild.call(this, child) as T;
        }
        return child;
      } catch (e) {
        // Silently suppress the error
        return child;
      }
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      try {
        // Guard and narrow types: ensure window.google and its translate API are available
        if (
          window.google &&
          window.google.translate &&
          typeof window.google.translate.TranslateElement === "function"
        ) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,fr,mg",
              autoDisplay: false,
            },
            "google_translate_element"
          );
          window.googleTranslateLoaded = true;
          console.log("✅ Google Translate loaded globally");
        } else {
          console.error("google.translate is not available on window");
        }
      } catch (error) {
        console.error("Failed to initialize Google Translate:", error);
      }
    };

    // Load script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () =>
      console.error("Failed to load Google Translate script");
    document.body.appendChild(script);

    // Hide Google Translate UI
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame { 
        display: none !important; 
      }
      body { 
        top: 0 !important; 
        position: static !important;
      }
      .skiptranslate {
        display: none !important;
      }
      #google_translate_element {
        display: none !important;
      }
      .goog-te-combo {
        display: none !important;
      }
      
      font {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
      }
      
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      Node.prototype.removeChild = originalRemoveChild;
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      {children}
    </>
  );
}
