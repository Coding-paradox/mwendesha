import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { ImportMeshAsync, SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import '@babylonjs/loaders/glTF';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import treeOakUrl from '../assets/models/vegetation/kenney-nature-kit/tree_oak.glb?url';
import treePalmUrl from '../assets/models/vegetation/kenney-nature-kit/tree_palm.glb?url';
import { routeAt, routeWorldLength } from './route';
import { routePoseAtDistance, sampleRouteStrip } from './routeGeometry';

const ROAD_HALF_WIDTH = 7.2;
const SIDEWALK_INNER = 7.55;
const SIDEWALK_OUTER = 11.25;

async function loadTemplate(url: string, scene: Scene): Promise<Mesh> {
  const imported = await ImportMeshAsync(url, scene, { meshNames: '' });
  const mesh = imported.meshes.find((candidate: AbstractMesh) => candidate.getTotalVertices() > 0);
  if (!(mesh instanceof Mesh)) throw new Error(`Le modèle ${url} ne contient pas de maillage statique exploitable.`);
  mesh.position.set(0, -500, 0);
  mesh.isPickable = false;
  mesh.checkCollisions = false;
  return mesh;
}

function placeInstance(template: Mesh, name: string, position: Vector3, yaw: number, scale: number, parent?: TransformNode): void {
  const instance = template.createInstance(name);
  instance.parent = parent ?? null;
  instance.position.copyFrom(position);
  instance.rotation.y = yaw;
  instance.scaling.setAll(scale);
  instance.isPickable = false;
  instance.checkCollisions = false;
}

function material(scene: Scene, name: string, hex: string, specular = 0.025): StandardMaterial {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = Color3.FromHexString(hex);
  result.specularColor = new Color3(specular, specular, specular);
  return result;
}

function poseAtDistance(distance: number): { point: Vector3; yaw: number; side: Vector3 } {
  return routePoseAtDistance(distance);
}

function makeRouteStrip(scene: Scene, name: string, start: number, end: number, innerOffset: number, outerOffset: number, y: number, mat: StandardMaterial): Mesh {
  const { inner, outer } = sampleRouteStrip(start, end, innerOffset, outerOffset, y);
  const strip = MeshBuilder.CreateRibbon(name, { pathArray: [inner, outer], sideOrientation: Mesh.DOUBLESIDE, closeArray: false }, scene);
  strip.material = mat;
  strip.isPickable = false;
  strip.checkCollisions = false;
  return strip;
}

function makeAsphaltTexture(scene: Scene): Texture {
  const size = 256;
  const texture = new DynamicTexture('asphalt-micro-grain', { width: size, height: size }, scene, false, Texture.TRILINEAR_SAMPLINGMODE);
  const context = texture.getContext();
  const image = context.getImageData(0, 0, size, size);
  let seed = 0x4d574e;
  const random = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (let index = 0; index < size * size; index += 1) {
    const grain = (random() - 0.5) * 18;
    const base = 83 + grain;
    const pixel = index * 4;
    image.data[pixel] = base * 0.94;
    image.data[pixel + 1] = base;
    image.data[pixel + 2] = base * 0.98;
    image.data[pixel + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  texture.update(false);
  texture.uScale = 1;
  texture.vScale = 80;
  texture.wrapU = Texture.WRAP_ADDRESSMODE;
  texture.wrapV = Texture.WRAP_ADDRESSMODE;
  return texture;
}

function makeLaneMarkings(scene: Scene, paint: StandardMaterial, start: number, end: number): void {
  // Four-lane road: one centre divider and one dashed lane separator per direction.
  for (const offset of [-3.55, 0, 3.55]) {
    const positions: number[] = [];
    const indices: number[] = [];
    const dashLength = 3.7;
    const gapLength = 5.3;
    const dashCount = Math.floor((end - start) / (dashLength + gapLength));
    const halfWidth = 0.085;
    for (let dash = 0; dash < dashCount; dash += 1) {
      const dashStart = start + dash * (dashLength + gapLength);
      const dashEnd = Math.min(dashStart + dashLength, end);
      const p0 = poseAtDistance(dashStart);
      const p1 = poseAtDistance(dashEnd);
      const first = p0.point.add(p0.side.scale(offset));
      const last = p1.point.add(p1.side.scale(offset));
      const dashDirection = last.subtract(first).normalize();
      const dashSide = new Vector3(dashDirection.z, 0, -dashDirection.x);
      const left0 = first.add(dashSide.scale(-halfWidth)).add(new Vector3(0, 0.032, 0));
      const right0 = first.add(dashSide.scale(halfWidth)).add(new Vector3(0, 0.032, 0));
      const left1 = last.add(dashSide.scale(-halfWidth)).add(new Vector3(0, 0.032, 0));
      const right1 = last.add(dashSide.scale(halfWidth)).add(new Vector3(0, 0.032, 0));
      const base = positions.length / 3;
      positions.push(left0.x, left0.y, left0.z, right0.x, right0.y, right0.z, left1.x, left1.y, left1.z, right1.x, right1.y, right1.z);
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    const stripe = new Mesh(`lumumba-lane-marking-${offset}`, scene);
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    VertexData.ComputeNormals(positions, indices, vertexData.normals = []);
    vertexData.applyToMesh(stripe, false);
    stripe.material = paint;
    stripe.isPickable = false;
  }
}

function buildRoadAndEdges(scene: Scene): void {
  const roadStart = -55;
  const roadEnd = routeWorldLength + 28;
  const asphalt = material(scene, 'avenue-lumumba-asphalt', '#343a3a', 0.018);
  const curb = material(scene, 'avenue-lumumba-curb-concrete', '#a39b87', 0.01);
  const pavement = material(scene, 'avenue-lumumba-sidewalk-paving', '#aaa18d', 0.015);
  const paint = material(scene, 'avenue-lumumba-lane-paint', '#ddd7c7', 0.01);
  asphalt.diffuseTexture = makeAsphaltTexture(scene);
  asphalt.diffuseColor.set(1, 1, 1);
  asphalt.freeze();
  curb.freeze();
  pavement.freeze();
  paint.freeze();

  // Each surface is a single continuous mesh following the OSM centreline.
  // No repeated road tiles means no tile-width bands or inter-tile overlaps.
  makeRouteStrip(scene, 'avenue-lumumba-continuous-carriageway', roadStart, roadEnd, -ROAD_HALF_WIDTH, ROAD_HALF_WIDTH, 0, asphalt);
  for (const side of [-1, 1]) {
    makeRouteStrip(scene, `avenue-lumumba-curb-${side}`, roadStart, roadEnd, side * ROAD_HALF_WIDTH, side * SIDEWALK_INNER, 0.035, curb);
    makeRouteStrip(scene, `avenue-lumumba-sidewalk-${side}`, roadStart, roadEnd, side * SIDEWALK_INNER, side * SIDEWALK_OUTER, 0.055, pavement);
  }
  makeLaneMarkings(scene, paint, 2, routeWorldLength - 2);
}

/** Build the drivable corridor from OSM route geometry and import the supplied context models. */
export async function populateKitCorridor(scene: Scene): Promise<void> {
  const [oak, palm] = await Promise.all([loadTemplate(treeOakUrl, scene), loadTemplate(treePalmUrl, scene)]);
  buildRoadAndEdges(scene);

  // OSM2CDR's city export is a useful route-aligned massing source, but its
  // building contours/heights are not façade photography. It is not silently
  // substituted here: retain the supplied MidCity model as an openly generic
  // art block until a corridor export or local façade references are available.
  const importedCity = await SceneLoader.ImportMeshAsync('', '/assets/models/', 'midcity_buildings.glb', scene);
  const cityRoot = new TransformNode('midcity-generic-context-block-01', scene);
  const roots = importedCity.transformNodes.filter((node) => node.parent === null);
  const importedRoots = roots.length > 0 ? roots : importedCity.meshes.filter((mesh) => mesh.parent === null);
  if (importedRoots.length === 0) throw new Error('Le GLB MidCity ne contient pas de racine exploitable.');
  importedRoots.forEach((node) => { node.parent = cityRoot; });
  for (const mesh of importedCity.meshes) {
    mesh.isPickable = false;
    mesh.checkCollisions = false;
  }
  const firstBlockPose = routeAt(0.055);
  cityRoot.position.copyFrom(firstBlockPose.point.add(firstBlockPose.side.scale(29)));
  cityRoot.rotation.y = firstBlockPose.yaw - Math.PI / 2;
  cityRoot.scaling.setAll(0.36);

  const secondBlock = cityRoot.clone('midcity-generic-context-block-02', null);
  if (secondBlock) {
    const secondPose = routeAt(0.055);
    secondBlock.position.copyFrom(secondPose.point.add(secondPose.side.scale(-29)));
    secondBlock.rotation.y = secondPose.yaw - Math.PI / 2;
  }

  let treeIndex = 0;
  for (let along = 24; along < routeWorldLength - 20; along += 58) {
    const pose = poseAtDistance(along);
    const side = treeIndex % 2 === 0 ? -1 : 1;
    const tree = treeIndex % 3 === 0 ? palm : oak;
    const roadsideOffset = treeIndex % 3 === 0 ? 23 : 18.5;
    const center = pose.point.add(pose.side.scale(side * roadsideOffset));
    placeInstance(tree, `lushois-roadside-tree-${treeIndex}`, new Vector3(center.x, 0, center.z), pose.yaw, treeIndex % 3 === 0 ? 3.8 : 4.1);
    treeIndex += 1;
  }
}
