import 'phaser';
import MainCamera from './camera';
import MainPlayer from './player';

export default class MainScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  //mainPlayer: Phaser.GameObjects.Sprite;
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
      jump2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    };

    this.createMap();
    this.configurePlayer();
    this.configurePhysics();
    //this.configureMovement();
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
    this.mainPlayer = this.physics.add.sprite(200, 20, 'player');
    this.mainPlayer.setBounce(0.2);
    this.mainPlayer.setCollideWorldBounds(true);
     /*new MainPlayer({
      scene: this,
      x: 200,
      y: 20,
      texture: 'player'
    });*/
  }

  private configurePhysics() {
    this.physics.add.collider(this.groundLayer, this.mainPlayer);
  }

  /*private configureMovement() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }*/

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

  update(time, delta) { 
    //this.mainPlayer.update(this.keys, time, delta);

    if (this.keys.left.isDown) {
      this.mainPlayer.setVelocityX(-100);
    }
    
    if (this.keys.right.isDown) {
      this.mainPlayer.setVelocityX(100);
    }

    /* else {
      this.mainPlayer.setVelocityX(0);
    }*/
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
