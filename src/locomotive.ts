import MainScene from './game';

export const dragCallback: ArcadePhysicsCallback = (dragged, drags) => {
  const draggedBody = dragged.body;
  const dragsbody = drags.body;
  if (
    !(
      draggedBody instanceof Phaser.Physics.Arcade.Body &&
      dragsbody instanceof Phaser.Physics.Arcade.Body
    )
  ) {
    return;
  }

  if (draggedBody.touching.down && draggedBody.bottom - dragsbody.top === 0) {
    draggedBody.x += dragsbody.deltaXFinal() * 2; // Magic number 2!;
  }
};

export const createLocomotive = (scene: MainScene) => {
  const container = scene.add.container(200, 0);
  const rectangles = [
    scene.add.rectangle(0, 30, 85, 10, 0x6666ff).setOrigin(0, 0),
    scene.add.rectangle(-50, 110, 170, 10, 0x6666ff).setOrigin(0, 0),
    scene.add.rectangle(105, 70, 65, 50, 0x6666ff).setOrigin(0, 0),
    scene.add.rectangle(80, 30, 30, 80, 0x6666ff).setOrigin(0, 0),
  ];
  container.add(rectangles);

  const group = scene.physics.add.group({
    frictionX: 0,
    allowGravity: false,
    immovable: true,
  });

  rectangles.forEach(rect => group.add(rect));
  container.setScale(2);
  container.setY(100);

  group.setVelocity(20, 0);

  return group;
};
