import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  DrawingData,
  Project,
  ProjectSettings,
  WallData,
} from "../../types/project";
import { ProjectState } from "..";

const initialState: ProjectState = {
  currentProject: null,
  isModified: false,
  isLoading: false,
  error: null,
};

export const loadProject = createAsyncThunk(
  "project/load",
  async (projectId: string) => {
    const data = localStorage.getItem(`project-${projectId}`);
    if (!data) throw new Error("Project not found");
    return JSON.parse(data) as Project;
  }
);

export const saveProject = createAsyncThunk(
  "project/save",
  async (project: Project) => {
    localStorage.setItem(`project-${project.id}`, JSON.stringify(project));
    return project;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    createProject: (state) => {
      state.currentProject = {
        id: uuidv4(),
        name: "Untitled Project",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        walls: [],
        drawings: [],
        settings: {
          gridEnabled: true,
          gridSize: 20,
          snapToGrid: true,
          units: "metric",
          scale: 1,
        },
      };
      state.isModified = true;
    },
    addWall: (state, action: PayloadAction<WallData>) => {
      if (state.currentProject) {
        state.currentProject.walls.push({
          ...action.payload,
          id: uuidv4(),
        });
        state.isModified = true;
      }
    },
    updateWall: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<WallData> }>
    ) => {
      if (state.currentProject) {
        const index = state.currentProject.walls.findIndex(
          (w) => w.id === action.payload.id
        );
        if (index !== -1) {
          state.currentProject.walls[index] = {
            ...state.currentProject.walls[index],
            ...action.payload.changes,
          };
          state.isModified = true;
        }
      }
    },
    addDrawing: (state, action: PayloadAction<DrawingData>) => {
      if (state.currentProject) {
        state.currentProject.drawings.push({
          ...action.payload,
          id: uuidv4(),
        });
        state.isModified = true;
      }
    },
    updateSettings: (
      state,
      action: PayloadAction<Partial<ProjectSettings>>
    ) => {
      if (state.currentProject) {
        state.currentProject.settings = {
          ...state.currentProject.settings,
          ...action.payload,
        };
        state.isModified = true;
      }
    },
    deleteWall: (state, action: PayloadAction<string>) => {
      if (state.currentProject) {
        state.currentProject.walls = state.currentProject.walls.filter(
          (wall) => wall.id !== action.payload
        );
        state.isModified = true;
      }
    },
    updateDrawing: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<DrawingData> }>
    ) => {
      if (state.currentProject) {
        const index = state.currentProject.drawings.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.currentProject.drawings[index] = {
            ...state.currentProject.drawings[index],
            ...action.payload.changes,
          };
          state.isModified = true;
        }
      }
    },
    deleteDrawing: (state, action: PayloadAction<string>) => {
      if (state.currentProject) {
        state.currentProject.drawings = state.currentProject.drawings.filter(
          (drawing) => drawing.id !== action.payload
        );
        state.isModified = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.isLoading = false;
        state.isModified = false;
      })
      .addCase(loadProject.rejected, (state, action) => {
        state.error = action.error.message || "Failed to load project";
        state.isLoading = false;
      });
  },
});

export const {
  createProject,
  addWall,
  deleteWall,
  updateWall,
  addDrawing,
  updateDrawing,
  deleteDrawing,
  updateSettings,
} = projectSlice.actions;
export default projectSlice.reducer;
