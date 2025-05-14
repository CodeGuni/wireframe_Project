import { IShape } from "../shapes/base/IShape";
import { ShapeFactory } from "../factory/ShapeFactory";
import { v4 as uuidv4 } from "uuid";
import { IShapeData } from "../../types/shape";
import { Point } from "../../types";
import { ICommand } from "./command/ICommand";
import { Subject } from "./observer/Subject";
import { ShapeEventType } from "./events";
import { AddShapeCommand } from "./command/AddShapeCommand";
import { RemoveShapeCommand as RemoveShapesCommand } from "./command/RemoveShapesCommand";
import { UpdateShapeByHandleCommand } from "./command/UpdateShapeByHandleCommand";
import { UpdateShapesPositionCommand } from "./command/UpdateShapeCommand";

export class ShapeManager extends Subject {
  private shapes: Map<string, IShape>;
  private factory: ShapeFactory;
  private commandHistory: ICommand[] = [];
  private historyIndex: number = -1;

  constructor() {
    super();
    this.shapes = new Map();
    this.factory = ShapeFactory.getInstance();
  }

  private executeCommand(command: ICommand): void {
    command.execute();
    this.commandHistory.splice(this.historyIndex + 1);
    this.commandHistory.push(command);
    this.historyIndex++;
  }

  undo(): void {
    if (this.historyIndex >= 0) {
      const command = this.commandHistory[this.historyIndex];
      command.undo();
      this.historyIndex--;
    }
  }

  redo(): void {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      const command = this.commandHistory[this.historyIndex];
      command.execute();
    }
  }

  addShape<T extends IShapeData>(type: string, config: T): string | undefined {
    // console.log("Adding shape", type, config);

    const command = new AddShapeCommand(this, type, config);
    this.executeCommand(command);
    return command.getId(); // Get ID from command
  }

  _addShapeDirectly<T extends IShapeData>(type: string, config: T): string {
    const id = config.id || uuidv4();
    const shape = this.factory.createShape(type, { ...config, id });
    this.shapes.set(id, shape);

    this.notify({
      type: ShapeEventType.ADDED,
      shapeId: id,
      shape: shape,
    });

    return id;
  }

  updateShapesPosition(selectedShapes: string[]) {
    const command = new UpdateShapesPositionCommand(this, selectedShapes);
    this.executeCommand(command);
  }

  updateShape(id: string): void {
    const shape = this.shapes.get(id);
    if (!shape) return;
  }

  updateShapeByHandle(shapeId: string, handleIndex: number, pointer: Point) {
    const command = new UpdateShapeByHandleCommand(
      this,
      shapeId,
      handleIndex,
      pointer
    );
    this.executeCommand(command);
    return command.getId(); // Get ID from command
  }

  _updateShapeByHandleDirectly(
    shapeId: string,
    handleIndex: number,
    pointer: Point
  ) {
    const shape = this.shapes.get(shapeId);
    if (!shape) return;
    shape.updateHandle(handleIndex, pointer);

    this.notify({
      type: ShapeEventType.UPDATED,
      shapeId: shapeId,
      shape: shape,
    });

    return shapeId;
  }

  removeShapes(shapes: string[]): void {
    const command = new RemoveShapesCommand(this, shapes);
    this.executeCommand(command);
  }

  _removeShapeDirectly(id: string): void {
    const shape = this.shapes.get(id);
    if (shape) {
      this.shapes.delete(id);
    }
  }

  getShape(id: string): IShape | undefined {
    return this.shapes.get(id);
  }

  getAllShapes(): Map<string, IShape> {
    return this.shapes;
  }

  clear(): void {
    this.shapes.clear();
  }

  /**
   * Finds all shapes that contain the specified point.
   * @param point - The point coordinates to check for shape intersection
   * @returns An array of tuples containing shape IDs and their corresponding shape objects
   * that contain the given point. Each tuple is in the format [shapeId: string, shape: IShape]
   */
  findShapesAtPoint(point: Point): Array<[string, IShape]> {
    return this.getShapesArray().filter(([_, shape]) =>
      shape.isPointInside(point)
    );
  }

  getShapeLikeRevit(bounds: {
    start: Point;
    end: Point;
  }): Array<[string, IShape]> {
    if (bounds.start.x < bounds.end.x) {
      return this.getShapesInArea(bounds);
    }
    // Otherwise (right to left): get intersecting shapes
    return this.getShapesIntersectingArea(bounds);
  }

  // Helper method to get shapes within a selection area
  getShapesInArea(bounds: {
    start: Point;
    end: Point;
  }): Array<[string, IShape]> {
    const { start, end } = bounds;
    const selectionMinX = Math.min(start.x, end.x);
    const selectionMaxX = Math.max(start.x, end.x);
    const selectionMinY = Math.min(start.y, end.y);
    const selectionMaxY = Math.max(start.y, end.y);

    return this.getShapesArray().filter(([_, shape]) => {
      const shapeBounds = shape.getBounds();
      if (!shapeBounds) return false;

      const { start: shapeStart, end: shapeEnd } = shapeBounds;
      const shapeMinX = Math.min(shapeStart.x, shapeEnd.x);
      const shapeMaxX = Math.max(shapeStart.x, shapeEnd.x);
      const shapeMinY = Math.min(shapeStart.y, shapeEnd.y);
      const shapeMaxY = Math.max(shapeStart.y, shapeEnd.y);

      // Must be completely inside the selection box
      return (
        shapeMinX >= selectionMinX &&
        shapeMaxX <= selectionMaxX &&
        shapeMinY >= selectionMinY &&
        shapeMaxY <= selectionMaxY
      );
    });
  }

  getShapesIntersectingArea(bounds: {
    start: Point;
    end: Point;
  }): Array<[string, IShape]> {
    const { start, end } = bounds;
    const selectionMinX = Math.min(start.x, end.x);
    const selectionMaxX = Math.max(start.x, end.x);
    const selectionMinY = Math.min(start.y, end.y);
    const selectionMaxY = Math.max(start.y, end.y);

    return this.getShapesArray().filter(([_, shape]) => {
      const shapeBounds = shape.getBounds();
      if (!shapeBounds) return false;

      const { start: shapeStart, end: shapeEnd } = shapeBounds;
      const shapeMinX = Math.min(shapeStart.x, shapeEnd.x);
      const shapeMaxX = Math.max(shapeStart.x, shapeEnd.x);
      const shapeMinY = Math.min(shapeStart.y, shapeEnd.y);
      const shapeMaxY = Math.max(shapeStart.y, shapeEnd.y);

      // Standard bounding-box intersection check
      return !(
        shapeMaxX < selectionMinX ||
        shapeMinX > selectionMaxX ||
        shapeMaxY < selectionMinY ||
        shapeMinY > selectionMaxY
      );
    });
  }

  getShapesArray(): Array<[string, IShape]> {
    return Array.from(this.shapes.entries()).sort(
      ([_, a], [__, b]) => a.getZIndex() - b.getZIndex()
    );
  }

  bringShapeToFront(shapeId: string): void {
    // const shape = this.shapes.get(shapeId);
    // if (shape) {
    //   const command = new BringToFrontCommand(this, shapeId);
    //   this.executeCommand(command);
    // }
  }
}
