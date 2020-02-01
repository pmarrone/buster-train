import 'phaser';

class LocomotiveTimer {
  scene: Phaser.Scene;
  energyMask: Phaser.GameObjects.Sprite;
  timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.configure();
  }

  configure() {
    //NO ANDA!!!! LA RE !
    var energyContainer = this.scene.add.sprite(320, 50, "timerContainer");
    var energyBar = this.scene.add.sprite(energyContainer.x + 46, energyContainer.y, "timeBar");

    energyContainer.setScrollFactor(0);
    energyBar.setOrigin(1, 0.5);
    energyBar.setScrollFactor(0);

    /*this.energyMask = this.scene.add.sprite(energyBar.x, energyBar.y, "timeBar");
    this.energyMask.visible = false;
    this.energyMask.setScrollFactor(0);
    energyBar.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.energyMask);*/

    this.timer = this.scene.time.addEvent({
        delay: 500,
        callback: function() {
            var stepWidth = energyBar.displayWidth - (energyBar.displayWidth / 60);
            energyBar.setScale(0.5,1);
            //this.energyMask.x -= stepWidth;
            //energyBar.setW(stepWidth);
        },
        callbackScope: this,
        loop: true
    });
  }

}

export default LocomotiveTimer;