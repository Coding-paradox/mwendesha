import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup';
import { ImportMeshAsync } from '@babylonjs/core/Loading/sceneLoader';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Scene } from '@babylonjs/core/scene';
import '@babylonjs/loaders/glTF';
import taxiModelUrl from '../assets/models/lushois-yellow-hatchback.glb?url';

export interface TrafficVehicle { root: TransformNode; speed: number }

export const mat = (scene: Scene, name: string, hex: string): StandardMaterial => {
  const value = new StandardMaterial(name, scene);
  value.diffuseColor = Color3.FromHexString(hex);
  value.specularColor = new Color3(0.06, 0.06, 0.06);
  return value;
};

export interface LoadedTaxiModel {
  cameraTarget: AbstractMesh;
  animationGroups: AnimationGroup[];
}

export async function loadTaxiGlb(scene: Scene, parent: TransformNode): Promise<LoadedTaxiModel> {
  const result = await ImportMeshAsync(taxiModelUrl, scene, { meshNames: '' });
  const importedMeshes = new Set(result.meshes);
  const roots = result.meshes.filter((mesh) => !(mesh.parent && importedMeshes.has(mesh.parent as AbstractMesh)));
  roots.forEach((mesh) => { mesh.parent = parent; });
  const cameraTarget = result.meshes.find((mesh) => mesh.getTotalVertices() > 0) ?? roots[0];
  if (!cameraTarget) throw new Error('Le GLB du taxi ne contient aucun maillage.');
  parent.getChildMeshes().filter((mesh) => !importedMeshes.has(mesh)).forEach((mesh) => mesh.dispose());
  return { cameraTarget, animationGroups: result.animationGroups };
}

export function signMat(scene: Scene, label: string, background: string): StandardMaterial {
  const texture = new DynamicTexture(`sign-${label}`, { width: 512, height: 128 }, scene, false);
  const context = texture.getContext() as CanvasRenderingContext2D;
  context.fillStyle = background;
  context.fillRect(0, 0, 512, 128);
  context.fillStyle = '#fff7e7';
  context.font = 'bold 42px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 256, 66, 480);
  texture.update(false);
  const value = new StandardMaterial(`sign-material-${label}`, scene);
  value.diffuseTexture = texture;
  value.emissiveColor = Color3.FromHexString('#ffffff').scale(0.08);
  return value;
}

