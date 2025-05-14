import { RefObject } from "react";
import { PanelState, PanelStateChangeCallback, PanelType } from ".";

/**
 * Manages the state and behavior of panels in the application.
 * Handles panel positioning, visibility, and state management with a pub/sub pattern.
 *
 * @class
 * @example
 * ```typescript
 * const panelManager = new PanelManager();
 *
 * // Subscribe to panel state changes
 * const unsubscribe = panelManager.subscribe(() => {
 *   console.log('Panel state changed');
 * });
 *
 * // Open a panel
 * panelManager.openPanel('gridConfig');
 *
 * // Update panel position
 * panelManager.updatePanelPosition('gridConfig', 100, 200);
 *
 * // Clean up subscription
 * unsubscribe();
 * ```
 *
 * @property {Map<PanelType, PanelState>} panels - Stores the state of all panels
 * @property {Set<PanelStateChangeCallback>} stateChangeCallbacks - Stores callbacks for state changes
 */
export class PanelManager {
  private panels: Map<PanelType, PanelState>;
  private stateChangeCallbacks: Set<PanelStateChangeCallback>;

  constructor() {
    this.panels = new Map();
    this.stateChangeCallbacks = new Set();

    // Initialize default panel states
    this.panels.set("gridConfig", { isOpen: false, triggerRef: null });
    this.panels.set("brushSettings", { isOpen: false, triggerRef: null });
    this.panels.set("layerSettings", { isOpen: false, triggerRef: null });
    this.panels.set("exportSettings", { isOpen: false, triggerRef: null });
  }

  // Subscribe to state changes
  subscribe(callback: PanelStateChangeCallback): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => this.stateChangeCallbacks.delete(callback);
  }

  // Notify all subscribers
  private notifyStateChange() {
    this.stateChangeCallbacks.forEach((callback) => callback());
  }

  // Get panel state
  getPanelState(panelType: PanelType): PanelState | undefined {
    return this.panels.get(panelType);
  }

  // Set trigger ref for a panel
  setTriggerRef(panelType: PanelType, ref: RefObject<HTMLButtonElement>) {
    const panel = this.panels.get(panelType);
    if (panel) {
      panel.triggerRef = ref;
      this.panels.set(panelType, panel);
      this.notifyStateChange();
    }
  }

  // Open a panel
  openPanel(panelType: PanelType) {
    const panel = this.panels.get(panelType);
    if (panel) {
      // Center the panel on the screen
      const x = window.innerWidth / 2 - 160; // Assuming panel width is 320px
      const y = window.innerHeight / 2 - 200; // Approximate half height

      panel.isOpen = true;
      panel.position = { x, y };
      this.panels.set(panelType, panel);
      this.notifyStateChange();
    }
  }

  // Close a panel
  closePanel(panelType: PanelType) {
    const panel = this.panels.get(panelType);
    if (panel) {
      panel.isOpen = false;
      this.panels.set(panelType, panel);
      this.notifyStateChange();
    }
  }

  // Toggle panel
  togglePanel(panelType: PanelType) {
    const panel = this.panels.get(panelType);
    if (panel) {
      if (!panel.isOpen) {
        this.openPanel(panelType);
      } else {
        this.closePanel(panelType);
      }
    }
  }

  // Update panel position
  updatePanelPosition(panelType: PanelType, x: number, y: number) {
    const panel = this.panels.get(panelType);
    if (panel) {
      panel.position = { x, y };
      this.panels.set(panelType, panel);
      this.notifyStateChange();
    }
  }

  // Close all panels
  closeAllPanels() {
    this.panels.forEach((panel, type) => {
      panel.isOpen = false;
      this.panels.set(type, panel);
    });
    this.notifyStateChange();
  }

  // Get all panel states
  getAllPanelStates(): Record<PanelType, PanelState> {
    const states: Partial<Record<PanelType, PanelState>> = {};
    this.panels.forEach((state, type) => {
      states[type] = state;
    });
    return states as Record<PanelType, PanelState>;
  }
}

export const panelManager = new PanelManager();
