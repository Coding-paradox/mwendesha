import './style.css';
import { MwendeshaScene } from './game/mwendeshaScene';
import { populateKitCorridor } from './game/cityKit';
import { createRaceWorld, type RaceWorldActors } from './game/world';
import { routeAt, routeWorld, routeWorldLength } from './game/route';
import { loadTaxiFleet } from './game/vehicles';
import { loadLocalSave, persistLocalSave, type LocalSave } from './data/saveStore';
import { avenueLumumbaCourse } from './data/routes/avenueLumumba';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Application root missing');

app.innerHTML = `
  <main class="game-shell">
    <canvas id="game-canvas" aria-label="Vue de conduite de MWENDESHA"></canvas>
    <header class="topbar">
      <div class="brand-lockup"><div class="brand-mark">MW</div><div><strong>MWENDESHA</strong><span>Lubumbashi · taxi urbain</span></div></div>
      <div class="prototype-tag"><i></i> Course à Lubumbashi <span>· Avenue Lumumba</span></div>
      <button class="icon-button" id="pause-button" aria-label="Mettre en pause" title="Pause (P)">Ⅱ</button>
    </header>
    <div class="street-banner" aria-label="Axe de conduite">
      <small>COURSE · TRONÇON 1 / 1</small>
      <strong id="street-name">AVENUE LUMUMBA · RN1</strong>
      <span><b id="route-distance">642 m</b> · DISTANCE RESTANTE</span>
    </div>
    <section class="mission-card" aria-live="polite">
      <div class="eyebrow"><span class="eyebrow-dot"></span><span id="mission-kicker">COURSE · LUBUMBASHI</span></div>
      <h1 id="mission-title">Course Avenue Lumumba</h1>
      <p id="mission-copy">Prends un client au repère provisoire, puis rejoins l’arrivée. Les points d’arrêt sont à confirmer.</p>
      <div class="mission-route"><span id="route-from">ROND-POINT</span><span class="route-line"></span><span id="route-to">CARREFOUR · À VALIDER</span></div>
      <div class="race-summary" aria-live="polite">
        <div><small>PLACE</small><b id="race-rank">4e / 4</b></div>
        <div><small>CHRONO</small><b id="race-clock">00:00</b></div>
        <div><small>CLIENTS</small><b id="race-clients">0 / 1</b></div>
      </div>
      <button class="mission-action" id="mission-action" type="button">LANCER LA COURSE</button>
      <div class="local-note">Parcours OSM · © OpenStreetMap contributors · Tarif démo À VALIDER.</div>
    </section>
    <section class="wallet-card"><span class="wallet-label">SOLDE · FC</span><strong id="money-value">10 000</strong><div class="fuel-row"><span>Carburant</span><span id="fuel-value">82%</span></div><div class="fuel-track"><span id="fuel-bar"></span></div></section>
    <div class="speed-card"><strong id="speed-value">0</strong><span>km/h</span><small>VITESSE</small></div>
    <section class="route-map-card" aria-label="Carte schématique de l’Avenue Lumumba">
      <div class="route-map-heading"><span id="map-route-name">LUMUMBA · RN1</span><b>642 m</b></div>
      <svg id="route-map" viewBox="0 0 200 78" role="img" aria-label="Tronçon du rond-point au carrefour à valider">
        <path id="route-map-halo" d=""/><path id="route-map-path" d=""/>
        <circle id="route-map-start" r="3.5"/><circle id="route-map-end" r="3.5"/><circle id="route-map-player" r="4.5"/>
      </svg>
      <div class="route-map-footer"><span>CARREFOUR À VALIDER</span><small>© OpenStreetMap</small></div>
    </section>
    <div class="bottom-info"><span class="status-light"></span><span id="storage-status">Chargement de la sauvegarde locale…</span><span class="separator">·</span><span id="rides-value">0 course terminée</span></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="pause-overlay hidden" id="pause-overlay"><div class="pause-panel"><span class="eyebrow">MWENDESHA</span><h2>Pause</h2><p>Ta progression est conservée sur cet appareil.</p><button class="primary-button" id="resume-button">Reprendre la route</button></div></div>
    <div class="touch-controls" aria-label="Commandes tactiles">
      <div class="steering-pad"><button data-control="left" aria-label="Tourner à gauche">‹</button><button data-control="right" aria-label="Tourner à droite">›</button></div>
      <div class="pedal-pad"><button data-control="brake" aria-label="Freiner">FREIN</button><button class="accelerator" data-control="throttle" aria-label="Accélérer">ACCÉLÉRER</button><button class="horn-button" data-control="horn" aria-label="Klaxonner">KLAXON</button></div>
    </div>
    <div class="desktop-help">Conduire&nbsp;: WASD ou flèches <span>·</span> Action&nbsp;: E <span>·</span> Pause&nbsp;: P</div>
    <div class="finish-overlay hidden" id="finish-overlay" role="dialog" aria-modal="true" aria-labelledby="finish-title">
      <section class="finish-panel">
        <div class="eyebrow"><span class="eyebrow-dot"></span>COURSE TERMINÉE</div>
        <h2 id="finish-title">Résultat de la course</h2>
        <div class="finish-grid">
          <div><small>CLASSEMENT</small><b id="finish-rank">—</b></div>
          <div><small>TEMPS</small><b id="finish-time">—</b></div>
          <div><small>CLIENTS DÉPOSÉS</small><b id="finish-clients">—</b></div>
          <div><small>RECETTE DE DÉMO</small><b id="finish-reward">—</b></div>
        </div>
        <p id="finish-note">Tarif provisoire · À VALIDER localement.</p>
        <button class="primary-button" id="restart-course" type="button">REJOUER LE TRONÇON</button>
      </section>
    </div>
  </main>`;

