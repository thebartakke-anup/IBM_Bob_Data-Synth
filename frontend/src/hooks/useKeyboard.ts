import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  description?: string;
}

export const useKeyboard = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};

// Global keyboard shortcuts hook
export const useGlobalKeyboardShortcuts = (callbacks: {
  onUpload?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl/Cmd + U: Upload
      if (isCtrlOrCmd && event.key === 'u' && callbacks.onUpload) {
        event.preventDefault();
        callbacks.onUpload();
      }

      // Ctrl/Cmd + S: Save
      if (isCtrlOrCmd && event.key === 's' && callbacks.onSave) {
        event.preventDefault();
        callbacks.onSave();
      }

      // Ctrl/Cmd + Z: Undo
      if (isCtrlOrCmd && !event.shiftKey && event.key === 'z' && callbacks.onUndo) {
        event.preventDefault();
        callbacks.onUndo();
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if (isCtrlOrCmd && event.shiftKey && event.key === 'z' && callbacks.onRedo) {
        event.preventDefault();
        callbacks.onRedo();
      }

      // Ctrl/Cmd + F: Search
      if (isCtrlOrCmd && event.key === 'f' && callbacks.onSearch) {
        event.preventDefault();
        callbacks.onSearch();
      }

      // F1 or ?: Help
      if ((event.key === 'F1' || event.key === '?') && callbacks.onHelp) {
        event.preventDefault();
        callbacks.onHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callbacks]);
};

// Keyboard shortcuts reference
export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'U'], description: 'Upload file', mac: ['⌘', 'U'] },
  { keys: ['Ctrl', 'S'], description: 'Save/Export', mac: ['⌘', 'S'] },
  { keys: ['Ctrl', 'Z'], description: 'Undo', mac: ['⌘', 'Z'] },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', mac: ['⌘', '⇧', 'Z'] },
  { keys: ['Ctrl', 'F'], description: 'Search', mac: ['⌘', 'F'] },
  { keys: ['Esc'], description: 'Close modal/dialog', mac: ['Esc'] },
  { keys: ['Tab'], description: 'Navigate forward', mac: ['Tab'] },
  { keys: ['Shift', 'Tab'], description: 'Navigate backward', mac: ['⇧', 'Tab'] },
  { keys: ['Enter'], description: 'Activate button', mac: ['Enter'] },
  { keys: ['Space'], description: 'Toggle checkbox', mac: ['Space'] },
  { keys: ['↑', '↓', '←', '→'], description: 'Navigate lists/tables', mac: ['↑', '↓', '←', '→'] },
  { keys: ['F1'], description: 'Show help', mac: ['F1'] },
  { keys: ['?'], description: 'Show keyboard shortcuts', mac: ['?'] },
];

// Made with Bob
