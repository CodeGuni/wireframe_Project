import { Context } from "konva/lib/Context";
import { TextShape } from "../../shapes/implementations/TextShape";
import { BaseRenderStrategy } from "./BaseRenderStrategy";
import { BaseShape } from "../../shapes/base/BaseShape";

export class TextRenderStrategy extends BaseRenderStrategy {
  protected renderConnectionPoints(
    ctx: Context,
    shape: BaseShape<any>,
    isSelected?: boolean
  ): void {
    return super.renderConnectionPoints(ctx, shape, isSelected);
  }

  render(context: Context, shape: TextShape): void {
    this.renderConnectionPoints(context, shape, shape.getIsSelected());
    const position = shape.getPosition();
    const width = shape.getWidth();
    const height = shape.getHeight();
    const bounds = shape.getBounds();
    const text = shape.getText();
    const textStyle = shape.getTextStyle();
    const style = shape.getStyle();
    const isSelected = shape.getIsSelected();
    const padding = shape.getPadding() || {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };
    const lineSpacing = shape.getLineSpacing() || 1.2;

    // Ensure all padding values exist with defaults
    const normalizedPadding = {
      top: padding.top ?? 10,
      right: padding.right ?? 10,
      bottom: padding.bottom ?? 10,
      left: padding.left ?? 10,
    };

    context.save();

    // Draw container shape
    context.beginPath();
    context.rect(bounds.start.x, bounds.start.y, width, height);
    context.fillStyle = style.fillColor;
    context.strokeStyle = style.strokeColor;
    context.lineWidth = style.strokeWidth;
    context.fill();
    context.stroke();

    const optimalFontSize = this.calculateOptimalFontSize(
      context,
      text,
      width - (normalizedPadding.left + normalizedPadding.right),
      height - (normalizedPadding.top + normalizedPadding.bottom),
      textStyle
    );

    // Configure text style
    context.font = `${textStyle.fontStyle} ${optimalFontSize}px ${textStyle.fontFamily}`;
    context.textAlign = textStyle.textAlign;
    context.textBaseline = textStyle.textBaseline || "middle";
    context.fillStyle = textStyle.textColor;

    // Get wrapped lines considering horizontal padding
    const availableWidth =
      width - (normalizedPadding.left + normalizedPadding.right);
    const lines = this.wrapText(context, text, availableWidth);
    const lineHeight = optimalFontSize * lineSpacing;

    // Calculate vertical positioning with padding
    const totalTextHeight = lines.length * lineHeight;
    const availableHeight =
      height - (normalizedPadding.top + normalizedPadding.bottom);

    // Center text vertically within available space
    const startY =
      position.y -
      availableHeight / 2 +
      lineHeight / 2 +
      (normalizedPadding.top - normalizedPadding.bottom) / 2;

    // Draw each line with proper horizontal padding
    lines.forEach((line, index) => {
      let xPosition = position.x;

      // Adjust x position based on text alignment and padding
      if (textStyle.textAlign === "center") {
        xPosition =
          position.x + (normalizedPadding.left - normalizedPadding.right) / 2;
      } else if (textStyle.textAlign === "left") {
        xPosition = bounds.start.x + normalizedPadding.left;
      } else if (textStyle.textAlign === "right") {
        xPosition = bounds.start.x + width - normalizedPadding.right;
      }

      context.fillText(line, xPosition, startY + index * lineHeight);
    });

    if (isSelected) {
      this.renderSelectionIndicators(context, shape);
    }

    context.restore();
  }

  private wrapText(context: Context, text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  private renderSelectionIndicators(context: Context, shape: TextShape): void {
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

  private calculateOptimalFontSize(
    context: Context,
    text: string,
    containerWidth: number,
    containerHeight: number,
    textStyle: any
  ): number {
    const maxFontSize = textStyle.fontSize;
    const minFontSize = 8;

    let low = minFontSize;
    let high = maxFontSize;

    while (low <= high) {
      const fontSize = Math.floor((low + high) / 2);
      context.font = `${textStyle.fontStyle} ${fontSize}px ${textStyle.fontFamily}`;

      // Check if text fits within padded area
      const lines = this.wrapText(context, text, containerWidth);
      const lineHeight = fontSize * 1.2;
      const totalTextHeight = lines.length * lineHeight;

      const isTooWide = lines.some(
        (line) => context.measureText(line).width > containerWidth
      );
      const isTooTall = totalTextHeight > containerHeight;

      if (!isTooWide && !isTooTall) {
        low = fontSize + 1;
      } else {
        high = fontSize - 1;
      }
    }

    return Math.max(minFontSize, high);
  }

  debugRender(context: Context, shape: TextShape): void {
    // Save context state
    context.save();

    // Draw center indicator
    context.beginPath();
    context.arc(
      shape.getPosition().x,
      shape.getPosition().y,
      3,
      0,
      Math.PI * 2
    );
    context.fillStyle = "#ff0000";
    context.fill();

    // Draw bounds
    const bounds = shape.getBounds();
    context.beginPath();
    context.rect(
      bounds.start.x,
      bounds.start.y,
      shape.getWidth(),
      shape.getHeight()
    );
    context.strokeStyle = "#ff0000";
    context.lineWidth = 1;
    context.stroke();

    // Restore context state
    context.restore();
  }
}
