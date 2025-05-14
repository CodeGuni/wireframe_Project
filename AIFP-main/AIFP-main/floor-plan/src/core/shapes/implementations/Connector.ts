import { Point } from "../../../types";
import { ConnectorData } from "../../../types/connection";
import { ConnectorRenderStrategy } from "../../strategies/render/ConnectorRenderStrategy";
import { ConnectorSelectionStrategy } from "../../strategies/selection/ConnectorSelectionStrategy";
import { BaseShape } from "../base/BaseShape";

export class Connector extends BaseShape<ConnectorData> {
  getHandlePositionByIndex(handleIndex: number): Point {
    throw new Error("Method not implemented.");
  }
  
  updateHandle(handleIndex: number, pointer: Point): unknown {
    throw new Error("Method not implemented.");
  }

  getBounds(): { start: Point; end: Point } | null {
    throw new Error("Method not implemented.");
  }

  getHandles(): Point[] {
    throw new Error("Method not implemented.");
  }

  constructor(properties: ConnectorData) {
    super(
      properties,
      new ConnectorRenderStrategy(),
      new ConnectorSelectionStrategy()
    );
    this.updatePath();
  }

  getType(): string {
    return "connector";
  }

  private updatePath(): void {
    const { sourcePoint, targetPoint, type } = this.properties;

    if (type === "straight") {
      // For straight lines, no control points needed
      this.properties.controlPoints = [];
    } else {
      // For curved lines, calculate middle point
      const midX = (sourcePoint.position.x + targetPoint.position.x) / 2;
      const midY = (sourcePoint.position.y + targetPoint.position.y) / 2;

      // Calculate perpendicular offset for the curve
      const dx = targetPoint.position.x - sourcePoint.position.x;
      const dy = targetPoint.position.y - sourcePoint.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const offset = distance * 0.2; // Adjust this value to control curve intensity

      // Calculate control point
      const controlPoint: Point = {
        x: midX - (dy / distance) * offset,
        y: midY + (dx / distance) * offset,
      };

      this.properties.controlPoints = [controlPoint];
    }
  }

  moveTo(dragginStartPoint: Point, position: Point): void {
    // Calculate movement delta
    const dx = position.x - dragginStartPoint.x;
    const dy = position.y - dragginStartPoint.y;

    // Update source and target points
    this.properties.sourcePoint.position = {
      x: this.oldProperties.sourcePoint.position.x + dx,
      y: this.oldProperties.sourcePoint.position.y + dy,
    };

    this.properties.targetPoint.position = {
      x: this.oldProperties.targetPoint.position.x + dx,
      y: this.oldProperties.targetPoint.position.y + dy,
    };

    this.updatePath();
  }

  // Method to update the connector when connected shapes move
  updateConnections(): void {
    this.updatePath();
  }
}
