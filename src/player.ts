import 'phaser';

interface IMainPlayerOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

class MainPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(options: IMainPlayerOptions) {
    super(options.scene, options.x, options.y, options.texture);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }
}

export default MainPlayer;
