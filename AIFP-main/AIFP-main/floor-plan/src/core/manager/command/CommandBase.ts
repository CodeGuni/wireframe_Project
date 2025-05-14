import { ShapeManager } from "../ShapeManager";
import { ICommand } from "./ICommand";

export class ShapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShapeError";
  }
}

export abstract class CommandBase implements ICommand {
  constructor(protected shapeManager: ShapeManager) {}

  abstract execute(): void;
  abstract undo(): void;
  abstract getType(): string;
  abstract getId(): string;
}
