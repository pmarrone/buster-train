import 'phaser';
import CameraManager from './cameraManager';
import MainPlayer from './player';
import LocomotiveTimer from './locomotiveTimer';
import { createLocomotive, dragCallback } from './locomotive';
import { IObstacle, Obstacle } from './Obstacle';

export default class MainScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  player: MainPlayer;
  locoTimer: LocomotiveTimer;
  cameraManager: CameraManager;
  locomotive: Phaser.Physics.Arcade.Group;
  mainPlayer: Phaser.Physics.Arcade.Sprite;
  groundTiles: Phaser.Tilemaps.Tileset;
  groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  keys: any;
  coin: any;
  saw: any;
  tool: any;

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
    this.load.image('saw', 'assets/saw.png');
    this.load.image('tool', 'assets/tool.png');
    this.load.image('timerContainer', 'assets/energycontainer.png');
    this.load.image('timeBar', 'assets/energybar.png');
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
    this.locomotive = createLocomotive(this);

    this.configurePhysics();
    this.configureCamera();

    // Generate some obstacles
    const obstacles: IObstacle[] = [];
    const gameWidth = this.game.config.width as number;

    for (let i = 0; i <= 3; i++) {
      const groundLayerTop = this.groundLayer.y;
      let spawnStartX = gameWidth;
      const spawnDistance = 300;
      if (obstacles.length > 1) {
        spawnStartX = obstacles[i - 1].image.x;
      }
      const spawnX = spawnStartX + spawnDistance;
      const obstacle = new Obstacle(
        this,
        this.physics.add.image(spawnX, groundLayerTop, 'coin'),
        'saw'
      );
      obstacles.push(obstacle);
    }

    // add collision
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      obstacle.addCollision(this.groundLayer);
    }
    this.createTimer();
  }

  private createTimer() {
    this.locoTimer = new LocomotiveTimer(this);
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
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height * 2;
    this.groundLayer.setCollisionByExclusion([-1]);
  }

  private configurePlayer() {
    this.mainPlayer = this.physics.add.sprite(300, 20, 'player');
    this.mainPlayer.setBounce(0.1);
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

    this.coin = this.physics.add.image(400, 100, 'coin').setDragX(100);
    this.saw = this.physics.add
      .image(900, 100, 'saw')
      .setName('saw')
      .setDragX(100)
      .setScale(0.5, 0.5);
    this.tool = this.physics.add.image(700, 100, 'tool').setDragX(100);

    this.player = new MainPlayer(
      this,
      this.mainPlayer,
      this.coin,
      this.saw,
      this.tool
    );
  }

  private configurePhysics() {
    const tools = [this.coin, this.saw, this.tool];
    this.physics.add.collider(this.groundLayer, this.mainPlayer);
    this.physics.add.collider(this.groundLayer, tools);
    const locomotiveCollider = this.physics.add.collider(
      this.locomotive,
      this.mainPlayer,
      dragCallback
    );

    this.physics.add.collider(this.locomotive, tools, dragCallback);
    // locomotiveCollider.collideCallback = dragCallback;
  }

  private configureCamera() {
    this.cameraManager = new CameraManager(this);
    this.cameraManager.init();
  }

  update(time, delta) {
    this.player.update(this.keys, time, delta);
    this.cameraManager.calculateZoomBetween(this.mainPlayer, this.locomotive);
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
      gravity: { y: 800 },
      debug: true,
      debugBodyColor: 0x100,
    },
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);
