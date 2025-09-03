import { Settings } from "lucide-react";
import React from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

interface CookieSettingsButtonProps {
  className?: string;
  variant?: "text" | "button";
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({
  className = "",
  variant = "text",
}) => {
  const { openPreferences } = useCookieConsent();

  if (variant === "button") {
    return (
      <button
        onClick={openPreferences}
        className={`inline-flex items-center gap-2 btn-responsive bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 ${className}`}
      >
        <Settings className="w-4 h-4" />
        Ustawienia cookies
      </button>
    );
  }

  return (
    <button
      onClick={openPreferences}
      className={`text-sm text-gray-600 hover:text-primary-500 transition-colors ${className}`}
    >
      Ustawienia cookies
    </button>
  );
};

export default CookieSettingsButton;
