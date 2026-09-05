import React from 'react';

interface LanguageSwitcherProps {
  variant?: 'dark' | 'light' | 'compact';
  showLabel?: boolean;
  className?: string;
}

// Multi-language switcher disabled per user request
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = () => {
  return null;
};