export function makeTaxi(scene: Scene, parent: TransformNode, colorHex: string, id: string): Mesh {
  const body = MeshBuilder.CreateBox(`${id}-body`, { width: 1.9, height: 0.62, depth: 4.15 }, scene);
  body.parent = parent; body.position.y = 0.72; body.material = mat(scene, `${id}-paint`, colorHex);
  const cabin = MeshBuilder.CreateBox(`${id}-cabin`, { width: 1.62, height: 0.78, depth: 2.28 }, scene);
  cabin.parent = parent; cabin.position.set(0, 1.39, -0.1); cabin.material = mat(scene, `${id}-glass`, '#243b39');
  const roof = MeshBuilder.CreateBox(`${id}-roof`, { width: 1.64, height: 0.12, depth: 2.34 }, scene);
  roof.parent = parent; roof.position.set(0, 1.82, -0.1); roof.material = body.material;
  const hood = MeshBuilder.CreateBox(`${id}-hood`, { width: 1.78, height: 0.15, depth: 1.04 }, scene);
  hood.parent = parent; hood.position.set(0, 1.0, 1.42); hood.material = body.material;
  const bumper = MeshBuilder.CreateBox(`${id}-bumper`, { width: 1.88, height: 0.16, depth: 0.16 }, scene);
  bumper.parent = parent; bumper.position.set(0, 0.46, 2.09); bumper.material = mat(scene, `${id}-bumper-mat`, '#303733');
  const wheelMat = mat(scene, `${id}-tyres`, '#222522');
  for (const x of [-0.98, 0.98]) for (const z of [-1.35, 1.36]) {
    const wheel = MeshBuilder.CreateCylinder(`${id}-wheel-${x}-${z}`, { diameter: 0.66, height: 0.22, tessellation: 14 }, scene);
    wheel.parent = parent; wheel.position.set(x, 0.38, z); wheel.rotation.z = Math.PI / 2; wheel.material = wheelMat;
  }
  const roofSign = MeshBuilder.CreateBox(`${id}-roof-sign`, { width: 0.66, height: 0.23, depth: 0.4 }, scene);
  roofSign.parent = parent; roofSign.position.set(0, 1.98, -0.15); roofSign.material = mat(scene, `${id}-roof-sign-mat`, '#f1eee5');
  const glass = mat(scene, `${id}-glass-detail`, '#263a38');
  for (const [z, label] of [[1.23, 'front'], [-1.24, 'rear']] as const) {
    const pane = MeshBuilder.CreateBox(`${id}-${label}-windshield`, { width: 1.37, height: 0.48, depth: 0.055 }, scene);
    pane.parent = parent; pane.position.set(0, 1.42, z); pane.material = glass;
  }
  for (const x of [-0.84, 0.84]) for (const z of [-0.68, 0.58]) {
    const pane = MeshBuilder.CreateBox(`${id}-side-window-${x}-${z}`, { width: 0.055, height: 0.43, depth: 0.88 }, scene);
    pane.parent = parent; pane.position.set(x, 1.48, z); pane.material = glass;
  }
  const grille = MeshBuilder.CreateBox(`${id}-front-grille`, { width: 0.62, height: 0.2, depth: 0.055 }, scene);
  grille.parent = parent; grille.position.set(0, 0.78, 2.09); grille.material = mat(scene, `${id}-grille-mat`, '#343b36');
  for (const x of [-0.68, 0.68]) {
    const headlight = MeshBuilder.CreateBox(`${id}-headlight-${x}`, { width: 0.34, height: 0.22, depth: 0.06 }, scene);
    headlight.parent = parent; headlight.position.set(x, 0.89, 2.09); headlight.material = mat(scene, `${id}-lamp-mat-${x}`, '#f5e5b2');
    const tail = MeshBuilder.CreateBox(`${id}-tail-light-${x}`, { width: 0.31, height: 0.2, depth: 0.06 }, scene);
    tail.parent = parent; tail.position.set(x, 0.9, -2.09); tail.material = mat(scene, `${id}-tail-mat-${x}`, '#a94134');
  }
  const plate = MeshBuilder.CreateBox(`${id}-rear-plate`, { width: 0.58, height: 0.19, depth: 0.04 }, scene);
  plate.parent = parent; plate.position.set(0, 0.7, -2.12); plate.material = mat(scene, `${id}-plate-mat`, '#eee9da');
  return body;
}