const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Élément UI introuvable : ${selector}`);
  return element;
};

const moneyElement = $('#money-value');
const speedElement = $('#speed-value');
const fuelValue = $('#fuel-value');
const fuelBar = $('#fuel-bar');
const storageStatus = $('#storage-status');
const ridesValue = $('#rides-value');
const toast = $('#toast');
const pauseOverlay = $('#pause-overlay');
const pauseButton = $('#pause-button');
const routeDistance = $('#route-distance');
const routeMapPath = $<SVGPathElement>('#route-map-path');
const routeMapHalo = $<SVGPathElement>('#route-map-halo');
const routeMapPlayer = $<SVGCircleElement>('#route-map-player');
const missionTitle = $('#mission-title');
const missionCopy = $('#mission-copy');
const missionKicker = $('#mission-kicker');
const routeFrom = $('#route-from');
const routeTo = $('#route-to');
const missionAction = $<HTMLButtonElement>('#mission-action');
const raceRank = $('#race-rank');
const raceClock = $('#race-clock');
const raceClients = $('#race-clients');
const finishOverlay = $('#finish-overlay');

const displayMoney = (value: number): string => Math.round(value).toLocaleString('fr-FR');
const secondsToClock = (seconds: number): string => {
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};
const ordinal = (place: number): string => `${place === 1 ? '1er' : `${place}e`} / 4`;

const mapBounds = {
  minX: Math.min(...routeWorld.map((point) => point.x)), maxX: Math.max(...routeWorld.map((point) => point.x)),
  minZ: Math.min(...routeWorld.map((point) => point.z)), maxZ: Math.max(...routeWorld.map((point) => point.z)),
};
const toMap = (point: { x: number; z: number }): { x: number; y: number } => ({
  x: 10 + ((point.x - mapBounds.minX) / Math.max(1, mapBounds.maxX - mapBounds.minX)) * 180,
  y: 9 + ((point.z - mapBounds.minZ) / Math.max(1, mapBounds.maxZ - mapBounds.minZ)) * 60,
});
const routeMapD = routeWorld.map((point, index) => {
  const mapped = toMap(point);
  return `${index === 0 ? 'M' : 'L'} ${mapped.x.toFixed(1)} ${mapped.y.toFixed(1)}`;
}).join(' ');
routeMapPath.setAttribute('d', routeMapD);
routeMapHalo.setAttribute('d', routeMapD);
const startMapPoint = toMap(routeWorld[0]!);
const endMapPoint = toMap(routeWorld.at(-1)!);
$('#route-map-start').setAttribute('cx', String(startMapPoint.x));
$('#route-map-start').setAttribute('cy', String(startMapPoint.y));
$('#route-map-end').setAttribute('cx', String(endMapPoint.x));
$('#route-map-end').setAttribute('cy', String(endMapPoint.y));

let toastTimer = 0;
const showToast = (message: string): void => {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3000);
};

let save: LocalSave = {
  id: 'primary', moneyCdf: 10_000, fuelPercent: 82, totalRides: 0,
  vehicleKey: 'taxi-jaune-glb-rgsdev', updatedAt: new Date().toISOString(),
};
const renderSave = (): void => {
  moneyElement.textContent = displayMoney(save.moneyCdf);
  ridesValue.textContent = `${save.totalRides} course${save.totalRides === 1 ? '' : 's'} terminée${save.totalRides === 1 ? '' : 's'}`;
  fuelValue.textContent = `${Math.round(save.fuelPercent)}%`;
  fuelBar.style.width = `${Math.max(0, Math.min(100, save.fuelPercent))}%`;
};
const persist = async (): Promise<void> => {
  if (!await persistLocalSave(save)) storageStatus.textContent = 'Sauvegarde indisponible · session temporaire';
};

type RacePhase = 'ready' | 'to-pickup' | 'to-dropoff' | 'finished';
let world: MwendeshaScene | undefined;
let actors: RaceWorldActors | undefined;
let isPaused = false;
let currentSpeedMps = 0;
let fuel = 82;
let routeProgress = 0;
let laneOffset = 1.8;
let phase: RacePhase = 'ready';
let raceElapsed = 0;
let clientsPicked = 0;
let previousRank = 4;
let finalReward = 0;
let raceEnabled = false;
const input = { throttle: 0, brake: 0, steer: 0, horn: 0 };
const pickupStop = avenueLumumbaCourse.stops.find((stop) => stop.kind === 'pickup')!;
const dropoffStop = avenueLumumbaCourse.stops.find((stop) => stop.kind === 'dropoff')!;
const demoFareCdf = avenueLumumbaCourse.missions[0]!.fareCdf;

function renderMission(distanceToTarget: number): void {
  const stopped = currentSpeedMps < 1.6;
  let actionText = '';
  if (phase === 'ready') {
    missionKicker.textContent = 'DÉPART · ROND-POINT';
    missionTitle.textContent = 'Course Avenue Lumumba';
    missionCopy.textContent = 'Prends un client au repère provisoire, puis rejoins l’arrivée. Les arrêts restent à confirmer.';
    routeFrom.textContent = 'ROND-POINT'; routeTo.textContent = 'PRISE · À VALIDER';
    actionText = 'LANCER LA COURSE';
  } else if (phase === 'to-pickup') {
    missionKicker.textContent = 'CLIENT À PRENDRE';
    missionTitle.textContent = 'Rejoins le point de prise';
    missionCopy.textContent = 'Freine près du repère. Son emplacement est provisoire et reste à valider localement.';
    routeFrom.textContent = 'DÉPART'; routeTo.textContent = 'PRISE · À VALIDER';
    if (distanceToTarget <= 9 && stopped) actionText = 'PRENDRE LE CLIENT';
  } else if (phase === 'to-dropoff') {
    missionKicker.textContent = 'CLIENT À BORD · 1';
    missionTitle.textContent = 'Rejoins l’arrivée';
    missionCopy.textContent = 'Suis l’Avenue Lumumba jusqu’au carrefour terminal non nommé, puis immobilise le taxi.';
    routeFrom.textContent = 'CLIENT À BORD'; routeTo.textContent = 'ARRIVÉE · À VALIDER';
    if (routeProgress >= dropoffStop.distanceMeters - 5 && stopped) actionText = 'DÉPOSER LE CLIENT';
  } else {
    missionKicker.textContent = 'COURSE TERMINÉE';
    missionTitle.textContent = 'Bien joué, chauffeur';
    missionCopy.textContent = 'Le résultat et la recette de démonstration ont été enregistrés sur cet appareil.';
    routeFrom.textContent = 'ROND-POINT'; routeTo.textContent = 'CARREFOUR · À VALIDER';
  }
  missionAction.textContent = actionText;
  missionAction.hidden = !actionText;
  missionAction.disabled = phase !== 'ready' && !stopped;
}

function resetRun(): void {
  if (!actors || !world) return;
  phase = 'ready';
  routeProgress = 0;
  laneOffset = 1.8;
  currentSpeedMps = 0;
  raceElapsed = 0;
  clientsPicked = 0;
  previousRank = 4;
  finalReward = 0;
  finishOverlay.classList.add('hidden');
  actors.pickupMarker.setEnabled(true); actors.pickupStem.setEnabled(true);
  actors.destinationMarker.setEnabled(false); actors.destinationStem.setEnabled(false);
  actors.taxi.position.copyFrom(routeAt(0).point);
  actors.taxi.rotation.y = routeAt(0).yaw;
  avenueLumumbaCourse.rivals.forEach((rival, index) => { actors!.rivals[index]!.progressMeters = rival.startMeters; });
  raceClients.textContent = '0 / 1';
}

function interact(): void {
  if (!actors || !world) return;
  if (phase === 'ready') {
    phase = 'to-pickup';
    previousRank = 4;
    showToast('La course commence · rejoins le point de prise');
    return;
  }
  if (phase === 'to-pickup' && Math.abs(routeProgress - pickupStop.distanceMeters) <= 9 && currentSpeedMps < 1.6) {
    phase = 'to-dropoff';
    clientsPicked = 1;
    actors.pickupMarker.setEnabled(false); actors.pickupStem.setEnabled(false);
    actors.destinationMarker.setEnabled(true); actors.destinationStem.setEnabled(true);
    raceClients.textContent = '1 / 1';
    showToast('Client à bord · direction l’arrivée');
    return;
  }
  if (phase === 'to-dropoff' && routeProgress >= dropoffStop.distanceMeters - 5 && currentSpeedMps < 1.6) {
    const rank = 1 + actors.rivals.filter((rival) => rival.progressMeters > routeProgress).length;
    const placingBonus = rank === 1 ? 250 : rank === 2 ? 100 : 0;
    finalReward = demoFareCdf + placingBonus;
    save.moneyCdf += finalReward;
    save.totalRides += 1;
    phase = 'finished';
    actors.destinationMarker.setEnabled(false); actors.destinationStem.setEnabled(false);
    renderSave();
    void persist();
    $('#finish-rank').textContent = ordinal(rank);
    $('#finish-time').textContent = secondsToClock(raceElapsed);
    $('#finish-clients').textContent = `${clientsPicked} / 1`;
    $('#finish-reward').textContent = `+ ${displayMoney(finalReward)} FC`;
    finishOverlay.classList.remove('hidden');
    renderMission(0);
  }
}

async function start(): Promise<void> {
  const loaded = await loadLocalSave();
  save = loaded.save;
  storageStatus.textContent = loaded.persistent ? 'Progression enregistrée · hors ligne' : 'Sauvegarde temporaire · IndexedDB indisponible';
  renderSave();

  world = new MwendeshaScene($('#game-canvas') as HTMLCanvasElement);
  actors = createRaceWorld(world.scene);
  world.camera.target.set(0, 1.1, 0);
  storageStatus.textContent = 'Chargement du tronçon et des modèles GLB...';
  try {
    await populateKitCorridor(world.scene);
    await loadTaxiFleet(world.scene, actors.taxiModel, actors.rivals.map((rival) => rival.model));
    raceEnabled = true;
    storageStatus.textContent = 'Course prête · données et progression hors ligne';
    showToast('Avenue Lumumba · une course, un client, trois taxis rivaux');
  } catch (error) {
    console.error('Chargement des ressources de course impossible.', error);
    storageStatus.textContent = 'Un asset requis n’a pas chargé · aucun véhicule de secours généré';
    missionCopy.textContent = 'La course attend le chargement des modèles GLB autorisés.';
  }

  const mapPlayer = (distance: number): void => {
    const mapped = toMap(routeAt(Math.max(0, Math.min(1, distance / routeWorldLength))).point);
    routeMapPlayer.setAttribute('cx', String(mapped.x)); routeMapPlayer.setAttribute('cy', String(mapped.y));
  };
  const getRank = (): number => 1 + (actors?.rivals.filter((rival) => rival.progressMeters > routeProgress).length ?? 3);
  let telemetryAccumulator = 0;
  world.scene.onBeforeRenderObservable.add(() => {
    const delta = Math.min(world!.engine.getDeltaTime() / 1000, 0.05);
    if (isPaused || !raceEnabled) return;

    const running = phase === 'to-pickup' || phase === 'to-dropoff';
    if (running) {
      raceElapsed += delta;
      if (input.throttle > 0 && fuel > 0.1) currentSpeedMps = Math.min(16, currentSpeedMps + 5.6 * delta);
      else if (input.brake > 0) currentSpeedMps = Math.max(0, currentSpeedMps - 9.5 * delta);
      else currentSpeedMps = Math.max(0, currentSpeedMps - 0.7 * delta);
      laneOffset = Math.max(-5.8, Math.min(5.8, laneOffset + input.steer * 4.1 * delta));
      const nextProgress = routeProgress + currentSpeedMps * delta;
      if (phase === 'to-pickup' && routeProgress < pickupStop.distanceMeters && nextProgress >= pickupStop.distanceMeters + 8) {
        routeProgress = pickupStop.distanceMeters + 8;
        currentSpeedMps = 0;
        showToast('Point de prise · arrêt provisoire à valider');
      } else if (phase === 'to-dropoff' && nextProgress >= dropoffStop.distanceMeters) {
        routeProgress = Math.min(routeWorldLength, dropoffStop.distanceMeters);
        currentSpeedMps = 0;
      } else {
        routeProgress = Math.min(routeWorldLength, nextProgress);
      }
      actors!.rivals.forEach((rival) => { rival.progressMeters = Math.min(dropoffStop.distanceMeters, rival.progressMeters + rival.speedMetersPerSecond * delta); });
      fuel = Math.max(0, fuel - currentSpeedMps * delta * 0.0013);
      save.fuelPercent = fuel;
    }

    const routeRatio = routeProgress / routeWorldLength;
    const pose = routeAt(routeRatio);
    const taxiPosition = pose.point.add(pose.side.scale(laneOffset));
    actors!.taxi.position.copyFrom(taxiPosition);
    actors!.taxi.rotation.y = pose.yaw + input.steer * Math.min(currentSpeedMps / 30, 0.1);
    world!.camera.alpha = pose.yaw - Math.PI / 2;
    world!.camera.target.set(taxiPosition.x, 1.25, taxiPosition.z + 2.5);
    actors!.rivals.forEach((rival) => {
      const rivalPose = routeAt(rival.progressMeters / routeWorldLength);
      rival.root.position.copyFrom(rivalPose.point.add(rivalPose.side.scale(rival.laneOffsetMeters)));
      rival.root.rotation.y = rivalPose.yaw;
    });

    const rank = getRank();
    if ((phase === 'to-pickup' || phase === 'to-dropoff') && rank !== previousRank) {
      showToast(rank < previousRank ? 'Tu passes devant un taxi concurrent' : 'Un taxi concurrent te dépasse');
      previousRank = rank;
    }
    raceRank.textContent = ordinal(rank);
    raceClock.textContent = secondsToClock(raceElapsed);
    speedElement.textContent = String(Math.round(currentSpeedMps * 3.6));
    fuelValue.textContent = `${Math.round(fuel)}%`;
    fuelBar.style.width = `${Math.max(0, Math.min(100, fuel))}%`;
    routeDistance.textContent = `${Math.max(0, Math.round(routeWorldLength - routeProgress))} m`;
    mapPlayer(routeProgress);
    const targetDistance = phase === 'to-pickup' ? pickupStop.distanceMeters : routeWorldLength;
    const remainingToTarget = phase === 'ready' ? pickupStop.distanceMeters : Math.max(0, targetDistance - routeProgress);
    renderMission(remainingToTarget);
    telemetryAccumulator += delta;
    if (telemetryAccumulator >= 0.4) {
      telemetryAccumulator = 0;
      raceClients.textContent = `${clientsPicked} / 1`;
      renderSave();
    }
  });

  const setControl = (control: keyof typeof input, value: number): void => { input[control] = value; };
  const touchSteer = { left: false, right: false };
  document.querySelectorAll<HTMLButtonElement>('[data-control]').forEach((button) => {
    const name = button.dataset.control ?? '';
    const apply = (pressed: boolean): void => {
      if (name === 'left' || name === 'right') {
        touchSteer[name as 'left' | 'right'] = pressed;
        setControl('steer', Number(touchSteer.right) - Number(touchSteer.left));
      } else if (name === 'throttle' || name === 'brake' || name === 'horn') setControl(name, Number(pressed));
    };
    const press = (event: PointerEvent): void => { event.preventDefault(); button.setPointerCapture(event.pointerId); button.classList.add('pressed'); apply(true); };
    const release = (): void => { button.classList.remove('pressed'); apply(false); };
    button.addEventListener('pointerdown', press); button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
  });
  const activeKeys = new Set<string>();
  const updateKeyboard = (): void => {
    setControl('throttle', Number(activeKeys.has('ArrowUp') || activeKeys.has('KeyW')));
    setControl('brake', Number(activeKeys.has('ArrowDown') || activeKeys.has('KeyS')));
    setControl('steer', Number(activeKeys.has('ArrowRight') || activeKeys.has('KeyD')) - Number(activeKeys.has('ArrowLeft') || activeKeys.has('KeyA')));
    setControl('horn', Number(activeKeys.has('Space')));
  };
  const togglePause = (): void => {
    isPaused = !isPaused;
    pauseOverlay.classList.toggle('hidden', !isPaused);
    pauseButton.textContent = isPaused ? '▶' : 'Ⅱ';
  };
  missionAction.addEventListener('click', interact);
  $('#restart-course').addEventListener('click', resetRun);
  pauseButton.addEventListener('click', togglePause);
  $('#resume-button').addEventListener('click', togglePause);
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code === 'KeyP' && !event.repeat) togglePause();
    if (event.code === 'KeyE' && !event.repeat) interact();
    activeKeys.add(event.code); updateKeyboard();
  });
  window.addEventListener('keyup', (event) => { activeKeys.delete(event.code); updateKeyboard(); });
  window.addEventListener('blur', () => { activeKeys.clear(); updateKeyboard(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) void persist(); });
  window.addEventListener('beforeunload', () => { void persist(); world?.dispose(); });
}

void start();
