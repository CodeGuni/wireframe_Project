export interface ICommand {
  execute(): void;
  undo(): void;
  getId(): string | undefined;
  getType(): string;
}
