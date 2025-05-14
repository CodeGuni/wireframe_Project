import { RootState } from "../store";

export const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    // Type guard to ensure parsed state matches RootState structure
    if (typeof parsedState === "object" && parsedState !== null) {
      return parsedState as RootState;
    }

    return undefined;
  } catch (err) {
    console.error("Could not load state:", err);
    return undefined;
  }
};
