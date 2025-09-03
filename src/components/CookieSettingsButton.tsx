import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import CookiePreferences from './CookiePreferences';

interface CookieSettingsButtonProps {
  className?: string;
  variant?: 'text' | 'button';
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({ 
  className = '', 
  variant = 'text' 
}) => {
  const [showPreferences, setShowPreferences] = useState(false);

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setShowPreferences(true)}
          className={`inline-flex items-center gap-2 btn-responsive bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 ${className}`}
        >
          <Settings className="w-4 h-4" />
          Ustawienia cookies
        </button>
        <CookiePreferences 
          isOpen={showPreferences} 
          onClose={() => setShowPreferences(false)} 
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPreferences(true)}
        className={`text-sm text-gray-600 hover:text-primary-500 transition-colors ${className}`}
      >
        Ustawienia cookies
      </button>
      <CookiePreferences 
        isOpen={showPreferences} 
        onClose={() => setShowPreferences(false)} 
      />
    </>
  );
};

export default CookieSettingsButton;