import { ShapeType } from "../../../types";
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
export class JoinWallCommand extends CommandBase {
  private shapeId: string;

  getId(): string {
    return this.shapeId;
  }

  constructor(
    shapeManager: ShapeManager,
    private type: ShapeType,
    private config: IShapeData,
    shapeId?: string
  ) {
    super(shapeManager);
    this.shapeId = shapeId || uuidv4();
  }

  getType(): string {
    return "JOIN_WALL";
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
