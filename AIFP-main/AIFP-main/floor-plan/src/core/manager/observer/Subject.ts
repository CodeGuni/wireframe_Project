import { ShapeEvent } from "../events";
import { IObserver } from "./IObserver";

export abstract class Subject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return;
    }
    this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return;
    }
    this.observers.splice(observerIndex, 1);
  }

  notify(event: ShapeEvent): void {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }
}
