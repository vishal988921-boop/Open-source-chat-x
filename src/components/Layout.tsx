import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-[var(--bg-color)] overflow-hidden">
      {sidebar}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-color)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--accent-color)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        
        {children}
      </main>
    </div>
  );
};
