import { IRenderStrategy } from "./IRenderStrategy";
import { Wall } from "../../shapes/implementations/Wall";
import { Context } from "konva/lib/Context";

export class WallRenderStrategy implements IRenderStrategy {
  render(context: Context, shape: Wall): void {
    const start = shape.getStart();
    const end = shape.getEnd();
    const thickness = shape.getThickness();
    const style = shape.getStyle();
    const isSelected = shape.getIsSelected();
    const isHovered = shape.getIsHovered();

    // Calculate wall points
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return;

    const perpX = (-dy / length) * (thickness / 2);
    const perpY = (dx / length) * (thickness / 2);

    // Create wall path
    context.beginPath();
    context.moveTo(start.x + perpX, start.y + perpY);
    context.lineTo(end.x + perpX, end.y + perpY);
    context.lineTo(end.x - perpX, end.y - perpY);
    context.lineTo(start.x - perpX, start.y - perpY);
    context.closePath();

    // Apply styles
    context.fillStyle = !(isHovered || isSelected)
      ? style.fillColor
      : style.highLightColor || style.fillColor;
    context.strokeStyle = style.strokeColor;
    context.lineWidth = style.strokeWidth;

    // Render
    context.fill();
    context.stroke();

    // Render selection indicators if selected
    if (isSelected) {
      this.renderSelectionIndicators(context, shape);
    }

    // this.renderBoudingBox(context, shape);
  }

  private renderSelectionIndicators(context: Context, shape: Wall): void {
    const start = shape.getStart();
    const end = shape.getEnd();
    const handleProperties = shape.getProperties().handleProperties;
    // Draw handles
    [start, end].forEach((point, index) => {
      context.beginPath();
      context.arc(
        point.x,
        point.y,
        handleProperties?.size ?? 5,
        0,
        Math.PI * 2
      );
      context.fillStyle = handleProperties?.style.fillColor ?? "#ffffff";
      context.strokeStyle = handleProperties?.style.strokeColor ?? "#000000";
      context.lineWidth = handleProperties?.style.strokeWidth ?? 1;
      context.fill();
      context.stroke();
    });
  }

  renderBoudingBox(context: Context, shape: Wall): void {
    const bounds = shape.getBounds();
    if (!bounds) return;

    const { start, end } = bounds;

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineTo(start.x, end.y);
    context.closePath();

    context.strokeStyle = "#0000ff";
    context.lineWidth = 1;
    context.stroke();
  }
}
