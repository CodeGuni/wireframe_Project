import { Context } from "konva/lib/Context";
import { IShape } from "../../shapes/base/IShape";

export interface IRenderStrategy {
  render(context: Context, shape: IShape): void;
}