export function makePlayerTaxiCar(scene: Scene, parent: TransformNode): Mesh {
  const paint = mat(scene, 'player-lushois-taxi-yellow', '#e9bb24');
  const glass = mat(scene, 'player-lushois-taxi-tinted-glass', '#263b3d');
  const trim = mat(scene, 'player-lushois-taxi-black-trim', '#292d2a');
  const dust = mat(scene, 'player-lushois-taxi-light-road-dust', '#aa8b53');
  const body = MeshBuilder.CreateBox('player-lushois-taxi-body', { width: 1.68, height: 0.48, depth: 3.5 }, scene);
  body.parent = parent; body.position.set(0, 0.72, 0); body.material = paint;
  const hood = MeshBuilder.CreateBox('player-lushois-taxi-short-hood', { width: 1.57, height: 0.26, depth: 0.86 }, scene);
  hood.parent = parent; hood.position.set(0, 1.03, 1.18); hood.material = paint;
  const cabin = MeshBuilder.CreateBox('player-lushois-taxi-cabin-shell', { width: 1.46, height: 0.64, depth: 2.0 }, scene);
  cabin.parent = parent; cabin.position.set(0, 1.18, -0.23); cabin.material = paint;
  const roundedRoof = MeshBuilder.CreateSphere('player-lushois-taxi-rounded-roof', { diameter: 1, segments: 12, slice: 0.72 }, scene);
  roundedRoof.parent = parent; roundedRoof.position.set(0, 1.52, -0.25); roundedRoof.scaling.set(1.32, 0.26, 1.46); roundedRoof.material = paint;
  const roof = MeshBuilder.CreateBox('player-lushois-taxi-roof', { width: 1.31, height: 0.12, depth: 1.27 }, scene);
  roof.parent = parent; roof.position.set(0, 1.72, -0.25); roof.material = paint;
  const windshield = MeshBuilder.CreatePlane('player-lushois-taxi-windshield', { width: 1.27, height: 0.58 }, scene);
  windshield.parent = parent; windshield.position.set(0, 1.32, 0.67); windshield.rotation.x = 0.42; windshield.material = glass;
  const rearGlass = MeshBuilder.CreatePlane('player-lushois-taxi-rear-glass', { width: 1.2, height: 0.48 }, scene);
  rearGlass.parent = parent; rearGlass.position.set(0, 1.34, -1.11); rearGlass.rotation.x = -0.48; rearGlass.material = glass;
  for (const side of [-1, 1]) {
    for (const [z, width] of [[0.15, 0.73], [-0.69, 0.55]] as const) {
      const window = MeshBuilder.CreateBox(`player-lushois-taxi-side-glass-${side}-${z}`, { width: 0.035, height: 0.42, depth: width }, scene);
      window.parent = parent; window.position.set(side * 0.727, 1.35, z); window.material = glass;
    }
    const mirror = MeshBuilder.CreateBox(`player-lushois-taxi-mirror-${side}`, { width: 0.16, height: 0.12, depth: 0.2 }, scene);
    mirror.parent = parent; mirror.position.set(side * 0.86, 1.23, 0.72); mirror.material = trim;
    const sticker = MeshBuilder.CreatePlane(`player-lushois-taxi-number-sticker-${side}`, { width: 0.52, height: 0.24 }, scene);
    sticker.parent = parent; sticker.position.set(side * 0.844, 0.92, 0.08); sticker.rotation.y = side * Math.PI / 2;
    sticker.material = signMat(scene, '024', '#f4f1e8');
    const dustBand = MeshBuilder.CreateBox(`player-lushois-taxi-dust-band-${side}`, { width: 0.025, height: 0.1, depth: 2.84 }, scene);
    dustBand.parent = parent; dustBand.position.set(side * 0.844, 0.51, -0.06); dustBand.material = dust;
    for (const z of [-1.08, 1.08]) {
      const wheel = MeshBuilder.CreateCylinder(`player-lushois-taxi-wheel-${side}-${z}`, { diameter: 0.58, height: 0.2, tessellation: 16 }, scene);
      wheel.parent = parent; wheel.position.set(side * 0.82, 0.38, z); wheel.rotation.z = Math.PI / 2; wheel.material = trim;
      const hub = MeshBuilder.CreateCylinder(`player-lushois-taxi-hub-${side}-${z}`, { diameter: 0.23, height: 0.215, tessellation: 12 }, scene);
      hub.parent = parent; hub.position.set(side * 0.82, 0.38, z); hub.rotation.z = Math.PI / 2; hub.material = mat(scene, `player-lushois-taxi-hub-mat-${side}-${z}`, '#78766d');
    }
    const scuff = MeshBuilder.CreateBox(`player-lushois-taxi-light-scuff-${side}`, { width: 0.022, height: 0.025, depth: 0.34 }, scene);
    scuff.parent = parent; scuff.position.set(side * 0.846, 0.67, -1.22); scuff.rotation.x = side * 0.06; scuff.material = dust;
  }
  for (const side of [-1, 1]) {
    const headlight = MeshBuilder.CreateBox(`player-lushois-taxi-headlight-${side}`, { width: 0.34, height: 0.18, depth: 0.045 }, scene);
    headlight.parent = parent; headlight.position.set(side * 0.54, 0.9, 1.76); headlight.material = mat(scene, `player-lushois-taxi-headlight-mat-${side}`, '#f4e5bf');
    const tail = MeshBuilder.CreateBox(`player-lushois-taxi-tail-light-${side}`, { width: 0.28, height: 0.27, depth: 0.05 }, scene);
    tail.parent = parent; tail.position.set(side * 0.59, 0.9, -1.77); tail.material = mat(scene, `player-lushois-taxi-tail-mat-${side}`, '#a94439');
  }
  const grille = MeshBuilder.CreateBox('player-lushois-taxi-grille', { width: 0.55, height: 0.14, depth: 0.05 }, scene);
  grille.parent = parent; grille.position.set(0, 0.78, 1.77); grille.material = trim;
  const frontBumper = MeshBuilder.CreateBox('player-lushois-taxi-front-bumper', { width: 1.64, height: 0.12, depth: 0.1 }, scene);
  frontBumper.parent = parent; frontBumper.position.set(0, 0.46, 1.76); frontBumper.material = trim;
  const rearBumper = MeshBuilder.CreateBox('player-lushois-taxi-rear-bumper', { width: 1.64, height: 0.12, depth: 0.1 }, scene);
  rearBumper.parent = parent; rearBumper.position.set(0, 0.46, -1.76); rearBumper.material = trim;
  const plate = MeshBuilder.CreateBox('player-lushois-taxi-rear-plate', { width: 0.48, height: 0.15, depth: 0.035 }, scene);
  plate.parent = parent; plate.position.set(0, 0.68, -1.78); plate.material = signMat(scene, '0202A1 05', '#eeeae0');
  return body;
}

