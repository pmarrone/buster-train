import 'phaser';

class MainPlayer {
  player: Phaser.Physics.Arcade.Sprite;

  coin: Phaser.Physics.Arcade.Sprite;
  saw: Phaser.Physics.Arcade.Sprite;
  tool: Phaser.Physics.Arcade.Sprite;

  scene: Phaser.Scene;
  acceleration: integer = 2400;
  isJumping: boolean;
  jumpungTimerReset: integer = 20;
  jumpingTimer: integer = 0;
  jumpHeight: integer = 700;
  holdingTool: boolean = false;

  collider: any;
  isColliding: boolean = false;
  grabbing: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    coin: Phaser.Physics.Arcade.Sprite,
    saw: Phaser.Physics.Arcade.Sprite,
    tool: Phaser.Physics.Arcade.Sprite
  ) {
    this.player = player;
    (this.player.body as Phaser.Physics.Arcade.Body).setMaxVelocity(300, 500);
    this.player.setScale(0.7, 0.7);

    this.scene = scene;
    this.coin = coin;
    this.saw = saw;
    this.tool = tool;
  }

  getKeyMapping(pressedKeys: any): any {
    return {
      left: pressedKeys.left.isDown,
      right: pressedKeys.right.isDown,
      down: pressedKeys.down.isDown,
      jump: pressedKeys.jump.isDown,
      action: pressedKeys.action.isDown,
    };
  }

  update(keys, time, delta) {
    var input = this.getKeyMapping(keys);

    this.jumpingTimer -= delta;

    if (input.left) {
      this.player.anims.play('walk', true);
      this.player.flipX = true;

      if (this.player.body.velocity.y === 0) {
        this.run(-this.acceleration);
      } else {
        this.run(-this.acceleration / 3);
      }
    } else if (input.right) {
      this.player.anims.play('walk', true);
      this.player.flipX = false;

      if (this.player.body.velocity.y === 0) {
        this.run(this.acceleration);
      } else {
        this.run(this.acceleration / 3);
      }
    } else if (
      this.player.body.blocked.down ||
      this.player.body.touching.down
    ) {
      if (Math.abs(this.player.body.velocity.x) < 20) {
        this.player.anims.play('idle', true);
        this.player.setVelocityX(0);
        this.run(0);
      } else {
        this.run(
          ((this.player.body.velocity.x > 0 ? -1 : 1) * this.acceleration) / 2
        );
      }
    } else if (!this.player.body.blocked.down) {
      this.run(0);
    }

    if (input.jump && !this.isJumping) {
      this.jump();
    } else if (!input.jump) {
      this.jumpingTimer = -1;

      if (this.player.body.blocked.down || this.player.body.touching.down) {
        this.isJumping = false;
      }
    }

    this.scene.physics.overlap(
      this.player,
      this.coin,
      this.setColliding,
      null,
      this
    );
    this.scene.physics.overlap(
      this.player,
      this.saw,
      this.setColliding,
      null,
      this
    );
    this.scene.physics.overlap(
      this.player,
      this.tool,
      this.setColliding,
      null,
      this
    );

    if (input.action && this.holdingTool) {
      this.grabbing.setX(this.player.x);
      this.grabbing.setY(this.player.y);
    } else if (input.action && this.isColliding) {
      this.grabbing = this.collider;
      this.holdingTool = true;
    } else {
      this.isColliding = false;
      this.holdingTool = false;
      this.grabbing = null;
    }
  }

  setColliding(obj1, obj2) {
    this.collider = obj2;
    this.isColliding = true;
  }

  jump() {
    if (
      !this.player.body.blocked.down &&
      !this.player.body.touching.down &&
      !this.isJumping
    ) {
      return;
    }

    if (this.player.body.velocity.y < 0 || this.player.body.blocked.down) {
      this.player.setVelocityY(-this.jumpHeight);
    }

    if (!this.isJumping) {
      this.jumpingTimer = this.jumpungTimerReset;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.velocity.x =
      playerBody.velocity.x + (playerBody.prev.x - playerBody.x) * 2;

    this.isJumping = true;
  }

  run(vel) {
    this.player.setAccelerationX(vel);
  }
}

export default MainPlayer;
