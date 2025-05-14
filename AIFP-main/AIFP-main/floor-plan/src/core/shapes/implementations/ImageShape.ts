import { Point } from "../../../types";
import { RectangularGeometry } from "../../../types/geometry";
import { IShapeData } from "../../../types/shape";
import { PointUtils } from "../../../utils/PointUtils";
import { ImageRenderStrategy } from "../../strategies/render/ImageStrategy";
import { TextSelectionStrategy } from "../../strategies/selection/TextSelectionStrategy";
import { BaseShape } from "../base/BaseShape";

export interface ImageShapeData extends IShapeData {
  isEditable?: boolean; // To enable image editing
  isResizable?: boolean; // To enable image resizing
  rotation?: number; // Rotation angle in degrees
  imageData: {
    src: string; // Base64 string or URL of the image
    width: number; // Original width of the image
    height: number; // Original height of the image
    naturalWidth?: number; // Natural width of the loaded image
    naturalHeight?: number; // Natural height of the loaded image
  };
  aspectRatio?: number; // To maintain image proportions when resizing
  scaleX?: number; // Horizontal scale factor
  scaleY?: number; // Vertical scale factor
}

export class ImageShape extends BaseShape<ImageShapeData> {
  constructor(properties: ImageShapeData) {
    super(properties, new ImageRenderStrategy(), new TextSelectionStrategy());
    this.oldProperties = structuredClone(this.properties);
  }
  getType(): string {
    return "image";
  }

  getWidth(): number {
    const geo = this.properties.geometry as RectangularGeometry;
    return Math.abs(geo.bottomRight.x - geo.topLeft.x);
  }

  getHeight(): number {
    const geo = this.properties.geometry as RectangularGeometry;
    return Math.abs(geo.bottomRight.y - geo.topLeft.y);
  }

  getImage(): HTMLImageElement {
    const img = new Image();
    img.src = this.properties.imageData.src;
    return img;
  }

  getBounds(): { start: Point; end: Point } {
    const result = this._getBounds(this.properties);
    return result;
  }

  getHandles(): Point[] {
    return this._getHandles({
      bounds: this.getBounds(),
      properties: this.properties,
    });
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

  private _getBounds(properties: ImageShapeData): {
    start: Point;
    end: Point;
  } {
    const data = properties.geometry as RectangularGeometry;
    return {
      start: data.topLeft,
      end: data.bottomRight,
    };
  }

  private _getHandles({
    bounds,
    properties,
  }: {
    bounds: any;
    properties: ImageShapeData;
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
}
