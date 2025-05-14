import {
  Action,
  configureStore,
  EnhancedStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import projectSlice from "./features/projectSlice";
import { localStorageMiddleware } from "../middleware/localStorageMiddleware";
import { loadState } from "../utils/loadState";
import { Project } from "../types/project";

export interface ProjectState {
  currentProject: Project | null;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
}

type StoreState = {
  project: ProjectState;
};

const initialState: StoreState | undefined = loadState();
type AppStore = EnhancedStore<StoreState>;

const store: AppStore = configureStore({
  reducer: {
    project: projectSlice,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { store };
