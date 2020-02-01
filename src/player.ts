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
    this.player.setScale(0.7, 0.7);
  }

  getKeyMapping(pressedKeys: any) : any {
    return {
      left: pressedKeys.left.isDown,
      right: pressedKeys.right.isDown,
      down: pressedKeys.down.isDown,
      jump: pressedKeys.jump.isDown,
      action: pressedKeys.action.isDown
    };
  }

  update(keys, time, delta) { 

    var input = this.getKeyMapping(keys);

    this.jumpingTimer -= delta;

    if (input.left) {
      this.player.anims.play('walk', true)
      this.player.flipX = true;

      if (this.player.body.velocity.y === 0) {
        this.run(-this.acceleration);
      } else {
        this.run(-this.acceleration / 3);
      }
    } else if (input.right) {
      this.player.anims.play('walk', true)
      this.player.flipX = false;

      if (this.player.body.velocity.y === 0) {
        this.run(this.acceleration);
      } else {
        this.run(this.acceleration / 3);
      }
    } else if (this.player.body.blocked.down) {
      if (Math.abs(this.player.body.velocity.x) < 20) {
        this.player.anims.play('idle', true);
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

  collectItem(item: Phaser.GameObjects.Image) {
    const playerCenterX = this.player.x + (this.player.width / 2);
    const playerCenterY = this.player.y + (this.player.height / 2);
    item.setPosition(playerCenterX, playerCenterY);
    return false;
  }
  
}

export default MainPlayer;