export function makePlayerTaxiBus(scene: Scene, parent: TransformNode): Mesh {
  const yellow = mat(scene, 'player-minibus-yellow-weathered', '#d8ad23');
  const palePaint = mat(scene, 'player-minibus-faded-paint', '#d4cfbd');
  const bluePaint = mat(scene, 'player-minibus-blue-stripe', '#315b70');
  const dust = mat(scene, 'player-minibus-road-dust', '#8d7452');
  const rust = mat(scene, 'player-minibus-scratches', '#655644');
  const glass = mat(scene, 'player-minibus-glass', '#243b39');
  const trim = mat(scene, 'player-minibus-trim', '#303733');
  const body = MeshBuilder.CreateBox('player-taxi-bus-body', { width: 2.02, height: 1.08, depth: 4.8 }, scene);
  body.parent = parent; body.position.set(0, 1.08, 0); body.material = yellow;
  const cabin = MeshBuilder.CreateBox('player-taxi-bus-cabin', { width: 1.9, height: 1.15, depth: 3.72 }, scene);
  cabin.parent = parent; cabin.position.set(0, 2.08, -0.12); cabin.material = yellow;
  const roof = MeshBuilder.CreateBox('player-taxi-bus-roof', { width: 1.96, height: 0.16, depth: 3.55 }, scene);
  roof.parent = parent; roof.position.set(0, 2.72, -0.18); roof.material = palePaint;
  const hood = MeshBuilder.CreateBox('player-taxi-bus-hood', { width: 1.88, height: 0.25, depth: 0.48 }, scene);
  hood.parent = parent; hood.position.set(0, 1.64, 2.08); hood.material = yellow;
  for (const side of [-1, 1]) {
    for (const axle of [-1.55, 1.48]) {
      const wheel = MeshBuilder.CreateCylinder(`player-taxi-bus-wheel-${side}-${axle}`, { diameter: 0.72, height: 0.24, tessellation: 14 }, scene);
      wheel.parent = parent; wheel.position.set(side * 1.01, 0.46, axle); wheel.rotation.z = Math.PI / 2; wheel.material = trim;
    }
    for (const z of [-1.12, -0.05, 0.92]) {
      const window = MeshBuilder.CreateBox(`player-taxi-bus-window-${side}-${z}`, { width: 0.055, height: 0.72, depth: 0.82 }, scene);
      window.parent = parent; window.position.set(side * 0.962, 2.12, z); window.material = mat(scene, `player-taxi-bus-window-mat-${side}-${z}`, '#344946');
      const divider = MeshBuilder.CreateBox(`player-taxi-bus-divider-${side}-${z}`, { width: 0.065, height: 0.8, depth: 0.055 }, scene);
      divider.parent = parent; divider.position.set(side * 0.97, 2.12, z + 0.43); divider.material = trim;
    }
    const mirror = MeshBuilder.CreateBox(`player-taxi-bus-mirror-${side}`, { width: 0.16, height: 0.14, depth: 0.3 }, scene);
    mirror.parent = parent; mirror.position.set(side * 1.08, 2.02, 1.08); mirror.material = trim;
    const doorSeam = MeshBuilder.CreateBox(`player-taxi-bus-door-seam-${side}`, { width: 0.025, height: 0.98, depth: 0.025 }, scene);
    doorSeam.parent = parent; doorSeam.position.set(side * 1.025, 1.12, -0.58); doorSeam.material = trim;
    const dustBand = MeshBuilder.CreateBox(`player-taxi-bus-dust-band-${side}`, { width: 0.035, height: 0.24, depth: 4.18 }, scene);
    dustBand.parent = parent; dustBand.position.set(side * 1.028, 0.62, 0); dustBand.material = dust;
    const whiteLivery = MeshBuilder.CreateBox(`player-taxi-bus-white-livery-${side}`, { width: 0.035, height: 0.19, depth: 4.05 }, scene);
    whiteLivery.parent = parent; whiteLivery.position.set(side * 1.03, 1.02, 0); whiteLivery.material = palePaint;
    const blueLivery = MeshBuilder.CreateBox(`player-taxi-bus-blue-livery-${side}`, { width: 0.04, height: 0.055, depth: 4.08 }, scene);
    blueLivery.parent = parent; blueLivery.position.set(side * 1.035, 0.91, 0); blueLivery.material = bluePaint;
    for (const [index, z] of [-1.82, 1.62].entries()) {
      const scrape = MeshBuilder.CreateBox(`player-taxi-bus-scrape-${side}-${index}`, { width: 0.045, height: 0.035, depth: 0.42 + index * 0.12 }, scene);
      scrape.parent = parent; scrape.position.set(side * 1.04, 1.22 + index * 0.08, z); scrape.rotation.x = index ? 0.1 : -0.12; scrape.material = rust;
    }
    const dent = MeshBuilder.CreateSphere(`player-taxi-bus-dent-${side}`, { diameter: 0.34, segments: 6 }, scene);
    dent.parent = parent; dent.position.set(side * 0.99, 1.32, -2.08); dent.scaling.set(0.12, 0.62, 1.12); dent.material = dust;
    const routeLabel = MeshBuilder.CreatePlane(`player-taxi-bus-route-label-${side}`, { width: 1.35, height: 0.34 }, scene);
    routeLabel.parent = parent; routeLabel.position.set(side * 1.035, 1.34, 0.25); routeLabel.rotation.y = side * Math.PI / 2;
    routeLabel.material = signMat(scene, 'TAXI-BUS', '#273b34');
  }
  const frontGrille = MeshBuilder.CreateBox('player-taxi-bus-front-grille', { width: 0.78, height: 0.28, depth: 0.06 }, scene);
  frontGrille.parent = parent; frontGrille.position.set(0, 1.24, 2.425); frontGrille.material = trim;
  for (let index = -2; index <= 2; index += 1) {
    const grilleBar = MeshBuilder.CreateBox(`player-taxi-bus-grille-bar-${index}`, { width: 0.055, height: 0.23, depth: 0.02 }, scene);
    grilleBar.parent = parent; grilleBar.position.set(index * 0.13, 1.24, 2.46); grilleBar.material = palePaint;
  }
  for (const z of [1.98, -2.02]) {
    const glassPane = MeshBuilder.CreateBox(`player-taxi-bus-windshield-${z}`, { width: 1.65, height: 0.68, depth: 0.055 }, scene);
    glassPane.parent = parent; glassPane.position.set(0, 2.13, z); glassPane.material = glass;
  }
  for (const side of [-1, 1]) {
    const lamp = MeshBuilder.CreateBox(`player-taxi-bus-headlight-${side}`, { width: 0.38, height: 0.24, depth: 0.07 }, scene);
    lamp.parent = parent; lamp.position.set(side * 0.68, 1.34, 2.42); lamp.material = mat(scene, `player-taxi-bus-lamp-${side}`, '#f5e5b2');
    const tail = MeshBuilder.CreateBox(`player-taxi-bus-taillight-${side}`, { width: 0.3, height: 0.28, depth: 0.07 }, scene);
    tail.parent = parent; tail.position.set(side * 0.76, 1.3, -2.42); tail.material = mat(scene, `player-taxi-bus-tail-${side}`, '#ad4436');
  }
  const bumper = MeshBuilder.CreateBox('player-taxi-bus-bumper', { width: 2.04, height: 0.16, depth: 0.12 }, scene);
  bumper.parent = parent; bumper.position.set(0, 0.56, 2.43); bumper.material = trim;
  const sign = MeshBuilder.CreateBox('player-taxi-bus-route-sign', { width: 0.9, height: 0.3, depth: 0.44 }, scene);
  sign.parent = parent; sign.position.set(0, 2.94, -0.22); sign.material = mat(scene, 'player-taxi-bus-sign', '#f4e9c9');
  const roofFront = MeshBuilder.CreatePlane('player-taxi-bus-roof-taxi-front', { width: 0.82, height: 0.24 }, scene);
  roofFront.parent = parent; roofFront.position.set(0, 2.95, 0.005); roofFront.material = signMat(scene, 'TAXI', '#273b34');
  const roofBack = MeshBuilder.CreatePlane('player-taxi-bus-roof-taxi-back', { width: 0.82, height: 0.24 }, scene);
  roofBack.parent = parent; roofBack.position.set(0, 2.95, -0.445); roofBack.rotation.y = Math.PI; roofBack.material = roofFront.material;
  const destination = MeshBuilder.CreatePlane('player-taxi-bus-destination', { width: 1.42, height: 0.28 }, scene);
  destination.parent = parent; destination.position.set(0, 2.5, 2.012); destination.material = signMat(scene, 'POSTE · GARE SNCC', '#253b35');
  // Ouverture de la porte coulissante et silhouette du receveur : décor fixe pour cette première livraison.
  const doorway = MeshBuilder.CreateBox('player-taxi-bus-open-doorway', { width: 0.035, height: 1.38, depth: 1.0 }, scene);
  doorway.parent = parent; doorway.position.set(1.018, 1.94, -0.6); doorway.material = mat(scene, 'player-taxi-bus-doorway-dark', '#27312e');
  const openDoor = MeshBuilder.CreateBox('player-taxi-bus-sliding-door-open', { width: 0.09, height: 1.28, depth: 0.96 }, scene);
  openDoor.parent = parent; openDoor.position.set(1.48, 1.95, -0.56); openDoor.rotation.y = 0.12; openDoor.material = yellow;
  const step = MeshBuilder.CreateBox('player-taxi-bus-entry-step', { width: 0.48, height: 0.1, depth: 0.82 }, scene);
  step.parent = parent; step.position.set(1.24, 0.64, -0.6); step.material = trim;
  const conductor = new TransformNode('taxi-bus-receveur', scene);
  conductor.parent = parent; conductor.position.set(1.31, 0.65, -0.6);
  const conductorBody = MeshBuilder.CreateBox('taxi-bus-receveur-torso', { width: 0.4, height: 0.56, depth: 0.29 }, scene);
  conductorBody.parent = conductor; conductorBody.position.y = 0.98; conductorBody.material = mat(scene, 'receveur-vest', '#bd9b2d');
  const conductorHead = MeshBuilder.CreateSphere('taxi-bus-receveur-head', { diameter: 0.27, segments: 7 }, scene);
  conductorHead.parent = conductor; conductorHead.position.set(0, 1.42, 0.025); conductorHead.material = mat(scene, 'receveur-skin', '#603c2e');
  for (const side of [-1, 1]) {
    const leg = MeshBuilder.CreateBox(`taxi-bus-receveur-leg-${side}`, { width: 0.13, height: 0.52, depth: 0.16 }, scene);
    leg.parent = conductor; leg.position.set(side * 0.11, 0.3, 0.12); leg.rotation.x = -0.18; leg.material = mat(scene, `receveur-trousers-${side}`, '#343a37');
    const arm = MeshBuilder.CreateBox(`taxi-bus-receveur-arm-${side}`, { width: 0.12, height: 0.48, depth: 0.13 }, scene);
    arm.parent = conductor; arm.position.set(side * 0.28, 1.0, 0.08); arm.rotation.z = side === 1 ? -0.9 : 0.35; arm.material = mat(scene, `receveur-skin-arm-${side}`, '#603c2e');
  }
  return body;
}

