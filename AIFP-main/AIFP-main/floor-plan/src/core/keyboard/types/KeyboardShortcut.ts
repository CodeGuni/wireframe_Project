export type ShortcutCategory =
  | "general"
  | "shape"
  | "tool"
  | "view"
  | "history";
export type ShortcutPriority = "high" | "medium" | "low";

export interface ShortcutAction {
  execute: () => void;
  undo?: () => void;
}

export interface KeyboardShortcut {
  id: string;
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  category: ShortcutCategory;
  priority: ShortcutPriority;
  description: string;
  action: ShortcutAction;
  disabled?: boolean;
}

export interface ShortcutRegistry {
  [key: string]: KeyboardShortcut;
}
