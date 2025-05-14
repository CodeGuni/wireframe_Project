import { Point } from "../../../types";
import { IShape } from "../../shapes/base/IShape";
import { ShapeManager } from "../ShapeManager";
import { CommandBase } from "./CommandBase";

export class UpdateShapeByHandleCommand extends CommandBase {
  private shapeId: string;
  getId(): string {
    return this.shapeId;
  }

  private previousState: { handleIndex: number; pointer: Point };

  constructor(
    shapeManager: ShapeManager,
    shapeId: string,
    private handleIndex: number,
    private pointer: Point
  ) {
    super(shapeManager);
    this.shapeId = shapeId;
    const shape = shapeManager.getShape(shapeId) as IShape;
    this.previousState = {
      handleIndex,
      pointer: shape.getHandlePositionByIndex(handleIndex),
    };
  }

  getType(): string {
    return "UPDATE_HANDLE";
  }

  execute(): void {
    
    this.shapeManager._updateShapeByHandleDirectly(
      this.shapeId,
      this.handleIndex,
      this.pointer
    );
  }

  undo(): void {
    this.shapeManager._updateShapeByHandleDirectly(
      this.shapeId,
      this.previousState.handleIndex,
      this.previousState.pointer
    );
  }
}
