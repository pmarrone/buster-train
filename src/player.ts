import 'phaser';

class MainPlayer {
  player: Phaser.Physics.Arcade.Sprite;
  acceleration: integer = 2400;
  isJumping: boolean;
  jumpungTimerReset: integer = 300;
  jumpingTimer: integer = 0;
  jumpHeight: integer = 400;

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

    this.jumpingTimer -= delta;

    if (input.left) {
      if (this.player.body.velocity.y === 0) {
        this.run(-this.acceleration);
      } else {
        this.run(-this.acceleration / 3);
      }
      //this.flipX = true;
    } else if (input.right) {
      if (this.player.body.velocity.y === 0) {
        this.run(this.acceleration);
      } else {
        this.run(this.acceleration / 3);
      }
      //this.flipX = false;
    } else if (this.player.body.blocked.down) {
      if (Math.abs(this.player.body.velocity.x) < 20) {
        this.player.setVelocityX(0);
        this.run(0);
      } else {
        this.run(((this.player.body.velocity.x > 0 ? -1 : 1) * this.acceleration) / 2);
      }
    } else if (!this.player.body.blocked.down) {
      this.run(0);
    }

    if (input.jump && (!this.isJumping || this.jumpingTimer > 0)) {
      this.jump();
    } else if (!input.jump) {
      this.jumpingTimer = -1;

      if (this.player.body.blocked.down) {
        this.isJumping = false;
      }
    }

  }

  jump() {
    if (!this.player.body.blocked.down && !this.isJumping) { return; }

    if (this.player.body.velocity.y < 0 || this.player.body.blocked.down) { this.player.setVelocityY(-this.jumpHeight); }

    if (!this.isJumping) { this.jumpingTimer = this.jumpungTimerReset; }

    this.isJumping = true;
  }

  run(vel) {
    this.player.setAccelerationX(vel);
  }
}

export default MainPlayer;