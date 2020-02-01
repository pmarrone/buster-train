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
    cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    cameras.main.startFollow(mainPlayer);

    // set background color, so the sky is not black
    cameras.main.setBackgroundColor('#ccccff');
  }
}

export default CameraManager;
