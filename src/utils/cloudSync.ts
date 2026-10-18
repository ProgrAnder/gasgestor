import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.ts';
import type { GasRecord } from '../types/gas.ts';
import { SEED_RECORDS } from './gasLogic.ts';

const COLLECTION_NAME = 'gas_records';

/**
 * Escucha en tiempo real la colección de Firestore.
 * Con el cache offline habilitado, lee inmediatamente de la memoria del teléfono
 * y se sincroniza con la nube en segundo plano cuando hay conexión.
 */
export function subscribeToGasRecords(
  callback: (records: GasRecord[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('fechaRegistro', 'desc'));

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    async (snapshot) => {
      if (snapshot.empty) {
        // Si la base de datos está totalmente vacía en el primer uso, sembramos los ejemplos
        callback(SEED_RECORDS);
      } else {
        const records: GasRecord[] = snapshot.docs.map((d) => d.data() as GasRecord);
        callback(records);
      }
    },
    (err) => {
      console.warn('Error en conexión Firestore (usando modo offline):', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Guarda o actualiza un registro.
 * Se guarda de inmediato localmente (offline) y se envía a Firebase al reconectar.
 */
export async function saveGasRecordToCloud(record: GasRecord): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, record.id);
  await setDoc(docRef, record, { merge: true });
}

/**
 * Elimina un registro tanto en offline como en la nube.
 */
export async function deleteGasRecordFromCloud(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Restablece los datos a los 5 ejemplos de prueba iniciales en la nube.
 */
export async function resetGasRecordsInCloud(): Promise<void> {
  const batch = writeBatch(db);
  for (const record of SEED_RECORDS) {
    const docRef = doc(db, COLLECTION_NAME, record.id);
    batch.set(docRef, record);
  }
  await batch.commit();
}
