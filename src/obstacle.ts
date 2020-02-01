import 'phaser';
import MainScene from './game';

export interface IObstacle {
  scene: MainScene;
  imageKey: string;
  setCollision(
    layer: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
  ): void;
  actionTool: string;
}

export class Obstacle implements IObstacle {
  private _image: Phaser.Physics.Arcade.Image;

  constructor(
    public scene: MainScene,
    public imageKey: string,
    public actionTool: string
  ) {}

  public get image() {
    return this._image;
  }

  public render(x: number, y: number): void {
    this._image = this.scene.physics.add.image(x, y, this.imageKey);
  }

  public setCollision(layer: Phaser.GameObjects.GameObject): void {
    this.scene.physics.add.collider(layer, this._image);
  }

  public getTool(): string {
    return this.actionTool;
  }
}
