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

      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 lg:block">
        <h2 className="text-muted-foreground mb-4 text-sm font-semibold">목차</h2>
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="bg-background fixed left-0 top-0 z-50 h-full w-64 shadow-xl lg:hidden">
            <div className="p-4">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold">목차</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-muted rounded-md p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default DocsSidebar;
