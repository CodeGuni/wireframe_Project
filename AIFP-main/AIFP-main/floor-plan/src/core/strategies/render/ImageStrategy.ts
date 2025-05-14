import { Context } from "konva/lib/Context";
import { ImageShape } from "../../shapes/implementations/ImageShape";
import { BaseRenderStrategy } from "./BaseRenderStrategy";
import { BaseShape } from "../../shapes/base/BaseShape";

export class ImageRenderStrategy extends BaseRenderStrategy {
  protected renderConnectionPoints(
    ctx: Context,
    shape: BaseShape<any>,
    isSelected?: boolean
  ): void {
    super.renderConnectionPoints(ctx, shape, isSelected);
  }

  render(context: Context, shape: ImageShape): void {
    this.renderConnectionPoints(context, shape, shape.getIsSelected());
    const position = shape.getPosition();
    const width = shape.getWidth();
    const height = shape.getHeight();
    const bounds = shape.getBounds();
    const image = shape.getImage();
    const isSelected = shape.getIsSelected();

    // Save context state
    context.save();

    // Draw container shape
    context.beginPath();
    context.rect(bounds.start.x, bounds.start.y, width, height);

    // Apply container styles
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.fill();
    context.stroke();

    // Draw image at center position
    context.drawImage(image, bounds.start.x, bounds.start.y, width, height);

    // Render selection indicators if selected
    if (isSelected) {
      this.renderSelectionIndicators(context, shape);
    }

    // Restore context state
    context.restore();
  }

  private renderSelectionIndicators(context: Context, shape: ImageShape): void {
    const handleProperties = shape.getProperties().handleProperties;
    const bounds = shape.getBounds();
    const width = shape.getWidth();
    const height = shape.getHeight();

    // Draw selection rectangle around bounds
    context.beginPath();
    context.rect(bounds.start.x - 2, bounds.start.y - 2, width + 4, height + 4);
    context.strokeStyle = "#0000ff";
    context.lineWidth = 1;
    context.setLineDash([5, 5]);
    context.stroke();
    context.setLineDash([]);

    // Draw resize handles
    const handles = shape.getHandles();
    handles.forEach((point) => {
      context.beginPath();
      context.arc(
        point.x,
        point.y,
        handleProperties?.size || 5,
        0,
        Math.PI * 2
      );
      context.fillStyle = handleProperties?.style.fillColor || "#ffffff";
      context.strokeStyle = handleProperties?.style.strokeColor || "#000000";
      context.lineWidth = handleProperties?.style.strokeWidth || 1;
      context.fill();
      context.stroke();
    });
  }
}
