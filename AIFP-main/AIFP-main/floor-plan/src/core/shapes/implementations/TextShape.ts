import { Point } from "../../../types";
import { RectangularGeometry } from "../../../types/geometry";
import { IShapeData, TextShapeData, TextStyle } from "../../../types/shape";
import { PointUtils } from "../../../utils/PointUtils";
import { TextRenderStrategy } from "../../strategies/render/TextRenderStrategy";
import { TextSelectionStrategy } from "../../strategies/selection/TextSelectionStrategy";
import { BaseShape } from "../base/BaseShape";

const MIN_HEIGHT = 50;
const MIN_WIDTH = 150;

export class TextShape extends BaseShape<TextShapeData> {
  getLineSpacing() {
    return this.properties.textStyle.lineHeight || 1.2;
  }
  getPadding() {
    return this.properties.textStyle.padding;
  }
  private textStyle: TextStyle;

  constructor(properties: TextShapeData) {
    super(properties, new TextRenderStrategy(), new TextSelectionStrategy());
    this.textStyle = properties.textStyle;
    const geo = this.properties.geometry as RectangularGeometry;

    if (this.getWidth() < MIN_WIDTH) {
      geo.bottomRight.x = geo.topLeft.x + MIN_WIDTH;
      this.properties.position = PointUtils.center(
        geo.topLeft,
        geo.bottomRight
      );
    }
    if (this.getHeight() < MIN_HEIGHT) {
      geo.bottomRight.y = geo.topLeft.y + MIN_HEIGHT;
      this.properties.position = PointUtils.center(
        geo.topLeft,
        geo.bottomRight
      );
    }

    if (geo.topLeft.x > geo.bottomRight.x) {
      [geo.topLeft.x, geo.bottomRight.x] = [geo.bottomRight.x, geo.topLeft.x];
    }
    if (geo.topLeft.y > geo.bottomRight.y) {
      [geo.topLeft.y, geo.bottomRight.y] = [geo.bottomRight.y, geo.topLeft.y];
    }

    this.oldProperties = structuredClone(this.properties);

    //TODO: We need to fix when the topLeft equals to bottomRight
  }

  getBounds(): { start: Point; end: Point } {
    const result = this._getBounds(this.properties);
    return result;
  }

  private _getBounds(properties: TextShapeData): {
    start: Point;
    end: Point;
  } {
    const data = properties.geometry as RectangularGeometry;
    return {
      start: data.topLeft,
      end: data.bottomRight,
    };
  }

  getHandlePositionByIndex(handleIndex: number): Point {
    const handles = this.getHandles();
    if (handleIndex < 0 || handleIndex >= handles.length) {
      throw new Error(`Invalid handle index: ${handleIndex}`);
    }
    return handles[handleIndex];
  }

  getOldHandlePositionByIndex(handleIndex: number): Point {
    const handles = this._getHandles({
      bounds: this._getBounds(this.getOldProperties()),
      properties: this.getOldProperties(),
    });
    if (handleIndex < 0 || handleIndex >= handles.length) {
      throw new Error(`Invalid handle index: ${handleIndex}`);
    }
    return handles[handleIndex];
  }

