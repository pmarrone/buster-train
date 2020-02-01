import 'phaser';
import MainScene from './game';

export interface IObstacle {
  scene: MainScene;
  image: Phaser.Physics.Arcade.Image;
  addCollision(
    layer: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
  ): void;
  actionTool: string;
}

export class Obstacle implements IObstacle {
  constructor(
    public scene: MainScene,
    public image: Phaser.Physics.Arcade.Image,
    public actionTool: string
  ) {}

  public addCollision(layer: Phaser.GameObjects.GameObject): void {
    this.scene.physics.add.collider(layer, this.image);
  }
}
