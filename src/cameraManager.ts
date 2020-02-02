import 'phaser';
import MainScene from './game';

class CameraManager {
  scene: MainScene;

  constructor(scene: MainScene) {
    this.scene = scene;
  }

  init() {
    this.configureMainCamera();
  }

  configureMainCamera() {
    const { cameras, map, mainPlayer } = this.scene;
    // cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    cameras.main.startFollow(mainPlayer);

    // set background color, so the sky is not black
    cameras.main.setBackgroundColor('#ccccff');
  }

  calculateZoomBetween(mainPlayer: Phaser.Physics.Arcade.Sprite, locomotive: Phaser.Physics.Arcade.Group) {
    var train: Phaser.Physics.Arcade.Body;
    train = locomotive.getChildren()[4].body as Phaser.Physics.Arcade.Body;

    var distance = Phaser.Math.Distance.Between(train.x, train.y, mainPlayer.x, mainPlayer.y);
    var zoomFactor = Math.max(1 - (distance / 1000), 0.4);
    this.scene.cameras.main.setZoom(zoomFactor);
  }
}

export default CameraManager;
