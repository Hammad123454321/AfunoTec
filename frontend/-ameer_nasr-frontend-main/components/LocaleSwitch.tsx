"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const LOCALES = {
  en: "English",
  fr: "Français",
  mg: "Malagasy",
} as const;

type Locale = keyof typeof LOCALES;

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");

  // Detect current locale from URL
  useEffect(() => {
    const pathLocale = pathname.split("/")[1] as Locale;
    if (pathLocale && LOCALES[pathLocale]) {
      setCurrentLocale(pathLocale);
    }
  }, [pathname]);

  // Initialize Google Translate once with error handling
  useEffect(() => {
    if (window.googleTranslateLoaded) return;

    // Suppress the removeChild error
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(
      this: Node,
      child: T
    ): T {
      try {
        if (this.contains(child)) {
          // ensure the returned value is typed as T
          return originalRemoveChild.call(this, child) as T;
        }
        return child;
      } catch (e) {
        console.warn("Suppressed removeChild error:", e);
        return child;
      }
    };

    window.googleTranslateElementInit = () => {
      try {
        // Ensure google.translate is available before trying to instantiate it
        if (
          typeof window === "undefined" ||
          !window.google ||
          !window.google.translate ||
          !window.google.translate.TranslateElement
        ) {
          console.error("Google Translate API is not available on window");
          return;
        }

        // Use a s-cast to avoid TS errors while calling the external constructor
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,mg",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        window.googleTranslateLoaded = true;
        console.log("✅ Google Translate loaded");
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

    // Hide Google Translate banner
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
      font {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
      }
      
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      // Restore original removeChild
      Node.prototype.removeChild = originalRemoveChild;
    };
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Build new path
    const segments = pathname.split("/").filter(Boolean);

    if (LOCALES[segments[0] as Locale]) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = "/" + segments.join("/");

    // Clear any existing Google Translate cookie first
    document.cookie =
      "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Set new Google Translate cookie
    const cookieValue = newLocale === "en" ? "/en/en" : `/en/${newLocale}`;
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;

    // Small delay to ensure cookie is set
    setTimeout(() => {
      window.location.href = newPath;
    }, 100);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="uppercase flex items-center gap-2"
            translate="no"
          >
            {currentLocale} <LucideChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[120px]">
          {Object.entries(LOCALES).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => switchLocale(key as Locale)}
              className="capitalize cursor-pointer"
              disabled={key === currentLocale}
              translate="no"
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div id="google_translate_element" style={{ display: "none" }} />
    </div>
  );
}
