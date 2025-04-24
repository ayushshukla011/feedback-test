import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as authSignOut,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  DocumentData,
  DocumentReference,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject
} from 'firebase/storage';
import { auth, db, storage } from '../firebase';

// Auth functions
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const signOut = async (): Promise<void> => {
  return await authSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Firestore functions
export const addDocument = async (collectionName: string, data: DocumentData): Promise<DocumentReference> => {
  try {
    console.log(`Adding document to collection: ${collectionName}`);
    const collectionRef = collection(db, collectionName);
    console.log('Collection reference created');
    
    const result = await addDoc(collectionRef, data);
    console.log(`Document added successfully with ID: ${result.id}`);
    
    return result;
  } catch (error) {
    console.error('Error in addDocument function:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

export const setDocument = async (collectionName: string, docId: string, data: DocumentData): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return await setDoc(docRef, data);
};

export const getDocuments = async (collectionName: string): Promise<Array<DocumentData & { id: string }>> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocumentById = async (collectionName: string, docId: string): Promise<(DocumentData & { id: string }) | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: DocumentData): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

export const queryDocuments = async (
  collectionName: string, 
  fieldPath: string, 
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=', 
  value: any
): Promise<Array<DocumentData & { id: string }>> => {
  const q = query(collection(db, collectionName), where(fieldPath, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Storage functions
export const uploadFile = async (path: string, file: File): Promise<string> => {
  const storageRef = ref(storage, path);
  const result = await uploadBytes(storageRef, file);
  return await getDownloadURL(result.ref);
};

export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  return await deleteObject(storageRef);
}; 