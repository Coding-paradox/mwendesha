export interface LocalSave {
  id: 'primary';
  moneyCdf: number;
  fuelPercent: number;
  totalRides: number;
  vehicleKey: string;
  updatedAt: string;
}

const DATABASE_NAME = 'mwendesha-local';
const DATABASE_VERSION = 1;
const STORE_NAME = 'saves';

const freshSave = (): LocalSave => ({
  id: 'primary',
  moneyCdf: 10_000,
  fuelPercent: 82,
  totalRides: 0,
  vehicleKey: 'taxi_berline_jaune',
  updatedAt: new Date().toISOString(),
});

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB indisponible'));
  });
}

export async function loadLocalSave(): Promise<{ save: LocalSave; persistent: boolean }> {
  try {
    const database = await openDatabase();
    const save = await new Promise<LocalSave | undefined>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get('primary');
      request.onsuccess = () => resolve(request.result as LocalSave | undefined);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return { save: save ?? freshSave(), persistent: true };
  } catch {
    return { save: freshSave(), persistent: false };
  }
}

export async function persistLocalSave(save: LocalSave): Promise<boolean> {
  save.updatedAt = new Date().toISOString();
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(save);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
    return true;
  } catch {
    return false;
  }
}
