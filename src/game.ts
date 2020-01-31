import 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.atlasXML('cars', 'assets/cars.png', 'assets/cars.xml');
  }

  create() {
    var atlasTexture = this.textures.get('cars');
    var frames = atlasTexture.getFrameNames();

    console.log(frames);
    for (var i = 0; i < frames.length; i++) {
      var x = Phaser.Math.Between(0, 800);
      var y = Phaser.Math.Between(0, 600);

      this.add.image(x, y, 'cars', frames[i]);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: {y: 500},
        debug: false
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
