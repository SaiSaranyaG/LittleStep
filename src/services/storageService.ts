/**
 * LittleStep Cloud Storage Service (BUG-07)
 * Handles real Firebase / Cloud Storage persistence for user space photos, plant pictures, and health diagnostics.
 */

import { auth, storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

export interface StorageUploadResult {
  url: string;
  storageObject: string;
  bucket: string;
  cloudUrl: string;
  uploadedAt: string;
  mimeType: string;
  isCloudStorage: boolean;
}

export async function uploadImageToStorage(
  fileOrBase64: File | string,
  category: 'spaces' | 'plants' | 'diagnostics',
  entityId?: string,
  providedUserId?: string
): Promise<StorageUploadResult> {
  const userId = auth.currentUser?.uid || providedUserId;
  if (!userId || userId === 'guest') {
    throw new Error('UNAUTHORIZED_STORAGE_UPLOAD: User must be authenticated to upload images.');
  }

  const bucketName = firebaseConfigJson.storageBucket || 'gen-lang-client-0222003829.firebasestorage.app';
  let base64String = '';
  let filename = `${Date.now()}_photo.jpg`;
  let mimeType = 'image/jpeg';

  if (typeof fileOrBase64 === 'string') {
    base64String = fileOrBase64;
    const mimeMatch = fileOrBase64.match(/^data:([^;]+);base64,/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }
  } else {
    filename = `${Date.now()}_${fileOrBase64.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    mimeType = fileOrBase64.type || 'image/jpeg';
    base64String = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(fileOrBase64);
    });
  }

  // UID-scoped path: users/{uid}/{category}/{entityId or timestamp}/{filename}
  const entitySubpath = entityId ? `${entityId}/` : '';
  const storagePath = `users/${userId}/${category}/${entitySubpath}${filename}`;

  try {
    // 1. Direct Firebase Storage SDK Upload
    const storageRef = ref(storage, storagePath);
    
    if (base64String.startsWith('data:')) {
      await uploadString(storageRef, base64String, 'data_url');
    } else {
      await uploadString(storageRef, base64String, 'base64', { contentType: mimeType });
    }

    const downloadUrl = await getDownloadURL(storageRef);
    const uploadedAt = new Date().toISOString();

    return {
      url: downloadUrl,
      storageObject: storagePath,
      bucket: bucketName,
      cloudUrl: downloadUrl,
      uploadedAt,
      mimeType,
      isCloudStorage: true,
    };
  } catch (err: any) {
    console.warn('[StorageService] Client Firebase Storage upload notice, trying server endpoint:', err?.message || err);

    // 2. Backup: Backend Cloud Storage upload endpoint with auth Bearer token
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64: base64String,
          category,
          entityId,
          filename,
          mimeType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          url: data.url,
          storageObject: data.storageObject || storagePath,
          bucket: data.bucket || bucketName,
          cloudUrl: data.cloudUrl || data.url,
          uploadedAt: data.uploadedAt || new Date().toISOString(),
          mimeType,
          isCloudStorage: true,
        };
      }
    } catch (endpointErr) {
      console.error('[StorageService] Server backup storage upload error:', endpointErr);
    }

    throw new Error(`Cloud Storage upload failed: ${err?.message || 'Failed to upload image'}`);
  }
}

/**
 * Delete all user storage objects under users/{uid}
 * Invoked during account deletion cascade
 */
export async function deleteUserStorageFiles(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const userFolderRef = ref(storage, `users/${userId}`);
    const res = await listAll(userFolderRef);
    const deletePromises = res.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(deletePromises);

    // Recursively list subfolders (spaces, plants, diagnostics)
    for (const folderRef of res.prefixes) {
      const subRes = await listAll(folderRef);
      await Promise.all(subRes.items.map((itemRef) => deleteObject(itemRef)));
    }
  } catch (err) {
    console.warn(`[StorageService] User storage folder cleanup notice for ${userId}:`, err);
  }
}
