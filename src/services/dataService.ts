import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  SpaceProfile,
  PlantAdoption,
  CareTask,
  HealthDiagnostic,
  AirQualityBaseline,
  PointTransaction,
  RewardItem,
  UserSustainabilityPreferences,
  UserPlantPreferences,
} from '../types';

export type DataMode = 'mock' | 'cloud';

export const CURRENT_DATA_MODE: DataMode =
  (import.meta.env.VITE_DATA_MODE as DataMode) === 'mock' ? 'mock' : 'cloud';

/**
 * LittleStep Data Repository Layer
 * Manages persistence between React Context and Cloud Firestore subcollections.
 */

// Helper to get user subcollection path
export const getUserSubcollectionRef = (uid: string, subcollection: string) => {
  return collection(db, 'users', uid, subcollection);
};

export const getUserDocRef = (uid: string, subcollection: string, docId: string) => {
  return doc(db, 'users', uid, subcollection, docId);
};

// --------------------------------------------------------------------------
// SPACES REPOSITORY
// --------------------------------------------------------------------------
export async function saveSpaceToCloud(uid: string, space: SpaceProfile): Promise<void> {
  if (!uid || !space.id) return;
  try {
    const spaceRef = getUserDocRef(uid, 'spaces', space.id);
    await setDoc(spaceRef, {
      ...space,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save space to Firestore:', error);
    throw error;
  }
}

export async function deleteSpaceFromCloud(uid: string, spaceId: string): Promise<void> {
  if (!uid || !spaceId) return;
  try {
    const spaceRef = getUserDocRef(uid, 'spaces', spaceId);
    await deleteDoc(spaceRef);
  } catch (error) {
    console.error('[DataService] Failed to delete space from Firestore:', error);
    throw error;
  }
}

export function subscribeToUserSpaces(
  uid: string,
  onData: (spaces: SpaceProfile[]) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const spacesRef = getUserSubcollectionRef(uid, 'spaces');
    return onSnapshot(
      spacesRef,
      (snapshot) => {
        const spaces: SpaceProfile[] = [];
        snapshot.forEach((docSnap) => {
          spaces.push(docSnap.data() as SpaceProfile);
        });
        onData(spaces);
      },
      (error) => {
        console.error('[DataService] Error subscribing to spaces:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish spaces snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// ADOPTIONS REPOSITORY
// --------------------------------------------------------------------------
export async function saveAdoptionToCloud(uid: string, adoption: PlantAdoption): Promise<void> {
  if (!uid || !adoption.id) return;
  try {
    const adoptionRef = getUserDocRef(uid, 'adoptions', adoption.id);
    await setDoc(adoptionRef, {
      ...adoption,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save adoption to Firestore:', error);
    throw error;
  }
}

export async function deleteAdoptionFromCloud(uid: string, adoptionId: string): Promise<void> {
  if (!uid || !adoptionId) return;
  try {
    const adoptionRef = getUserDocRef(uid, 'adoptions', adoptionId);
    await deleteDoc(adoptionRef);
  } catch (error) {
    console.error('[DataService] Failed to delete adoption from Firestore:', error);
    throw error;
  }
}

export function subscribeToUserAdoptions(
  uid: string,
  onData: (adoptions: PlantAdoption[]) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const adoptionsRef = getUserSubcollectionRef(uid, 'adoptions');
    return onSnapshot(
      adoptionsRef,
      (snapshot) => {
        const adoptions: PlantAdoption[] = [];
        snapshot.forEach((docSnap) => {
          adoptions.push(docSnap.data() as PlantAdoption);
        });
        onData(adoptions);
      },
      (error) => {
        console.error('[DataService] Error subscribing to adoptions:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish adoptions snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// CARE TASKS REPOSITORY
// --------------------------------------------------------------------------
export async function saveCareTaskToCloud(uid: string, task: CareTask): Promise<void> {
  if (!uid || !task.id) return;
  try {
    const taskRef = getUserDocRef(uid, 'care_tasks', task.id);
    await setDoc(taskRef, {
      ...task,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save care task to Firestore:', error);
    throw error;
  }
}

export function subscribeToUserCareTasks(
  uid: string,
  onData: (tasks: CareTask[]) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const tasksRef = getUserSubcollectionRef(uid, 'care_tasks');
    return onSnapshot(
      tasksRef,
      (snapshot) => {
        const tasks: CareTask[] = [];
        snapshot.forEach((docSnap) => {
          tasks.push(docSnap.data() as CareTask);
        });
        onData(tasks);
      },
      (error) => {
        console.error('[DataService] Error subscribing to care tasks:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish care tasks snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// HEALTH DIAGNOSTICS REPOSITORY
// --------------------------------------------------------------------------
export async function saveDiagnosticToCloud(uid: string, diag: HealthDiagnostic): Promise<void> {
  if (!uid || !diag.id) return;
  try {
    const diagRef = getUserDocRef(uid, 'diagnostics', diag.id);
    await setDoc(diagRef, {
      ...diag,
      userId: uid,
      savedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save diagnostic to Firestore:', error);
    throw error;
  }
}

export async function deleteDiagnosticFromCloud(uid: string, diagId: string): Promise<void> {
  if (!uid || !diagId) return;
  try {
    const diagRef = getUserDocRef(uid, 'diagnostics', diagId);
    await deleteDoc(diagRef);
  } catch (error) {
    console.error('[DataService] Failed to delete diagnostic from Firestore:', error);
    throw error;
  }
}

export function subscribeToUserDiagnostics(
  uid: string,
  onData: (diagnostics: HealthDiagnostic[]) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const diagRef = getUserSubcollectionRef(uid, 'diagnostics');
    return onSnapshot(
      diagRef,
      (snapshot) => {
        const diags: HealthDiagnostic[] = [];
        snapshot.forEach((docSnap) => {
          diags.push(docSnap.data() as HealthDiagnostic);
        });
        onData(diags);
      },
      (error) => {
        console.error('[DataService] Error subscribing to diagnostics:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish diagnostics snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// AIR BASELINE REPOSITORY
// --------------------------------------------------------------------------
export async function saveAirBaselineToCloud(uid: string, baseline: AirQualityBaseline): Promise<void> {
  if (!uid || !baseline.id) return;
  try {
    const baselineRef = getUserDocRef(uid, 'air_baselines', baseline.id);
    await setDoc(baselineRef, {
      ...baseline,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save air baseline to Firestore:', error);
    throw error;
  }
}

export function subscribeToUserAirBaseline(
  uid: string,
  onData: (baseline: AirQualityBaseline | null) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const baselinesRef = getUserSubcollectionRef(uid, 'air_baselines');
    return onSnapshot(
      baselinesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0].data() as AirQualityBaseline;
          onData(firstDoc);
        } else {
          onData(null);
        }
      },
      (error) => {
        console.error('[DataService] Error subscribing to air baseline:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish air baseline snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// POINTS TRANSACTIONS REPOSITORY
// --------------------------------------------------------------------------
export async function savePointTransactionToCloud(uid: string, tx: PointTransaction): Promise<void> {
  if (!uid || !tx.id) return;
  try {
    const txRef = getUserDocRef(uid, 'points_transactions', tx.id);
    await setDoc(txRef, {
      ...tx,
      userId: uid,
      recordedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save point transaction to Firestore:', error);
    throw error;
  }
}

export function subscribeToUserPointsTransactions(
  uid: string,
  onData: (transactions: PointTransaction[]) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const txRef = getUserSubcollectionRef(uid, 'points_transactions');
    return onSnapshot(
      txRef,
      (snapshot) => {
        const list: PointTransaction[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PointTransaction);
        });
        onData(list);
      },
      (error) => {
        console.error('[DataService] Error subscribing to points transactions:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish points transactions snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// REWARD REDEMPTIONS REPOSITORY
// --------------------------------------------------------------------------
export async function saveRewardRedemptionToCloud(uid: string, reward: RewardItem): Promise<void> {
  if (!uid || !reward.id) return;
  try {
    const rewardRef = getUserDocRef(uid, 'reward_redemptions', reward.id);
    await setDoc(rewardRef, {
      rewardId: reward.id,
      title: reward.title,
      category: reward.category,
      pointsCost: reward.pointsCost,
      isRedeemed: true,
      redeemedAt: reward.redeemedAt || new Date().toISOString(),
      userId: uid,
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save reward redemption to Firestore:', error);
    throw error;
  }
}

export function subscribeToUserRewardRedemptions(
  uid: string,
  onData: (redemptions: Record<string, boolean>) => void
): Unsubscribe | null {
  if (!uid) return null;
  try {
    const rewardsRef = getUserSubcollectionRef(uid, 'reward_redemptions');
    return onSnapshot(
      rewardsRef,
      (snapshot) => {
        const redeemedMap: Record<string, boolean> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.rewardId) {
            redeemedMap[data.rewardId] = true;
          }
        });
        onData(redeemedMap);
      },
      (error) => {
        console.error('[DataService] Error subscribing to reward redemptions:', error);
      }
    );
  } catch (err) {
    console.error('[DataService] Could not establish rewards snapshot:', err);
    return null;
  }
}

// --------------------------------------------------------------------------
// SUSTAINABILITY & PLANT PREFERENCES REPOSITORY (BUG-15)
// --------------------------------------------------------------------------
export async function savePreferencesToCloud(
  uid: string,
  prefs: UserSustainabilityPreferences
): Promise<void> {
  if (!uid) return;
  try {
    const prefsRef = getUserDocRef(uid, 'preferences', 'sustainability');
    await setDoc(prefsRef, {
      ...prefs,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save preferences to Firestore:', error);
    throw error;
  }
}

export async function loadPreferencesFromCloud(
  uid: string
): Promise<UserSustainabilityPreferences | null> {
  if (!uid) return null;
  try {
    const prefsRef = getUserDocRef(uid, 'preferences', 'sustainability');
    const snap = await getDoc(prefsRef);
    if (snap.exists()) {
      return snap.data() as UserSustainabilityPreferences;
    }
  } catch (error) {
    console.error('[DataService] Failed to load preferences from Firestore:', error);
  }
  return null;
}

export async function savePlantPreferencesToCloud(
  uid: string,
  prefs: UserPlantPreferences
): Promise<void> {
  if (!uid) return;
  try {
    const prefsRef = getUserDocRef(uid, 'preferences', 'plant');
    await setDoc(prefsRef, {
      ...prefs,
      userId: uid,
      updatedAt: new Date().toISOString(),
      dataSource: 'cloud',
    }, { merge: true });
  } catch (error) {
    console.error('[DataService] Failed to save plant preferences to Firestore:', error);
    throw error;
  }
}

export async function loadPlantPreferencesFromCloud(
  uid: string
): Promise<UserPlantPreferences | null> {
  if (!uid) return null;
  try {
    const prefsRef = getUserDocRef(uid, 'preferences', 'plant');
    const snap = await getDoc(prefsRef);
    if (snap.exists()) {
      return snap.data() as UserPlantPreferences;
    }
  } catch (error) {
    console.error('[DataService] Failed to load plant preferences from Firestore:', error);
  }
  return null;
}