  updateHandle(handleIndex: number, pointer: Point): void {
    const geo = structuredClone(
      this.oldProperties.geometry
    ) as RectangularGeometry;
    const minSize = 20; // Minimum size in pixels

    switch (handleIndex) {
      case 0: // Top-left
        if (
          pointer.x < geo.bottomRight.x - minSize &&
          pointer.y < geo.bottomRight.y - minSize
        ) {
          geo.topLeft = pointer;
        }
        break;
      case 2: // Top-right
        if (
          pointer.x > geo.topLeft.x + minSize &&
          pointer.y < geo.bottomRight.y - minSize
        ) {
          geo.topLeft.y = pointer.y;
          geo.bottomRight.x = pointer.x;
        }
        break;
      case 4: // Bottom-right
        if (
          pointer.x > geo.topLeft.x + minSize &&
          pointer.y > geo.topLeft.y + minSize
        ) {
          geo.bottomRight = pointer;
        }
        break;
      case 6: // Bottom-left
        if (
          pointer.x < geo.bottomRight.x - minSize &&
          pointer.y > geo.topLeft.y + minSize
        ) {
          geo.topLeft.x = pointer.x;
          geo.bottomRight.y = pointer.y;
        }
        break;
      case 1: // Top-center
        if (pointer.y < geo.bottomRight.y - minSize) {
          geo.topLeft.y = pointer.y;
        }
        break;
      case 3: // Middle-right
        if (pointer.x > geo.topLeft.x + minSize) {
          geo.bottomRight.x = pointer.x;
        }
        break;
      case 5: // Bottom-center
        if (pointer.y > geo.topLeft.y + minSize) {
          geo.bottomRight.y = pointer.y;
        }
        break;
      case 7: // Middle-left
        if (pointer.x < geo.bottomRight.x - minSize) {
          geo.topLeft.x = pointer.x;
        }
        break;
    }

    this.properties.geometry = geo;
    this.properties.position = PointUtils.center(geo.topLeft, geo.bottomRight);
    this.updateConnectionPoints();
  }

  captureState(): void {
    this.oldProperties = structuredClone(this.properties);
  }

  restoreState(newProperties: IShapeData): void {
    if (!this.isTextShapeData(newProperties)) {
      throw new Error("Invalid state data type");
    }

    this.properties.text = newProperties.text;
    this.properties.geometry = newProperties.geometry;

    this.textStyle = newProperties.textStyle;
    this.setPosition(newProperties.position);
  }

  private isTextShapeData(data: IShapeData): data is TextShapeData {
    return "text" in data && "shape" in data && "textStyle" in data;
  }

  getType(): string {
    return "text";
  }

  getText(): string {
    return this.properties.text;
  }

  getTextStyle(): TextStyle {
    return this.textStyle;
  }

  getHandles(): Point[] {
    return this._getHandles({
      bounds: this.getBounds(),
      properties: this.properties,
    });
  }

  getWidth(): number {
    const bounds = this.getBounds();
    return Math.abs(bounds.end.x - bounds.start.x);
  }

  getHeight(): number {
    const bounds = this.getBounds();
    return Math.abs(bounds.end.y - bounds.start.y);
  }

  private _getHandles({
    bounds,
    properties,
  }: {
    bounds: any;
    properties: TextShapeData;
  }): Point[] {
    return [
      bounds.start, // Top-left
      { x: properties.position.x, y: bounds.start.y }, // Top-center
      { x: bounds.end.x, y: bounds.start.y }, // Top-right
      { x: bounds.end.x, y: properties.position.y }, // Middle-right
      bounds.end, // Bottom-right
      { x: properties.position.x, y: bounds.end.y }, // Bottom-center
      { x: bounds.start.x, y: bounds.end.y }, // Bottom-left
      { x: bounds.start.x, y: properties.position.y }, // Middle-left
    ];
  }

  getPosition(): Point {
    return this.properties.position;
  }
  moveTo(dragginStartPoint: Point, position: Point): void {
    // Calculate movement delta
    const dx = position.x - dragginStartPoint.x;
    const dy = position.y - dragginStartPoint.y;

    // Update shape position
    this.setPosition({
      x: this.oldProperties.position.x + dx,
      y: this.oldProperties.position.y + dy,
    });

    // Update geometry corners
    if (
      this.oldProperties.geometry &&
      "topLeft" in this.oldProperties.geometry
    ) {
      const newGeometry: RectangularGeometry = {
        topLeft: {
          x: this.oldProperties.geometry.topLeft.x + dx,
          y: this.oldProperties.geometry.topLeft.y + dy,
        },
        bottomRight: {
          x: this.oldProperties.geometry.bottomRight.x + dx,
          y: this.oldProperties.geometry.bottomRight.y + dy,
        },
      };
      this.properties.geometry = newGeometry;
    }
    this.updateConnectionPoints();
  }
}
