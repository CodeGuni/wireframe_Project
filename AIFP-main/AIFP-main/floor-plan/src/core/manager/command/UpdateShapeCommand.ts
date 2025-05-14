import { Point } from "../../../types";
import { IShapeData } from "../../../types/shape";
import { ShapeManager } from "../ShapeManager";
import { ICommand } from "./ICommand";

/**
 * Command to update a shape in the shape manager.
 * Implements the Command pattern for shape modification operations.
 *
 * @implements {ICommand}
 */

export class UpdateShapeCommand implements ICommand {
  constructor(private shapeManager: ShapeManager, private shapeId: string) {}
  getType(): string {
    return "UPDATE_SHAPE";
  }

  getId(): string | undefined {
    return this.shapeId;
  }

  execute(): void {
    const shape = this.shapeManager.getShape(this.shapeId);
    if (!shape) {
      return;
    }
  }

  undo(): void {
    const shape = this.shapeManager.getShape(this.shapeId);
    if (!shape) {
      return;
    }
  }
}

export class UpdateShapesPositionCommand implements ICommand {
  private previousStates: { [shapeId: string]: { shapeData: IShapeData } } = {};
  constructor(private shapeManager: ShapeManager, private shapeIds: string[]) {
    this.shapeIds.forEach((shapeId) => {
      const shape = this.shapeManager.getShape(shapeId);
      if (!shape) {
        return;
      }
      this.previousStates[shapeId] = {
        shapeData: shape.getOldProperties(),
      };
    });
  }
  getType(): string {
    return "UPDATE_SHAPE";
  }

  getId(): string | undefined {
    throw new Error("Method not implemented.");
  }

  execute(): void {
    this.shapeIds.forEach((shapeId) => {
      const shape = this.shapeManager.getShape(shapeId);
      if (!shape) {
        return;
      }
      shape.captureState();
    });
  }

  undo(): void {
    console.log("Undoing update shapes position command");

    Object.entries(this.previousStates).forEach(([shapeId, state]) => {
      const shape = this.shapeManager.getShape(shapeId);
      if (!shape) {
        return;
      }
      shape.restoreState(state.shapeData); // Restore previous state of shape data
    });
  }
}
