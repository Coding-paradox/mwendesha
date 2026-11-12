import { ImportMeshAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import treeOakUrl from '../assets/models/vegetation/kenney-nature-kit/tree_oak.glb?url';
import treePalmUrl from '../assets/models/vegetation/kenney-nature-kit/tree_palm.glb?url';
import roadStraightUrl from '../assets/models/raw/kenney_city-kit-roads/Models/GLB format/road-straight.glb?url';
import roadColormapUrl from '../assets/models/raw/kenney_city-kit-roads/Models/GLB format/Textures/colormap.png?url';
import buildingAUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-a.glb?url';
import buildingBUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-b.glb?url';
import buildingDUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-d.glb?url';
import buildingEUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-e.glb?url';
import buildingFUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-f.glb?url';
import buildingGUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-g.glb?url';
import buildingHUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-h.glb?url';
import buildingIUrl from '../assets/models/raw/kenney_city-kit-commercial_2.1/Models/GLB format/building-i.glb?url';
import { routeAt, routeWorldLength } from './route';

const buildingUrls = [buildingAUrl, buildingBUrl, buildingDUrl, buildingEUrl, buildingFUrl, buildingGUrl, buildingHUrl, buildingIUrl];

async function loadTemplate(url: string, scene: Scene): Promise<Mesh> {
  const imported = await ImportMeshAsync(url, scene, { meshNames: '' });
  const mesh = imported.meshes.find((candidate: AbstractMesh) => candidate.getTotalVertices() > 0);
  
  if (!(mesh instanceof Mesh)) {
    throw new Error(`Le modèle ${url} ne contient pas de maillage statique exploitable.`);
  }
  
  // On cache le template d'origine
  mesh.position.set(0, -500, 0);
  mesh.isPickable = false;
  mesh.checkCollisions = false;
  
  // On nettoie les nœuds vides importés par le GLB pour ne garder que le mesh
  const toDispose = imported.meshes.filter((m) => m !== mesh && m.getTotalVertices() === 0);
  toDispose.forEach((m) => m.dispose());
  
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

/** Assemble the Avenue Lumumba corridor from Kenney road, building and nature GLBs. */
export async function populateKitCorridor(scene: Scene): Promise<void> {
  const [roadTemplate, ...loaded] = await Promise.all([
    loadTemplate(roadStraightUrl, scene),
    ...buildingUrls.map((url) => loadTemplate(url, scene)),
    loadTemplate(treeOakUrl, scene),
    loadTemplate(treePalmUrl, scene),
  ]);

  const buildings = loaded.slice(0, buildingUrls.length) as Mesh[];
  const trees = loaded.slice(buildingUrls.length) as Mesh[];

  if (!roadTemplate || buildings.length !== buildingUrls.length || trees.length !== 2) {
    throw new Error('Le kit de ville est incomplet.');
  }

  // Vite emits the GLB and its atlas as separate hashed assets. Rebind the atlas
  // explicitly so the Kenney road markings and asphalt are visible in production too.
  const roadMaterial = roadTemplate.material;
  if (roadMaterial instanceof PBRMaterial) {
    roadMaterial.albedoTexture = new Texture(roadColormapUrl, scene, false, false, Texture.TRILINEAR_SAMPLINGMODE);
  }

  // Kenney road tiles have a 1 × 1 m footprint. A 10.5 m pitch exactly matches
  // their scaled footprint, so the tile edges meet without geometric gaps.
  const roadTileScale = 10.5;
  for (let along = 0, index = 0; along < routeWorldLength; along += roadTileScale, index += 1) {
    const pose = routeAt(Math.min(1, (along + roadTileScale / 2) / routeWorldLength));
    const section = roadTemplate.createInstance(`kenney-avenue-lumumba-road-${index}`);
    section.position.set(pose.point.x, -0.015, pose.point.z);
    section.rotation.y = pose.yaw;
    section.scaling.setAll(roadTileScale);
    section.isPickable = false;
    section.checkCollisions = false;
  }

  const buildingSpacing = 16.8;
  let buildingIndex = 0;
  for (const side of [-1, 1]) {
    for (let along = 7; along < routeWorldLength - 4; along += buildingSpacing) {
      const pose = routeAt(along / routeWorldLength);
      const modelIndex = buildingIndex % buildings.length;
      const model = buildings[modelIndex]!;
      const facingRoad = pose.yaw + (side < 0 ? Math.PI / 2 : -Math.PI / 2);
      const center = pose.point.add(pose.side.scale(side * 12));
      
      placeInstance(
        model,
        `kenney-lushois-commercial-${side}-${buildingIndex}`,
        new Vector3(center.x, 0, center.z),
        facingRoad,
        5.8,
      );
      buildingIndex += 1;
    }
  }

  let treeIndex = 0;
  for (let along = 32; along < routeWorldLength - 18; along += 67.2) {
    const pose = routeAt(along / routeWorldLength);
    const side = treeIndex % 2 === 0 ? -1 : 1;
    const tree = trees[treeIndex % trees.length]!;
    const center = pose.point.add(pose.side.scale(side * 18));
    
    placeInstance(
      tree,
      `kenney-lushois-roadside-tree-${treeIndex}`,
      new Vector3(center.x, 0, center.z),
      pose.yaw,
      treeIndex % 2 === 0 ? 4.8 : 4.4,
    );
    treeIndex += 1;
  }
}