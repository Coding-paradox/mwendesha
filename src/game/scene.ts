import { Engine } from '@babylonjs/core/Engines/engine';
import { FollowCamera } from '@babylonjs/core/Cameras/followCamera';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { avenueLumumbaRoute } from '../data/routes/avenueLumumba';
import { closestRouteRatio, routeAt, routeWorldLength } from './route';
import { loadTaxiGlb } from './vehicles';
import { populateKitCorridor } from './cityKit';
// Si tu as toujours ton fichier world.ts, décommente cette ligne. Sinon, on utilise la boîte de secours.
// import { createWorld } from './world'; 

export interface DriveInput { throttle: number; brake: number; steer: number; horn: number }
export interface RideCallbacks {
  onPickup: () => void;
  onDropoff: () => void;
  onHorn: () => void;
  onTelemetry: (speedKmh: number, fuelPercent: number) => void;
  onRouteStatus?: (street: string, remainingMeters: number, progressRatio: number) => void;
}
export interface GameWorld {
  engine: Engine;
  scene: Scene;
  setInput: (input: DriveInput) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
}

export function createGameWorld(canvas: HTMLCanvasElement, callbacks: RideCallbacks, initialFuel = 82): GameWorld {
  const mobileDevice = matchMedia('(pointer: coarse)').matches || Math.min(window.innerWidth, window.innerHeight) < 600;
  const engine = new Engine(canvas, true, { antialias: false, powerPreference: 'high-performance', stencil: false }, false);
  engine.setHardwareScalingLevel(mobileDevice ? 1.45 : 1);
  
  const scene = new Scene(engine);
  scene.clearColor = Color3.FromHexString('#c8b699').toColor4(1);
  scene.fogMode = Scene.FOGMODE_EXP; scene.fogDensity = 0.00055; scene.fogColor = Color3.FromHexString('#c8b699');
  
  const skyLight = new HemisphericLight('daylight', new Vector3(0.2, 1, 0.15), scene);
  skyLight.intensity = 0.92; skyLight.groundColor = Color3.FromHexString('#8a7659');
  const sun = new DirectionalLight('katanga-sun', new Vector3(-0.5, -1, 0.4), scene); sun.intensity = 0.42;

  // --- 1. Création du monde (Décor + Taxi) ---
  // On charge ta ville Kenney !
  void populateKitCorridor(scene).then(() => {
    console.log("Décor de la ville chargé avec succès.");
  }).catch(err => console.error("Erreur chargement ville:", err));

  // Pour l'instant, on crée un taxi de secours (une boîte) pour que la caméra le suive.
  // Si ton fichier world.ts fonctionne, remplace cette partie par : const { taxi, taxiBody, ... } = createWorld(scene);
  const taxi = MeshBuilder.CreateBox("taxi-fallback", { width: 1, height: 1, depth: 2 }, scene);
  taxi.position.y = 0.5; // Pour qu'il soit sur la route
  const taxiBody = taxi; // La cible de la caméra
  
  // --- 2. Caméra ---
  let routeProgress = 0;
  let laneOffset = 0;
  const camera = new FollowCamera('third-person-camera', new Vector3(0, 6, -10), scene);
  camera.radius = 11.5; camera.heightOffset = 4.7; camera.rotationOffset = 180;
  camera.cameraAcceleration = 0.06; camera.maxCameraSpeed = 16; camera.lockedTarget = taxiBody;
  scene.activeCamera = camera;
  
  void loadTaxiGlb(scene, taxi).then(({ cameraTarget }) => {
    camera.lockedTarget = cameraTarget;
  }).catch((error: unknown) => console.warn('Le modèle GLB du taxi est indisponible, utilisation du modèle de secours.', error));

  // --- 3. Boucle de jeu ---
  let input: DriveInput = { throttle: 0, brake: 0, steer: 0, horn: 0 };
  let velocity = 0; let fuel = Math.max(0, Math.min(100, initialFuel)); let paused = false; let phase: 'pickup' | 'dropoff' = 'pickup';
  const pickupRatio = 30 / avenueLumumbaRoute.distanceMeters;
  let telemetryElapsed = 0; let hornElapsed = 0;
  
  engine.runRenderLoop(() => {
    const delta = Math.min(engine.getDeltaTime() / 1000, 0.05);
    if (!paused) {
      if (input.throttle > 0 && fuel > 0.1) velocity += 4.2 * input.throttle * delta;
      if (input.brake > 0) velocity -= 7.5 * input.brake * delta;
      velocity *= Math.pow(0.984, delta * 60); velocity = Math.max(-3.5, Math.min(13.5, velocity));
      
      routeProgress = Math.max(0, Math.min(routeWorldLength, routeProgress + velocity * delta));
      const ratio = routeProgress / routeWorldLength;
      laneOffset = Math.max(-5.3, Math.min(5.3, laneOffset + input.steer * Math.max(0.6, Math.abs(velocity)) * delta * 0.55));
      
      const roadPose = routeAt(ratio);
      taxi.position.copyFrom(roadPose.point.add(roadPose.side.scale(laneOffset)));
      taxi.rotation.y = roadPose.yaw + input.steer * Math.min(Math.abs(velocity) / 8, 0.16);
      
      // (Optionnel) Gestion du trafic si tu l'as dans world.ts
      // for (const vehicle of traffic) { ... }

      fuel = Math.max(0, fuel - Math.abs(velocity) * delta * 0.0042);
      if (fuel <= 0.1) velocity = Math.min(velocity, 2.5);
      if (input.horn > 0 && hornElapsed <= 0) { callbacks.onHorn(); hornElapsed = 0.7; }
      hornElapsed = Math.max(0, hornElapsed - delta);
      
      const targetRatio = phase === 'pickup' ? pickupRatio : 1;
      const targetPose = routeAt(targetRatio);
      
      // (Optionnel) Gestion du marqueur de client si tu l'as
      // marker.position.x = targetPose.point.x; marker.position.z = targetPose.point.z;

      const targetDistance = phase === 'pickup' ? routeWorldLength * pickupRatio : routeWorldLength;
      const distance = Math.abs(targetDistance - routeProgress);
      
      if (distance < 0.9) {
        if (phase === 'pickup') { 
          phase = 'dropoff'; 
          callbacks.onPickup(); 
        } else {
          callbacks.onDropoff(); 
          phase = 'pickup'; 
          routeProgress = 0; 
          laneOffset = 0; 
          taxi.position.copyFrom(routeAt(0).point); 
          taxi.rotation.y = routeAt(0).yaw; 
          velocity = 0;
        }
      }
      
      telemetryElapsed += delta;
      if (telemetryElapsed > 0.15) {
        callbacks.onTelemetry(Math.round(Math.abs(velocity) * 3.6), Math.round(fuel));
        const routeProgressMeters = ratio * avenueLumumbaRoute.distanceMeters;
        const street = avenueLumumbaRoute.streets.find((part) => routeProgressMeters <= part.endMeters)?.name ?? avenueLumumbaRoute.finish;
        callbacks.onRouteStatus?.(street, Math.max(0, Math.round(avenueLumumbaRoute.distanceMeters - routeProgressMeters)), routeProgressMeters / avenueLumumbaRoute.distanceMeters);
        telemetryElapsed = 0;
      }
    }
    scene.render();
  });
  
  const resize = (): void => engine.resize(); 
  window.addEventListener('resize', resize);
  
  return {
    engine, scene,
    setInput: (next) => { input = next; },
    setPaused: (value) => { paused = value; },
    dispose: () => { window.removeEventListener('resize', resize); engine.stopRenderLoop(); scene.dispose(); engine.dispose(); },
  };
}