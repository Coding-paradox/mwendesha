import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { routeAt, routeWorldLength } from './route.ts';

export function routePoseAtDistance(distance: number, tangentWindow = 5): { point: Vector3; yaw: number; side: Vector3 } {
  const clampedDistance = Math.max(0, Math.min(routeWorldLength, distance));
  const pose = routeAt(clampedDistance / routeWorldLength);
  const before = routeAt(Math.max(0, clampedDistance - tangentWindow) / routeWorldLength).point;
  const after = routeAt(Math.min(routeWorldLength, clampedDistance + tangentWindow) / routeWorldLength).point;
  let direction = after.subtract(before);
  if (distance < 0 || distance > routeWorldLength) direction = new Vector3(Math.sin(pose.yaw), 0, Math.cos(pose.yaw));
  if (direction.lengthSquared() < 1e-8) direction = new Vector3(Math.sin(pose.yaw), 0, Math.cos(pose.yaw));
  direction.normalize();
  const yaw = Math.atan2(direction.x, direction.z);
  const extension = distance < 0 ? distance : distance > routeWorldLength ? distance - routeWorldLength : 0;
  const point = pose.point.add(direction.scale(extension));
  return { point, yaw, side: new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)) };
}

/** Create paired continuous edge paths at metric offsets from the OSM route. */
export function sampleRouteStrip(
  start: number,
  end: number,
  innerOffset: number,
  outerOffset: number,
  y: number,
  step = 2.5,
): { inner: Vector3[]; outer: Vector3[] } {
  if (!(end > start) || !(step > 0)) throw new RangeError('Route strip requires an increasing range and a positive sample step.');
  const inner: Vector3[] = [];
  const outer: Vector3[] = [];
  const sampleCount = Math.ceil((end - start) / step);
  for (let index = 0; index <= sampleCount; index += 1) {
    const distance = start + Math.min(index * step, end - start);
    const pose = routePoseAtDistance(distance);
    inner.push(pose.point.add(pose.side.scale(innerOffset)).add(new Vector3(0, y, 0)));
    outer.push(pose.point.add(pose.side.scale(outerOffset)).add(new Vector3(0, y, 0)));
  }
  return { inner, outer };
}