export function makeTrafficCar(scene: Scene, id: string, color: string, x: number, z: number, rotation: number, speed: number): { root: TransformNode; speed: number } {
  const root = new TransformNode(`traffic-${id}`, scene);
  root.position.set(x, 0, z); root.rotation.y = rotation;
  const paint = mat(scene, `traffic-paint-${id}`, color);
  const glass = mat(scene, `traffic-glass-${id}`, '#334542');
  const tyre = mat(scene, `traffic-tyres-${id}`, '#222522');
  const body = MeshBuilder.CreateBox(`traffic-body-${id}`, { width: 1.8, height: 0.62, depth: 3.7 }, scene);
  body.parent = root; body.position.y = 0.7; body.material = paint;
  const cabin = MeshBuilder.CreateBox(`traffic-cabin-${id}`, { width: 1.52, height: 0.72, depth: 2.05 }, scene);
  cabin.parent = root; cabin.position.set(0, 1.35, -0.12); cabin.material = glass;
  for (const side of [-1, 1]) for (const axle of [-1.22, 1.22]) {
    const wheel = MeshBuilder.CreateCylinder(`traffic-wheel-${id}-${side}-${axle}`, { diameter: 0.56, height: 0.18, tessellation: 10 }, scene);
    wheel.parent = root; wheel.position.set(side * 0.92, 0.35, axle); wheel.rotation.z = Math.PI / 2; wheel.material = tyre;
  }
  const roof = MeshBuilder.CreateBox(`traffic-roof-${id}`, { width: 1.56, height: 0.1, depth: 2.1 }, scene);
  roof.parent = root; roof.position.set(0, 1.74, -0.12); roof.material = paint;
  return { root, speed };
}

