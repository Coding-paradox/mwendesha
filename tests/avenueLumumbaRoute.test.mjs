import assert from 'node:assert/strict';
import test from 'node:test';
import { avenueLumumbaRoute } from '../src/data/routes/avenueLumumba.ts';
import { closestRouteRatio, routeAt, routeWorld, routeWorldLength } from '../src/game/route.ts';
import { sampleRouteStrip } from '../src/game/routeGeometry.ts';

test('V1 uses the documented Avenue Lumumba OSM geometry', () => {
  assert.equal(avenueLumumbaRoute.osmWayId, 52253705);
  assert.equal(avenueLumumbaRoute.points.length, 8);
  assert.equal(avenueLumumbaRoute.streets[0].name, 'Avenue Lumumba · RN1');
  assert.equal(avenueLumumbaRoute.finish, 'Carrefour non nommé · à valider');
});

test('the projected route stays metric and near the documented 642 m', () => {
  assert.ok(routeWorldLength > 630 && routeWorldLength < 650, `Route length was ${routeWorldLength} m`);
  assert.ok(Math.abs(routeWorldLength - avenueLumumbaRoute.distanceMeters) < 3);
  assert.ok(routeWorld.every((point) => Number.isFinite(point.x) && Number.isFinite(point.z)));
});

test('route sampling clamps endpoints and reports a stable heading', () => {
  const start = routeAt(0);
  const end = routeAt(1);
  assert.ok(start.point.subtract(routeWorld[0]).length() < 1e-6);
  assert.ok(end.point.subtract(routeWorld.at(-1)).length() < 1e-6);
  assert.ok(Number.isFinite(start.yaw) && Number.isFinite(end.yaw));
  assert.ok(routeAt(-1).point.subtract(start.point).length() < 1e-6);
  assert.ok(routeAt(2).point.subtract(end.point).length() < 1e-6);
});

test('nearest-route projection recovers a sampled progress value', () => {
  const expectedRatio = 0.42;
  assert.ok(Math.abs(closestRouteRatio(routeAt(expectedRatio).point) - expectedRatio) < 0.002);
});

test('continuous carriageway and sidewalk paths stay joined along the route', () => {
  const roadway = sampleRouteStrip(-55, routeWorldLength + 28, -7.2, 7.2, 0);
  const leftWalk = sampleRouteStrip(-55, routeWorldLength + 28, -7.55, -11.25, 0.055);
  assert.equal(roadway.inner.length, roadway.outer.length);
  assert.equal(leftWalk.inner.length, roadway.inner.length);
  for (let index = 0; index < roadway.inner.length; index += 1) {
    const width = roadway.inner[index].subtract(roadway.outer[index]).length();
    assert.ok(Math.abs(width - 14.4) < 1e-6, `Road strip width changed to ${width} m at sample ${index}`);
    if (index > 0) {
      assert.ok(roadway.inner[index - 1].subtract(roadway.inner[index]).length() < 2.6);
      assert.ok(leftWalk.outer[index - 1].subtract(leftWalk.outer[index]).length() < 2.8);
    }
  }
});
