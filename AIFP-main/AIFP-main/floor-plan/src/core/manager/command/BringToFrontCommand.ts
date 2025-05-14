import { IShape } from "../../shapes/base/IShape";
import { ShapeManager } from "../ShapeManager";
import { CommandBase } from "./CommandBase";

export class BringToFrontCommand extends CommandBase {
  getId(): string {
    throw new Error("Method not implemented.");
  }

  constructor(shapeManager: ShapeManager) {
    super(shapeManager);
  }

  getType(): string {
    return "BRING_TO_FRONT";
  }

  execute(): void {}

  undo(): void {}

  private calculateMaxZIndex(): number {
    return Math.max(
      ...Array.from(this.shapeManager.getAllShapes().values()).map((shape) =>
        shape.getZIndex()
      )
    );
  }
}
