import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { DrawingData, ProjectSettings, WallData } from "../types/project";
import {
  addWall,
  updateWall,
  deleteWall,
  addDrawing,
  updateDrawing,
  deleteDrawing,
  updateSettings,
} from "../store/features/projectSlice";

export const useProject = () => {
  const dispatch = useDispatch<AppDispatch>();
  const project = useSelector(
    (state: RootState) => state.project.currentProject
  );
  const isModified = useSelector(
    (state: RootState) => state.project.isModified
  );

  // Wall operations
  const handleAddWall = useCallback(
    (wall: WallData) => {
      dispatch(addWall(wall));
    },
    [dispatch]
  );

  const handleUpdateWall = useCallback(
    (wallId: string, changes: Partial<WallData>) => {
      dispatch(updateWall({ id: wallId, changes }));
    },
    [dispatch]
  );

  const handleDeleteWall = useCallback(
    (wallId: string) => {
      dispatch(deleteWall(wallId));
    },
    [dispatch]
  );

  // Drawing operations
  const handleAddDrawing = useCallback(
    (drawing: DrawingData) => {
      dispatch(addDrawing(drawing));
    },
    [dispatch]
  );

  const handleUpdateDrawing = useCallback(
    (drawingId: string, changes: Partial<DrawingData>) => {
      dispatch(updateDrawing({ id: drawingId, changes }));
    },
    [dispatch]
  );

  const handleDeleteDrawing = useCallback(
    (drawingId: string) => {
      dispatch(deleteDrawing(drawingId));
    },
    [dispatch]
  );

  // Settings operations
  const handleUpdateSettings = useCallback(
    (settings: Partial<ProjectSettings>) => {
      dispatch(updateSettings(settings));
    },
    [dispatch]
  );

  // Auto-save functionality
  useEffect(() => {
    if (isModified && project) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`project-${project.id}`, JSON.stringify(project));
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [project, isModified]);

  return {
    project,
    isModified,
    walls: project?.walls || [],
    drawings: project?.drawings || [],
    settings: project?.settings,
    addWall: handleAddWall,
    updateWall: handleUpdateWall,
    deleteWall: handleDeleteWall,
    addDrawing: handleAddDrawing,
    updateDrawing: handleUpdateDrawing,
    deleteDrawing: handleDeleteDrawing,
    updateSettings: handleUpdateSettings,
  };
};
