import { ShapeEvent } from "../events";

export interface IObserver {
  update(event: ShapeEvent): void;
}
