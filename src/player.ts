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

  update(keys, time, delta) { 

    var input = {
        left: keys.left.isDown,
        right: keys.right.isDown,
        down: keys.down.isDown,
        jump: keys.jump.isDown || keys.jump2.isDown,
        fire: keys.fire.isDown
      };

    if (input.left) {
        
    }
  }
}

export default MainPlayer;
