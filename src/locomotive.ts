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

  if (
    draggedBody.touching.down &&
    Math.abs(draggedBody.bottom - dragsbody.top) < 2
  ) {
    draggedBody.x += dragsbody.deltaX(); // Magic number 2!;
  }
};

export const createLocomotive = (scene: MainScene) => {
  const container = scene.add.container(200, 0);

  type LocomotiveRect = [number, number, number, number, string];

  const rectData = [
    [-11, 128, 19, 31, 'back'],
    [8, 110, 30, 49, 'middle-back'],
    [38, 60, 219, 99, 'coal-waggon'],
    [253, 136, 192, 11, 'locomotive-floor'],
    [355, 136, 283, 34, 'locomotive-base'],
    [469, 49, 132, 87, 'locomotive-block'],
    [446, 19, 30, 125, 'locomotive-front-wall'],
    [325, 19, 136, 15, 'locomotive-ceiling'],
    [560, 19, 30, 30, 'locomotive-chimney-1'],
    [518, 30, 30, 19, 'locomotive-chimney-2'],
  ];

  const rects = rectData.map(([x, y, w, h, name]) =>
    scene.add
      .rectangle(x as number, y as number, w as number, h as number, 0x6666ff)
      .setOrigin(0, 0)
      .setName(name as string)
  );

  container.add(rects);

  const group = scene.physics.add.group({
    frictionX: 0,
    allowGravity: false,
    immovable: true,
  });

  rects.forEach(rect => group.add(rect));

  container.setScale(1);
  container.setY(300);

  group.setVelocity(50, 0);

  return group;
};
