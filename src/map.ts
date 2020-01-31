export const setupMap = scene => {
  const map = scene.make.tilemap({ key: 'map' });
  const groundTiles = map.addTilesetImage('tiles');
  const groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
  groundLayer.fill(1, 0, 0, 1, 10);
  groundLayer.setCollisionByExclusion([-1]);
  return { map, groundLayer, groundTiles };
};
