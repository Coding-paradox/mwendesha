import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { avenueLumumbaRoute } from '../data/routes/avenueLumumba';

// Projection locale des coordonnées OSM dans le plan X/Z du jeu (1 unité ≈ 8 m).
export const routeWorld = avenueLumumbaRoute.points.map(([longitude, latitude]) => new Vector3(
  (longitude - avenueLumumbaRoute.points[0][0]) * 111320 * Math.cos(avenueLumumbaRoute.points[0][1] * Math.PI / 180),
  0,
  -(latitude - avenueLumumbaRoute.points[0][1]) * 110540,
));

const routeLengths = [0];
for (let i = 1; i < routeWorld.length; i += 1) {
  routeLengths.push(routeLengths[i - 1]! + Vector3.Distance(routeWorld[i - 1]!, routeWorld[i]!));
}

export const routeWorldLength = routeLengths[routeLengths.length - 1]!;

export function routeAt(ratio: number): { point: Vector3; yaw: number; side: Vector3 } {
  const target = Math.max(0, Math.min(1, ratio)) * routeWorldLength;
  let i = 1;
  while (i < routeLengths.length - 1 && routeLengths[i]! < target) i += 1;
  const a = routeWorld[i - 1]!; const b = routeWorld[i]!;
  const segment = b.subtract(a); const length = Math.max(segment.length(), 0.001);
  const point = a.add(segment.scale(Math.max(0, Math.min(1, (target - routeLengths[i - 1]!) / length))));
  const yaw = Math.atan2(segment.x, segment.z);
  return { point, yaw, side: new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)) };
}

export function closestRouteRatio(position: Vector3): number {
  let bestDistance = Infinity; let bestAlong = 0;
  for (let i = 1; i < routeWorld.length; i += 1) {
    const a = routeWorld[i - 1]!; const b = routeWorld[i]!; const segment = b.subtract(a);
    const t = Math.max(0, Math.min(1, Vector3.Dot(position.subtract(a), segment) / Math.max(segment.lengthSquared(), 0.001)));
    const candidate = a.add(segment.scale(t)); const distance = Vector3.DistanceSquared(position, candidate);
    if (distance < bestDistance) { bestDistance = distance; bestAlong = routeLengths[i - 1]! + routeLengths[i]! * 0 + segment.length() * t; }
  }
  return bestAlong / routeWorldLength;
}
