import 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {
      frameWidth: 70,
      frameHeight: 70,
    });
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
  }

  create() {
    // load the map
    const map = this.make.tilemap({ key: 'map' });

    // tiles for the ground layer
    const groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    const groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    this.load.atlasXML('sprites', 'assets/spritesheet_complete.png', 'assets/spritesheet_complete.xml');
  }

  // create() {
  //   var atlasTexture = this.textures.get('sprites');
  //   var frames = atlasTexture.getFrameNames();

  //   this.anims.create({
  //       key: 'walk',
  //       frames: this.anims.generateFrameNames('player', { prefix: 'man_walk', start: 1, end: 2, zeroPad: 0 }),
  //       frameRate: 10,
  //       repeat: 0
  //   });

  //   var player = this.physics.add.sprite(200, 200, 'sprites');
  //   player.setBounce(0.2);
  //   player.setCollideWorldBounds(true);
  //   player.play("walk");

  //   console.log(frames);
    /*for (var i = 0; i < frames.length; i++) {
      var x = Phaser.Math.Between(0, 800);
      var y = Phaser.Math.Between(0, 600);

      this.add.image(x, y, 'sprites', frames[i]);
    }*/
//   }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);
