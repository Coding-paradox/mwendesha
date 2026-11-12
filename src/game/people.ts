import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Scene } from '@babylonjs/core/scene';
import { mat } from './vehicles';

export function makePedestrian(scene: Scene, id: string, x: number, z: number, outfit: string, style: 'shirt' | 'dress' = 'shirt'): TransformNode {
  const person = new TransformNode(`civilian-${id}`, scene);
  person.position.set(x, 0, z);
  const skin = mat(scene, `skin-${id}`, id.charCodeAt(0) % 2 ? '#633a2c' : '#794b36');
  const clothes = mat(scene, `outfit-${id}`, outfit);
  const dark = mat(scene, `trousers-${id}`, '#292d2a');
  const torso = style === 'dress'
    ? MeshBuilder.CreateCylinder(`dress-${id}`, { diameterTop: 0.38, diameterBottom: 0.58, height: 0.95, tessellation: 8 }, scene)
    : MeshBuilder.CreateBox(`shirt-${id}`, { width: 0.46, height: 0.72, depth: 0.28 }, scene);
  torso.parent = person; torso.position.y = 1.05; torso.material = clothes;
  const head = MeshBuilder.CreateSphere(`head-${id}`, { diameter: 0.27, segments: 8 }, scene);
  head.parent = person; head.position.y = 1.62; head.material = skin;
  for (const side of [-1, 1]) {
    const leg = MeshBuilder.CreateBox(`leg-${id}-${side}`, { width: 0.15, height: 0.55, depth: 0.18 }, scene);
    leg.parent = person; leg.position.set(side * 0.12, 0.35, 0); leg.material = dark;
    const arm = MeshBuilder.CreateBox(`arm-${id}-${side}`, { width: 0.14, height: 0.52, depth: 0.17 }, scene);
    arm.parent = person; arm.position.set(side * 0.3, 1.06, 0.015); arm.material = skin;
  }
  return person;
}
