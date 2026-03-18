'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { type SoundType, playSound } from './sounds';

interface SoundModeContextValue {
  isActive: boolean;
}

const SoundModeContext = createContext<SoundModeContextValue>({ isActive: false });

export const useSoundMode = () => useContext(SoundModeContext);

interface SoundGuard {
  play: (sound: SoundType, key: string, cooldown?: number) => void;
  suppress: (key: string, duration: number) => void;
}

function createSoundGuard(): SoundGuard {
  const recent = new Set<string>();
  const streak = new Map<string, number>();
  const streakTimers = new Map<string, ReturnType<typeof setTimeout>>();

  const suppress = (key: string, duration: number) => {
    recent.add(key);
    setTimeout(() => recent.delete(key), duration);
  };

  const play = (sound: SoundType, key: string, cooldown = 120) => {
    if (recent.has(key)) return;
    recent.add(key);
    setTimeout(() => recent.delete(key), cooldown);

    // 같은 키 연속 입력 시 피치 상승 (최대 4배)
    const count = (streak.get(key) ?? 0) + 1;
    streak.set(key, count);
    clearTimeout(streakTimers.get(key));
    streakTimers.set(key, setTimeout(() => streak.delete(key), 600));
    playSound(sound, Math.pow(1.2, count - 1));
  };

  return { play, suppress };
}

function isDestructiveTarget(el: Element): boolean {
  const text = el.textContent?.toLowerCase() ?? '';
  return (
    /삭제|제거|delete|remove/.test(text) ||
    el.classList.contains('destructive') ||
    !!el.closest('[class*="destructive"]') ||
    !!el.closest('[data-variant="destructive"]')
  );
}

const SKIP_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab',
  'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
  'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Home', 'End', 'PageUp', 'PageDown', 'Insert',
]);

const INPUT_SELECTOR =
  'input:not([type="hidden"]):not([type="submit"]):not([type="checkbox"]), textarea';

export const SoundModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const guardRef = useRef<SoundGuard>(createSoundGuard());

  const toggle = useCallback((next: boolean) => {
    if (next) {
      playSound('enable');
      toast('♪ RETRO SOUND: ON', {
        description: '모든 상호작용에 사운드가 활성화됩니다.',
        duration: 4000,
        style: {
          fontFamily: 'var(--font-pixel)',
          fontSize: '9px',
          background: '#0d0d0d',
          color: '#55FF55',
          border: '2px solid #55FF55',
          borderRadius: '0',
          boxShadow: '4px 4px 0 0 #55FF55',
        },
      });
    } else {
      playSound('disable');
      toast('♪ RETRO SOUND: OFF', {
        duration: 3000,
        style: {
          fontFamily: 'var(--font-pixel)',
          fontSize: '9px',
          background: '#0d0d0d',
          color: '#FF5555',
          border: '2px solid #FF5555',
          borderRadius: '0',
          boxShadow: '4px 4px 0 0 #FF5555',
        },
      });
    }
  }, []);

  const handleToggleClick = useCallback(() => {
    const newState = !isActiveRef.current;
    isActiveRef.current = newState;
    setIsActive(newState);
    toggle(newState);
  }, [toggle]);

  useEffect(() => {
    if (!isActive) return;
    const guard = guardRef.current;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-sound-trigger]')) return;

      const interactive = target.closest(
        'button, [role="button"], a[href], [role="menuitem"], [role="option"], [role="tab"]',
      );
      if (!interactive) return;

      // 다이얼로그 트리거는 open 사운드로 대체되므로 스킵
      const popup = interactive.getAttribute('aria-haspopup');
      if (popup === 'dialog' || popup === 'alertdialog') return;

      guard.play(isDestructiveTarget(interactive) ? 'error' : 'click', 'click-normal', 80);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const guard = guardRef.current;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.matches(INPUT_SELECTOR)) guard.play('softClick', 'input-focus', 300);
    };

    document.addEventListener('focus', handleFocus, true);
    return () => document.removeEventListener('focus', handleFocus, true);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const guard = guardRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (SKIP_KEYS.has(e.key)) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!target.matches(INPUT_SELECTOR)) return;
      guard.play('softClick', `key-${e.key}`, 60);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const guard = guardRef.current;

    const handleSubmit = () => {
      guard.play('complete', 'form-submit', 500);
      guard.suppress('toast-success', 1800); // complete와 select 겹침 방지
    };

    document.addEventListener('submit', handleSubmit, true);
    return () => document.removeEventListener('submit', handleSubmit, true);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const guard = guardRef.current;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          const el = mutation.target as HTMLElement;
          const state = el.getAttribute('data-state');
          const role = el.getAttribute('role');

          if (role === 'dialog') {
            if (state === 'open') { guard.suppress('click-normal', 200); guard.play('open', 'dialog-open', 300); }
            else if (state === 'closed') guard.play('close', 'dialog-close', 300);
          } else if (role === 'combobox' && state === 'open') {
            guard.suppress('click-normal', 150);
            guard.play('select', 'select-open', 300);
          }
          continue;
        }

        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            // Radix Dialog는 Portal로 body에 직접 삽입됨
            const dialogRole = node.getAttribute('role');
            const isDialog = dialogRole === 'dialog' || dialogRole === 'alertdialog'
              || !!node.querySelector('[role="dialog"], [role="alertdialog"]');
            if (isDialog) {
              guard.suppress('click-normal', 250);
              guard.play('open', 'dialog-open', 300);
              continue;
            }

            const toastEl = node.hasAttribute('data-sonner-toast')
              ? node : node.querySelector('[data-sonner-toast]');
            if (toastEl) {
              const type = (toastEl as HTMLElement).getAttribute('data-type');
              if (type === 'success') guard.play('select', 'toast-success', 300);
              else if (type === 'error') guard.play('error', 'toast-error', 300);
              continue;
            }

            const listbox = node.getAttribute('role') === 'listbox'
              ? node : node.querySelector('[role="listbox"]');
            if (listbox) {
              guard.suppress('click-normal', 150);
              guard.play('select', 'listbox-open', 300);
            }
          }

          for (const node of mutation.removedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            const role = node.getAttribute('role');
            const wasDialog = role === 'dialog' || role === 'alertdialog'
              || !!node.querySelector('[role="dialog"], [role="alertdialog"]');
            if (wasDialog) guard.play('close', 'dialog-close', 300);
          }
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['data-state'],
    });
    return () => observer.disconnect();
  }, [isActive]);

  return (
    <SoundModeContext.Provider value={{ isActive }}>
      {children}
      <button
        data-sound-trigger
        onClick={handleToggleClick}
        aria-label={isActive ? 'Retro Sound ON — click to disable' : 'Click to enable Retro Sound'}
        title={isActive ? '♪ RETRO SOUND ON' : '♪'}
        style={{
          position: 'fixed',
          bottom: '12px',
          right: '12px',
          zIndex: 9999,
          fontFamily: 'var(--font-pixel)',
          fontSize: '8px',
          color: isActive ? '#55FF55' : 'currentColor',
          background: 'transparent',
          border: 'none',
          padding: '4px',
          cursor: 'pointer',
          opacity: isActive ? 1 : 0.15,
          outline: 'none',
          textShadow: isActive ? '0 0 8px #55FF55' : 'none',
          animation: isActive ? 'sfx-pulse 2s ease-in-out infinite' : 'none',
          transition: 'opacity 0.3s, color 0.3s',
          userSelect: 'none',
        }}
      >
        ♪
      </button>
      <style>{`
        @keyframes sfx-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </SoundModeContext.Provider>
  );
};
