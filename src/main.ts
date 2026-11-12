import './style.css';
import { MwendeshaScene } from './game/mwendeshaScene';
import { populateKitCorridor } from './game/cityKit';
import { loadLocalSave, persistLocalSave } from './data/saveStore';
import { createGameWorld, type DriveInput, type GameWorld } from './game/scene';
import { avenueLumumbaRoute } from './data/routes/avenueLumumba';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Application root missing');

app.innerHTML = `
  <main class="game-shell">
    <canvas id="game-canvas" aria-label="Vue de conduite de MWENDESHA"></canvas>
    <header class="topbar">
      <div class="brand-lockup"><div class="brand-mark">MW</div><div><strong>MWENDESHA</strong><span>Lubumbashi · taxi urbain</span></div></div>
      <div class="prototype-tag"><i></i> Course de démonstration <span>· centre-ville</span></div>
      <button class="icon-button" id="pause-button" aria-label="Mettre en pause" title="Pause (P)">Ⅱ</button>
    </header>
    <div class="street-banner" aria-label="Axe de conduite">
      <small>AXE DE CONDUITE · LUBUMBASHI</small>
      <strong id="street-name">AVENUE LUMUMBA · RN1</strong>
      <span><b id="route-distance">642 m</b> · ROND-POINT → CARREFOUR</span>
    </div>
    <section class="mission-card" aria-live="polite">
      <div class="eyebrow"><span class="eyebrow-dot"></span><span id="mission-kicker">DÉPART · ROND-POINT</span></div>
      <h1 id="mission-title">Tronçon Avenue Lumumba</h1>
      <p id="mission-copy">Du rond-point au carrefour d’arrivée à confirmer.</p>
      <div class="mission-route"><span id="route-from">ROND-POINT</span><span class="route-line"></span><span id="route-to">CARREFOUR</span></div>
      <div class="local-note">Données routières OSM · © OpenStreetMap.</div>
    </section>
    <section class="wallet-card"><span class="wallet-label">SOLDE · FC</span><strong id="money-value">10 000</strong><div class="fuel-row"><span>Carburant</span><span id="fuel-value">82%</span></div><div class="fuel-track"><span id="fuel-bar"></span></div></section>
    <div class="speed-card"><strong id="speed-value">0</strong><span>km/h</span><small>VITESSE</small></div>
    <section class="route-map-card" aria-label="Carte schématique de l’Avenue Lumumba">
      <div class="route-map-heading"><span>LUMUMBA · RN1</span><b>642 m</b></div>
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
    <div class="desktop-help">Conduire&nbsp;: WASD ou flèches <span>·</span> Klaxon&nbsp;: Espace <span>·</span> Pause&nbsp;: P</div>
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

// --- UI de base ---
const routeMapD = "M 10 70 L 50 50 L 90 55 L 130 30 L 190 10"; 
routeMapPath.setAttribute('d', routeMapD);
routeMapHalo.setAttribute('d', routeMapD);
$('#route-map-start').setAttribute('cx', '10'); $('#route-map-start').setAttribute('cy', '70');
$('#route-map-end').setAttribute('cx', '190'); $('#route-map-end').setAttribute('cy', '10');

const displayMoney = (value: number): string => Math.round(value).toLocaleString('fr-FR');

let toastTimer = 0;
const showToast = (message: string): void => {
  toast.textContent = message; toast.classList.add('visible'); window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3200);
};

// --- Sauvegarde ---
let save: any = { id: 'primary', moneyCdf: 10_000, fuelPercent: 82, totalRides: 0, vehicleKey: 'taxi_berline_jaune', updatedAt: new Date().toISOString() };
let persistTimer = 0;

const renderSave = (): void => {
  moneyElement.textContent = displayMoney(save.moneyCdf);
  ridesValue.textContent = `${save.totalRides} course${save.totalRides === 1 ? '' : 's'} terminée${save.totalRides === 1 ? '' : 's'}`;
  fuelValue.textContent = `${Math.round(save.fuelPercent)}%`;
  fuelBar.style.width = `${Math.max(0, Math.min(100, save.fuelPercent))}%`;
};

const persist = async (): Promise<void> => {
  if (!await persistLocalSave(save)) storageStatus.textContent = 'Sauvegarde indisponible · progression de cette session seulement';
};

const updateFuel = (percent: number): void => {
  save.fuelPercent = percent; fuelValue.textContent = `${percent}%`; fuelBar.style.width = `${percent}%`;
  window.clearTimeout(persistTimer); persistTimer = window.setTimeout(() => void persist(), 900);
};

// --- Variables de Jeu ---
let world: MwendeshaScene | undefined;
let isPaused = false;
let currentSpeed = 0;
const input = { throttle: 0, brake: 0, steer: 0, horn: 0 };

async function start(): Promise<void> {
  try {
    const loaded = await loadLocalSave(); 
    if (loaded && loaded.save) save = loaded.save;
    storageStatus.textContent = loaded?.persistent ? 'Progression enregistrée · hors ligne' : 'Sauvegarde indisponible · session temporaire';
    renderSave();
  } catch(e) {
    console.warn("Erreur chargement save", e);
  }

  // Initialisation Babylon
  const canvas = $('#game-canvas') as HTMLCanvasElement;
  world = new MwendeshaScene(canvas);

  // Chargement de la ville
  storageStatus.textContent = 'Chargement de la ville...';
  try {
    await populateKitCorridor(world.scene);
    storageStatus.textContent = 'Ville chargée · Prêt à conduire';
    showToast('Bienvenue sur l\'Avenue Lumumba');
  } catch(e) {
    console.error(e);
    storageStatus.textContent = 'Erreur chargement de la ville';
  }

  // Boucle de jeu simulée
  world.scene.onBeforeRenderObservable.add(() => {
    if (isPaused) return;

    if (input.throttle > 0) currentSpeed = Math.min(100, currentSpeed + 0.5);
    else if (input.brake > 0) currentSpeed = Math.max(0, currentSpeed - 1);
    else currentSpeed = Math.max(0, currentSpeed - 0.1);

    speedElement.textContent = String(Math.round(currentSpeed));
    
    if (input.steer !== 0) {
      world!.camera.alpha += input.steer * 0.02;
    }
    const forward = world!.camera.getForwardRay().direction.scale(currentSpeed * 0.005);
    world!.camera.target.addInPlace(forward);
    world!.camera.position.addInPlace(forward);
    
    const progress = (world!.camera.target.z % 100) / 100;
    routeMapPlayer.setAttribute('cx', String(10 + Math.abs(progress) * 180));
    routeMapPlayer.setAttribute('cy', String(70 - Math.abs(progress) * 60));
    routeDistance.textContent = `${Math.round(Math.abs(world!.camera.target.z))} m`;
  });

  // Contrôles
  const setControl = (control: keyof typeof input, value: number): void => { input[control] = value; };
  const touchSteer = { left: false, right: false };

  document.querySelectorAll<HTMLButtonElement>('[data-control]').forEach((button) => {
    const name = button.dataset.control ?? '';
    const apply = (pressed: boolean): void => {
      if (name === 'left' || name === 'right') {
        touchSteer[name as 'left' | 'right'] = pressed;
        setControl('steer', Number(touchSteer.right) - Number(touchSteer.left));
      } else if (name === 'throttle' || name === 'brake' || name === 'horn') {
        setControl(name as 'throttle' | 'brake' | 'horn', Number(pressed));
      }
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

  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code === 'KeyP' && !event.repeat) togglePause();
    activeKeys.add(event.code); updateKeyboard();
  });

  window.addEventListener('keyup', (event) => { activeKeys.delete(event.code); updateKeyboard(); });
  window.addEventListener('blur', () => { activeKeys.clear(); updateKeyboard(); });
  
  pauseButton.addEventListener('click', togglePause);
  $('#resume-button').addEventListener('click', togglePause);
  
  document.addEventListener('visibilitychange', () => { if (document.hidden) void persist(); });
  window.addEventListener('beforeunload', () => { void persist(); world?.dispose(); });
}

void start();