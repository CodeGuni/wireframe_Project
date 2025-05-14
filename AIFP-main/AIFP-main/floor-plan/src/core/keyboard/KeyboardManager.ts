import { KeyboardShortcut } from "./types/KeyboardShortcut";

export class KeyboardManager {
  private static instance: KeyboardManager;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();

  private constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  registerShortcut(id: string, shortcut: KeyboardShortcut): void {
    this.shortcuts.set(id, shortcut);
  }

  unregisterShortcut(id: string): void {
    this.shortcuts.delete(id);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.shortcuts.forEach((shortcut) => {
      if (
        event.key === shortcut.key &&
        !!shortcut.ctrl === event.ctrlKey &&
        !!shortcut.shift === event.shiftKey &&
        !!shortcut.alt === event.altKey
      ) {
        event.preventDefault();
        shortcut.action.execute();
      }
    });
  };
}
