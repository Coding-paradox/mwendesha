import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Scene } from '@babylonjs/core/scene';
import { avenueLumumbaRoute } from '../data/routes/avenueLumumba';
import { avenueLumumbaCourse } from '../data/routes/avenueLumumba';
import { makePedestrian } from './people';
import { routeAt } from './route';
import { makePlayerTaxiBus, makePlayerTaxiCar, makeTaxi, makeTrafficCar, mat, type TrafficVehicle } from './vehicles';

export interface WorldActors {
  waitingClient: TransformNode;
  traffic: TrafficVehicle[];
  taxi: TransformNode;
  taxiBody: Mesh;
  marker: Mesh;
  stem: Mesh;
}

export interface RaceRival {
  id: string;
  root: TransformNode;
  model: TransformNode;
  speedMetersPerSecond: number;
  progressMeters: number;
  laneOffsetMeters: number;
}

export interface RaceWorldActors {
  taxi: TransformNode;
  taxiModel: TransformNode;
  rivals: RaceRival[];
  pickupMarker: Mesh;
  pickupStem: Mesh;
  destinationMarker: Mesh;
  destinationStem: Mesh;
}

function makeLateriteTexture(scene: Scene): DynamicTexture {
  const size = 256;
  const texture = new DynamicTexture('mwendesha-laterite-grain', { width: size, height: size }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
  const context = texture.getContext();
  const pixels = context.getImageData(0, 0, size, size);
  const hash = (x: number, y: number, grid: number): number => {
    const ix = ((x % grid) + grid) % grid;
    const iy = ((y % grid) + grid) % grid;
    let value = Math.imul(ix + 1, 0x45d9f3b) ^ Math.imul(iy + 7, 0x27d4eb2d);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return ((value ^ (value >>> 16)) >>> 0) / 0xffffffff;
  };
  const smooth = (value: number): number => value * value * (3 - 2 * value);
  const noise = (x: number, y: number, grid: number): number => {
    const px = x / size * grid; const py = y / size * grid;
    const ix = Math.floor(px); const iy = Math.floor(py);
    const tx = smooth(px - ix); const ty = smooth(py - iy);
    const a = hash(ix, iy, grid); const b = hash(ix + 1, iy, grid);
    const c = hash(ix, iy + 1, grid); const d = hash(ix + 1, iy + 1, grid);
    const top = a + (b - a) * tx; const bottom = c + (d - c) * tx;
    return top + (bottom - top) * ty;
  };
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const grain = noise(x, y, 64) * 0.35 + noise(x, y, 16) * 0.5 + noise(x, y, 4) * 0.15;
    const shade = (grain - 0.5) * 42;
    const index = (y * size + x) * 4;
    pixels.data[index] = Math.max(0, Math.min(255, 164 + shade * 0.72));
    pixels.data[index + 1] = Math.max(0, Math.min(255, 119 + shade * 0.72));
    pixels.data[index + 2] = Math.max(0, Math.min(255, 79 + shade * 0.62));
    pixels.data[index + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  texture.update(false);
  texture.uScale = 64; texture.vScale = 64;
  texture.wrapU = Texture.WRAP_ADDRESSMODE; texture.wrapV = Texture.WRAP_ADDRESSMODE;
  return texture;
}

export function createWorld(scene: Scene): WorldActors {
  const earth = MeshBuilder.CreateGround('dusty-ground', { width: 1600, height: 1600 }, scene);
  earth.position.set(0, -0.12, 0);
  // The generated texture already carries its laterite palette; white tint
  // preserves that sampled hue instead of multiplying it into saturated red.
  const laterite = mat(scene, 'katanga-laterite', '#ffffff');
  laterite.diffuseTexture = makeLateriteTexture(scene);
  laterite.specularColor.set(0.015, 0.012, 0.009);
  earth.material = laterite;
  for (const [id, x, z, outfit, style] of [
    ['vendeur-1', -8.4, 8, '#54785b', 'shirt'], ['cliente-1', 8.7, 13, '#a94840', 'dress'],
    ['passant-1', -8.8, 28, '#486b87', 'shirt'], ['passante-1', 8.8, 34, '#a9513f', 'dress'],
    ['passant-2', 8.7, 55, '#d1ad54', 'shirt'], ['passante-2', -8.7, 61, '#704b73', 'dress'],
    ['passant-3', -8.8, 75, '#527c6c', 'shirt'], ['vendeuse-2', 8.8, 82, '#b2673f', 'dress'],
  ] as const) makePedestrian(scene, id, x, z, outfit, style);
  const pickup = routeAt(30 / avenueLumumbaRoute.distanceMeters);
  const waitingClient = makePedestrian(scene, 'client-course', pickup.point.x + pickup.side.x * 9, pickup.point.z + pickup.side.z * 9, '#d8b64d', 'shirt');
  waitingClient.rotation.y = pickup.yaw;
  const minibusTraffic = new TransformNode('traffic-minibus-yellow', scene);
  minibusTraffic.position.set(-3.5, 0, 48);
  makePlayerTaxiBus(scene, minibusTraffic);
  const traffic = [
    makeTrafficCar(scene, 'taxi-jaune-a', '#e3b522', 3.6, 30, Math.PI, 3.6),
    { root: minibusTraffic, speed: 2.8 },
    makeTrafficCar(scene, 'berline-claire', '#d6d1c4', 3.7, 68, Math.PI, 3.3),
    makeTrafficCar(scene, 'berline-sombre', '#39423f', -3.6, 82, 0, 2.4),
  ];
  const taxi = new TransformNode('player-taxi', scene); taxi.position.copyFrom(routeAt(0).point); taxi.rotation.y = routeAt(0).yaw;
  const taxiBody = makePlayerTaxiCar(scene, taxi);
  const parkedOne = new TransformNode('parked-light-car', scene); const parkedPose = routeAt(0.29); parkedOne.position.copyFrom(parkedPose.point.add(parkedPose.side.scale(-10.8))); parkedOne.rotation.y = parkedPose.yaw;
  makeTaxi(scene, parkedOne, '#d8d8d2', 'parked-light-car');
  const parkedTwo = new TransformNode('parked-dark-car', scene); const parkedPoseTwo = routeAt(0.72); parkedTwo.position.copyFrom(parkedPoseTwo.point.add(parkedPoseTwo.side.scale(10.8))); parkedTwo.rotation.y = parkedPoseTwo.yaw + Math.PI;
  makeTaxi(scene, parkedTwo, '#343d3b', 'parked-dark-car');

  const markerSidePoint = pickup.point.add(pickup.side.scale(13.5));
  const marker = MeshBuilder.CreateTorus('ride-marker-ring', { diameter: 4.1, thickness: 0.16, tessellation: 28 }, scene);
  marker.position.set(markerSidePoint.x, 2.5, markerSidePoint.z); marker.material = mat(scene, 'marker-gold', '#efbd4e');
  const stem = MeshBuilder.CreateCylinder('ride-marker-stem', { diameterTop: 0.16, diameterBottom: 0.06, height: 2.2, tessellation: 10 }, scene);
  stem.position.set(markerSidePoint.x, 1.15, markerSidePoint.z); stem.material = mat(scene, 'marker-stem-mat', '#efbd4e');

  return { waitingClient, traffic, taxi, taxiBody, marker, stem };
}

/** Course scene: licensed GLB taxis only; no procedural people or traffic vehicles. */
export function createRaceWorld(scene: Scene): RaceWorldActors {
  const earth = MeshBuilder.CreateGround('race-dusty-ground', { width: 1600, height: 1600 }, scene);
  earth.position.set(0, -0.12, 0);
  const laterite = mat(scene, 'race-katanga-laterite', '#ffffff');
  laterite.diffuseTexture = makeLateriteTexture(scene);
  laterite.specularColor.set(0.015, 0.012, 0.009);
  earth.material = laterite;

  const taxi = new TransformNode('race-player-taxi', scene);
  const taxiModel = new TransformNode('race-player-taxi-glb', scene);
  taxiModel.parent = taxi;
  const rivals: RaceRival[] = avenueLumumbaCourse.rivals.map((rival) => {
    const root = new TransformNode(`race-${rival.id}`, scene);
    const model = new TransformNode(`race-${rival.id}-glb`, scene);
    model.parent = root;
    const pose = routeAt(rival.startMeters / avenueLumumbaCourse.route.distanceMeters);
    root.position.copyFrom(pose.point.add(pose.side.scale(rival.laneOffsetMeters)));
    root.rotation.y = pose.yaw;
    return {
      id: rival.id,
      root,
      model,
      speedMetersPerSecond: rival.speedMetersPerSecond,
      progressMeters: rival.startMeters,
      laneOffsetMeters: rival.laneOffsetMeters,
    };
  });

  const makeStopMarker = (id: string, distanceMeters: number): [Mesh, Mesh] => {
    const pose = routeAt(distanceMeters / avenueLumumbaRoute.distanceMeters);
    const point = pose.point.add(pose.side.scale(13.5));
    const ring = MeshBuilder.CreateTorus(`${id}-ring`, { diameter: 3.2, thickness: 0.14, tessellation: 20 }, scene);
    ring.position.set(point.x, 2.1, point.z);
    ring.material = mat(scene, `${id}-ring-material`, '#efbd4e');
    const stem = MeshBuilder.CreateCylinder(`${id}-stem`, { diameterTop: 0.14, diameterBottom: 0.08, height: 1.8, tessellation: 8 }, scene);
    stem.position.set(point.x, 0.95, point.z);
    stem.material = mat(scene, `${id}-stem-material`, '#efbd4e');
    return [ring, stem];
  };
  const pickupStop = avenueLumumbaCourse.stops.find((stop) => stop.kind === 'pickup')!;
  const dropoffStop = avenueLumumbaCourse.stops.find((stop) => stop.kind === 'dropoff')!;
  const [pickupMarker, pickupStem] = makeStopMarker('race-pickup', pickupStop.distanceMeters);
  const [destinationMarker, destinationStem] = makeStopMarker('race-destination', dropoffStop.distanceMeters);
  destinationMarker.setEnabled(false);
  destinationStem.setEnabled(false);

  return { taxi, taxiModel, rivals, pickupMarker, pickupStem, destinationMarker, destinationStem };
}
