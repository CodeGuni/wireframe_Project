import { ShortcutRegistry } from "../types/KeyboardShortcut";
export const defaultShortcuts: ShortcutRegistry = {
  undo: {
    id: "undo",
    key: "z",
    ctrl: true,
    category: "general",
    priority: "high",
    description: "Undo last action",
    action: {
      execute: () => {},
    },
  },
  redo: {
    id: "redo",
    key: "y",
    ctrl: true,
    category: "general",
    priority: "high",
    description: "Redo last action",
    action: {
      execute: () => {},
    },
  },
  delete: {
    id: "delete",
    key: "Delete",
    category: "shape",
    priority: "high",
    description: "Delete selected shapes",
    action: {
      execute: () => {},
    },
  },
  escape: {
    id: "escape",
    key: "Escape",
    category: "tool",
    priority: "high",
    description: "Cancel current action",
    action: {
      execute: () => {},
    },
  },
};
