import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'neon' | 'minimal';
type Accent = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });
  
  const [accent, setAccent] = useState<Accent>(() => {
    return (localStorage.getItem('accent') as Accent) || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('theme-dark', 'theme-neon', 'theme-minimal');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accent', accent);
    document.documentElement.classList.remove('accent-blue', 'accent-purple', 'accent-emerald', 'accent-rose', 'accent-amber');
    document.documentElement.classList.add(`accent-${accent}`);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
