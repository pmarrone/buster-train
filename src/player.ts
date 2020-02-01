import 'phaser';

class MainPlayer {
  player: Phaser.Physics.Arcade.Sprite;

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  update(keys, time, delta) { 

    var input = {
        left: keys.left.isDown,
        right: keys.right.isDown,
        down: keys.down.isDown,
        jump: keys.jump.isDown,
        action: keys.action.isDown
    };

    if (input.left) {
      this.player.setVelocityX(-100);
    }
    
    if (input.right) {
      this.player.setVelocityX(100);
    }

  }
}

export default MainPlayer;
