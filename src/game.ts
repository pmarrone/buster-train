import 'phaser';
import CameraManager from './cameraManager';
import MainPlayer from './player';
import { createLocomotive, dragCallback } from './locomotive';

export default class MainScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  player: MainPlayer;
  locomotive: Phaser.Physics.Arcade.Group;
  mainPlayer: Phaser.Physics.Arcade.Sprite;
  groundTiles: Phaser.Tilemaps.Tileset;
  groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  keys: any;

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
    this.keys = {
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    };

    this.createMap();
    this.configurePlayer();
    this.configurePhysics();
    this.configureCamera();

    const collectItem = (sprite: any, tile: any) => {
      coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      const item = this.add.image(0, 0, 'coin');
      this.player.collectItem(item);
      return false;
    };

    // coin image used as tileset
    const coinTiles = this.map.addTilesetImage('coin');
    // add coins as tiles
    const coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

    coinLayer.setTileIndexCallback(17, collectItem, this); // the coin id is 17

    // when the player overlaps with a tile with index 17, collectCoin will be called
    this.physics.add.overlap(this.mainPlayer, coinLayer);
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
  }

  private configurePlayer() {
    this.mainPlayer = this.physics.add.sprite(300, 20, 'player');
    this.mainPlayer.setBounce(0.2);
    this.mainPlayer.setCollideWorldBounds(true);
    this.mainPlayer.body.setSize(
      this.mainPlayer.width,
      this.mainPlayer.height - 8
    );

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {
        prefix: 'p1_walk',
        start: 1,
        end: 11,
        zeroPad: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'p1_stand' }],
      frameRate: 10,
    });

    this.player = new MainPlayer(this.mainPlayer);
    this.locomotive = createLocomotive(this);
  }

  private configurePhysics() {
    this.physics.add.collider(this.groundLayer, this.mainPlayer);
    const locomotiveCollider = this.physics.add.collider(
      this.locomotive,
      this.mainPlayer
    );
    locomotiveCollider.collideCallback = dragCallback;
  }

  private configureCamera() {
    const cameraManager = new CameraManager(this);
    cameraManager.init();
  }

  update(time, delta) {
    this.player.update(this.keys, time, delta);
    this.groundLayer.update(this.cameras.main);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
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
