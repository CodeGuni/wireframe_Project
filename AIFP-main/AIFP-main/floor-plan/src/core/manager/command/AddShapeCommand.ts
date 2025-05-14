import { IShapeData } from "../../../types/shape";
import { ShapeManager } from "../ShapeManager";
import { CommandBase } from "./CommandBase";
import { v4 as uuidv4 } from "uuid";

/**
 * Command for adding a shape to the shape manager.
 * Implements the Command pattern to support undo/redo operations.
 *
 * @implements {ICommand}
 */
export class AddShapeCommand extends CommandBase {
  private shapeId: string;

  getId(): string {
    return this.shapeId;
  }

  constructor(
    shapeManager: ShapeManager,
    private type: string,
    private config: IShapeData,
    shapeId?: string
  ) {
    super(shapeManager);
    this.shapeId = shapeId || uuidv4();
  }

  getType(): string {
    return "ADD_SHAPE";
  }

  execute(): void {
    this.shapeId = this.shapeManager._addShapeDirectly(this.type, {
      ...this.config,
      id: this.shapeId,
    });
  }

  undo(): void {
    this.shapeManager._removeShapeDirectly(this.shapeId);
  }
}
