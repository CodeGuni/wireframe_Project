import { useEffect } from "react";
import { KeyboardManager } from "../core/keyboard";
import { ShapeManager } from "../core/manager/ShapeManager";
import { ToolId } from "../types";

export const useKeyboardShortcuts = (
  shapeManager: ShapeManager,
  selectedShapes: string[],
  setActiveTool: (tool: ToolId) => void
) => {
  useEffect(() => {
    const keyboard = KeyboardManager.getInstance();

    // Register canvas shortcuts
    keyboard.registerShortcut("delete", {
      id: "delete",
      key: "Delete",
      category: "shape",
      priority: "high",
      description: "Delete selected shapes",
      action: {
        execute: () => {
          shapeManager.removeShapes(selectedShapes);
        },
      },
    });

    keyboard.registerShortcut("select", {
      id: "select",
      key: "v",
      category: "tool",
      priority: "medium",
      description: "Select tool",
      action: {
        execute: () => setActiveTool("select"),
      },
    });

    keyboard.registerShortcut("wall", {
      id: "wall",
      key: "w",
      category: "tool",
      priority: "medium",
      description: "Wall tool",
      action: {
        execute: () => setActiveTool("edit"),
      },
    });
    keyboard.registerShortcut("undo", {
      id: "undo",
      key: "z",
      ctrl: true,
      category: "history",
      priority: "high",
      description: "Undo last action",
      action: {
        execute: () => shapeManager.undo(),
      },
    });

    return () => {
      keyboard.unregisterShortcut("delete");
      keyboard.unregisterShortcut("select");
      keyboard.unregisterShortcut("wall");
    };
  }, [shapeManager, selectedShapes, setActiveTool]);
};
