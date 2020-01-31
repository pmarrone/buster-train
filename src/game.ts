import 'phaser';
import MainCamera from './Camera';
import MainPlayer from './player';

export default class MainScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  player: Phaser.Physics.Arcade.Sprite;
  groundTiles: Phaser.Tilemaps.Tileset;
  groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  // keyboard: Phaser.Types.Input.Keyboard;

  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.spritesheet('tiles', 'assets/tiles.png', {
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.image('coin', 'assets/coinGold.png');
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
  }

  create() {
    this.createMap();
    this.configurePlayer();
    this.configurePhysics();
    // this.configureMovement();
    this.configureCamera();
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
    this.player = new MainPlayer({
      scene: this,
      x: 200,
      y: 30,
      texture: 'player',
    });

  }

  private configurePhysics() {
    this.physics.add.collider(this.groundLayer, this.player);
  }

  private configureCamera() {
    const camera = new MainCamera(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    camera.startFollow(this.player);
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
