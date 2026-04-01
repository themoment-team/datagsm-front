'use client';

import { useState } from 'react';

import { Menu, X } from 'lucide-react';

import { SidebarContent } from './SidebarContent';

const DocsSidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex cursor-pointer items-center gap-2 border border-foreground px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background font-mono"
        >
          <Menu className="h-4 w-4" />
          목차
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="sidebar-scrollbar sticky top-24 hidden max-h-[calc(100vh-7rem)] w-60 shrink-0 overflow-y-auto lg:block"
      >
        <div className="mb-5 border-b-2 border-foreground pb-3">
          <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground font-mono">
            DataGSM
          </p>
          <h2 className="text-foreground font-pixel text-[10px]">
            Docs
          </h2>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="bg-background fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-2 border-foreground lg:hidden">
            <div className="flex shrink-0 items-center justify-between border-b-2 border-foreground p-4">
              <h2 className="text-foreground font-pixel text-[9px]">
                Docs
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer border border-foreground p-1 hover:bg-foreground hover:text-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="sidebar-scrollbar flex-1 overflow-y-auto p-4">
              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default DocsSidebar;
