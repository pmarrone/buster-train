import 'phaser';
import MainCamera from './camera';
import MainPlayer from './player';

export default class MainScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  mainPlayer: Phaser.GameObjects.Sprite;
  groundTiles: Phaser.Tilemaps.Tileset;
  groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.spritesheet('tiles', 'assets/tiles.png', {
      frameWidth: 70,
      frameHeight: 70,
    });
    this.cameras.main
    this.load.image('coin', 'assets/coinGold.png');
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
  }

  create() {
    this.createMap();
    this.configurePlayer();
    this.configurePhysics();
    this.configureMovement();
    this.configureCamera();
  }

  private configureMovement() {
    // const cursors = this.input.keyboard.createCursorKeys();

    // if (cursors.left.isDown) {
    //   // if the left arrow key is down
    //   this.player.body.setVelocityX(-200); // move left
    // } else if (cursors.right.isDown) {
    //   // if the right arrow key is down
    //   this.player.body.setVelocityX(200); // move right
    // }
    // if (
    //   (cursors.space.isDown || cursors.up.isDown) &&
    //   this.player.body.onFloor()
    // ) {
    //   this.player.body.setVelocityY(-500); // jump up
    // }
  }

  private createMap() {
    this.map = this.make.tilemap({ key: 'map' });
    this.groundTiles = this.map.addTilesetImage('tiles');
    this.groundLayer = this.map.createDynamicLayer(
      'World',
      this.groundTiles,
      0,
      0
    );
    this.groundLayer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.load.atlasXML(
      'sprites',
      'assets/spritesheet_complete.png',
      'assets/spritesheet_complete.xml'
    );
  }

  private configurePlayer() {
    this.mainPlayer = new MainPlayer({
      scene: this,
      x: 200,
      y: 20,
      texture: 'player'
    });
  }

  private configurePhysics() {
    this.physics.add.collider(this.groundLayer, this.mainPlayer);
  }

  private configureCamera() {
    const camera = new MainCamera(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    camera.startFollow(this.mainPlayer);
    camera.setBackgroundColor('#ccccff');
    this.cameras.addExisting(camera);
  }
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
