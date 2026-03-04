'use client';

import { useState } from 'react';

import { Menu, X } from 'lucide-react';

import { SidebarContent } from './SidebarContent';

const DocsSidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
        >
          <Menu className="h-4 w-4" />
          목차
        </button>
      </div>

      <aside className="[&::-webkit-scrollbar-thumb]:bg-border sticky top-24 hidden max-h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto lg:block [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-1">
        <h2 className="text-muted-foreground mb-4 text-sm font-semibold">목차</h2>
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="bg-background fixed left-0 top-0 z-50 flex h-full w-64 flex-col shadow-xl lg:hidden">
            <div className="flex shrink-0 items-center justify-between p-4 pb-0">
              <h2 className="text-sm font-semibold">목차</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-muted rounded-md p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="[&::-webkit-scrollbar-thumb]:bg-border flex-1 overflow-y-auto p-4 pt-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-1">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default DocsSidebar;
