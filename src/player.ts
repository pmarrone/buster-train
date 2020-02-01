import 'phaser';

interface IMainPlayerOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

class MainPlayer extends Phaser.GameObjects.Sprite {
  constructor(options: IMainPlayerOptions) {
    super(options.scene, options.x, options.y, options.texture);

    options.scene.physics.world.enable(this);
    options.scene.add.existing(this);
  }
}

export default MainPlayer;
