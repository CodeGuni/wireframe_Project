import { IShapeData } from "../../../types/shape";
import { ShapeManager } from "../ShapeManager";
import { CommandBase, ShapeError } from "./CommandBase";

export class RemoveShapeCommand extends CommandBase {
  private removedShapes: { [key: string]: { type: string; data: IShapeData } } =
    {};
  getId(): string {
    throw new Error("Method not implemented.");
  }
  constructor(shapeManager: ShapeManager, removedShapeIds: string[]) {
    super(shapeManager);
    removedShapeIds.forEach((shapeId) => {
      const shape = this.shapeManager.getShape(shapeId);
      if (!shape) {
        throw new ShapeError(`Shape with id ${shapeId} not found`);
      }
      this.removedShapes[shapeId] = {
        type: shape.getType(),
        data: shape.getProperties(),
      };
    });
  }

  getType(): string {
    return "REMOVE_SHAPE";
  }

  execute(): void {
    Object.entries(this.removedShapes).forEach(([shapeId]) => {
      this.shapeManager._removeShapeDirectly(shapeId);
    });
  }

  undo(): void {
    Object.entries(this.removedShapes).forEach(([, shapeData]) => {
      this.shapeManager._addShapeDirectly(shapeData.type, shapeData.data);
    });
  }
}
