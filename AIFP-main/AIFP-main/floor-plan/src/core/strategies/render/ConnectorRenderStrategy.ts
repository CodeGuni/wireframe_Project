import { Context } from "konva/lib/Context";
import { Point } from "../../../types";
import { Connector } from "../../shapes/implementations/Connector";
import { IRenderStrategy } from "./IRenderStrategy";

export class ConnectorRenderStrategy implements IRenderStrategy {
  render(ctx: Context, shape: Connector): void {
    const { sourcePoint, targetPoint, type, controlPoints } =
      shape.getProperties();

    ctx.beginPath();
    ctx.moveTo(sourcePoint.position.x, sourcePoint.position.y);

    if (type === "straight") {
      ctx.lineTo(targetPoint.position.x, targetPoint.position.y);
    } else if (controlPoints && controlPoints.length > 0) {
      // Draw quadratic curve using control point
      const controlPoint = controlPoints[0];
      ctx.quadraticCurveTo(
        controlPoint.x,
        controlPoint.y,
        targetPoint.position.x,
        targetPoint.position.y
      );
    }

    ctx.stroke();

    // Draw connection points
    this.drawConnectionPoint(ctx, sourcePoint.position);
    this.drawConnectionPoint(ctx, targetPoint.position);
  }

  private drawConnectionPoint(ctx: Context, point: Point): void {
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
