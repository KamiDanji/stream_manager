import { initializeApp, credential, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
// You will need to provide the service account credentials via environment variables
// in a production environment. For local development, this will use default credentials
// if set, or you can supply a service account key file.

try {
  if (getApps().length === 0) {
    initializeApp({
      credential: credential.applicationDefault(),
      projectId: 'demo-project', // Fallback for local testing
    });
  }
} catch (error: any) {
  console.error('Firebase admin initialization error', error.stack);
}

export const adminAuth = getAuth();
export const db = getFirestore();
