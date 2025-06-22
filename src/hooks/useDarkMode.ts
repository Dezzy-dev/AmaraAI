import { useState, useEffect } from 'react';

export function useDarkMode(): [boolean, (isDark: boolean) => void] {
  const [isDark, setIsDark] = useState(() => {
    const localTheme = window.localStorage.getItem('theme');
    return localTheme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
}