import { ConnectorData } from "../../types/connection";
import { IShapeData, TextShapeData, WallData } from "../../types/shape";
import { IShape } from "../shapes/base/IShape";
import { Connector } from "../shapes/implementations/Connector";
import {
  ImageShape,
  ImageShapeData,
} from "../shapes/implementations/ImageShape";
import { TextShape } from "../shapes/implementations/TextShape";
import { Wall } from "../shapes/implementations/Wall";
import { IShapeFactory, ShapeCreator } from "./IShapeFactory";

export class ShapeFactory implements IShapeFactory {
  private static instance: ShapeFactory;
  private creators: Map<string, ShapeCreator<any>>;

  private constructor() {
    this.creators = new Map();
    this.registerDefaultShapes();
  }

  public static getInstance(): ShapeFactory {
    if (!ShapeFactory.instance) {
      ShapeFactory.instance = new ShapeFactory();
    }
    return ShapeFactory.instance;
  }

  public registerShape<T extends IShapeData>(
    type: string,
    creator: ShapeCreator<T>
  ): void {
    if (this.creators.has(type)) {
      throw new Error(`Shape type '${type}' is already registered`);
    }
    this.creators.set(type, creator);
  }

  public createShape<T extends IShapeData>(type: string, config: T): IShape {
    const creator = this.creators.get(type);
    if (!creator) {
      throw new Error(`Unknown shape type: ${type}`);
    }
    return creator(config);
  }

  public hasShape(type: string): boolean {
    return this.creators.has(type);
  }

  private registerDefaultShapes(): void {
    this.registerShape<WallData>("wall", (config) => new Wall(config));
    this.registerShape<TextShapeData>(
      "text",
      (config) => new TextShape(config)
    );
    this.registerShape<ImageShapeData>(
      "image",
      (config) => new ImageShape(config)
    );
    this.registerShape<ConnectorData>(
      "connector",
      (config) => new Connector(config)
    );
  }
}
