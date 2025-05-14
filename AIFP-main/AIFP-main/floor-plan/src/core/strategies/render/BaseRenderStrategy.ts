import { Context } from "konva/lib/Context";
import { IRenderStrategy } from "./IRenderStrategy";
import { BaseShape } from "../../shapes/base/BaseShape";
import { IShape } from "../../shapes/base/IShape";

export abstract class BaseRenderStrategy implements IRenderStrategy {
  abstract render(context: Context, shape: IShape): void;
  protected renderConnectionPoints(
    ctx: Context,
    shape: BaseShape<any>,
    isSelected: boolean = false
  ): void {
    const connectionPoints = shape.getConnectionPoints();

    // Only show connection points when shape is selected or being hovered
    if (!isSelected) return;

    ctx.save();

    connectionPoints.forEach((point) => {
      // Draw connection point circle
      ctx.beginPath();
      ctx.fillStyle = "#4A90E2"; // Blue color for connection points
      ctx.strokeStyle = "#FFFFFF"; // White border
      ctx.lineWidth = 12;
      ctx.arc(point.position.x, point.position.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw different indicators based on connection point type
      ctx.fillStyle = "#FFFFFF";
      switch (point.type) {
        case "input":
          // Draw a small triangle pointing inward
          ctx.beginPath();
          ctx.moveTo(point.position.x - 3, point.position.y);
          ctx.lineTo(point.position.x + 2, point.position.y - 3);
          ctx.lineTo(point.position.x + 2, point.position.y + 3);
          ctx.closePath();
          ctx.fill();
          break;

        case "output":
          // Draw a small triangle pointing outward
          ctx.beginPath();
          ctx.moveTo(point.position.x + 3, point.position.y);
          ctx.lineTo(point.position.x - 2, point.position.y - 3);
          ctx.lineTo(point.position.x - 2, point.position.y + 3);
          ctx.closePath();
          ctx.fill();
          break;

        case "bidirectional":
          // Draw a small dot in the center
          ctx.beginPath();
          ctx.arc(point.position.x, point.position.y, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    });

    ctx.restore();
  }
}
