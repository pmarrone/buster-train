import 'phaser';

class LocomotiveTimer {
  scene: Phaser.Scene;
  energyMask: Phaser.GameObjects.Sprite;
  timer: Phaser.Time.TimerEvent;
  maxHealth: integer = 1;
  currentHealth: integer = 1;
  healthStep: integer = 0.01;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.configure();
  }

  configure() {
    //NO ANDA!!!! LA RE !
    var energyContainer = this.scene.add.sprite(320, 50, "timerContainer");
    var energyBar = this.scene.add.sprite(energyContainer.x - 200, energyContainer.y, "timeBar");

    energyContainer.setScrollFactor(0);
    energyBar.setScrollFactor(0);
    energyBar.setOrigin(0, 0.5);

    /*this.energyMask = this.scene.add.sprite(energyBar.x, energyBar.y, "timeBar");
    this.energyMask.visible = false;
    this.energyMask.setScrollFactor(0);
    energyBar.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.energyMask);*/

    this.timer = this.scene.time.addEvent({
        delay: 500,
        callback: function() {
          this.currentHealth -= this.healthStep;
          if (this.currentHealth < 0) { this.currentHealth = this.maxHealth; }
          energyBar.setScale(this.currentHealth, 1);
          //var stepWidth = energyBar.displayWidth - (energyBar.displayWidth / 60);
          //this.energyMask.x -= stepWidth;
        },
        callbackScope: this,
        loop: true
    });
  }

}

export default LocomotiveTimer;