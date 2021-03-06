import 'phaser';
import CameraManager from './cameraManager';
import MainPlayer from './player';
import LocomotiveTimer from './locomotiveTimer';
import { createLocomotive, dragCallback } from './locomotive';
import { Obstacle } from './Obstacle';

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
  obstacles: Obstacle[];

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

    // init obstacles
    this.obstacles = [new Obstacle(this, 'coin', 'saw')];

    // constants
    const spawnDistance = (this.game.config.width as number) * 2;
    const train = this.locomotive.getChildren()[4]
      .body as Phaser.Physics.Arcade.Body;

    // render random obstacle
    const randObstacleIdx = Phaser.Math.Between(0, this.obstacles.length - 1);
    const obstacle = this.obstacles[randObstacleIdx];
    const spawnX = train.x + spawnDistance;
    const spawnY = this.groundLayer.y;
    obstacle.render(spawnX, spawnY);
    obstacle.setCollision(this.groundLayer);

    // player collide with obstacles
    this.player.setObstacleOverlap(this.obstacles.map(obs => obs.image));

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

    this.player = new MainPlayer(this, this.mainPlayer);
    this.player.setToolsOverlap([this.coin, this.saw, this.tool]);
  }

  private configurePhysics() {
    const tools = [this.coin, this.saw, this.tool];
    this.physics.add.collider(this.groundLayer, this.mainPlayer);
    this.physics.add.collider(this.groundLayer, tools);
    this.physics.add.collider(this.locomotive, this.mainPlayer, dragCallback);

    this.physics.add.collider(this.locomotive, tools, dragCallback);
  }

  private configureCamera() {
    this.cameraManager = new CameraManager(this);
    this.cameraManager.init();
  }

  update(time, delta) {
    this.player.update(this.keys, time, delta);
    this.cameraManager.calculateZoomBetween(this.mainPlayer, this.locomotive);
    //this.physics.moveToObject(this.coin, this.mainPlayer);
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
