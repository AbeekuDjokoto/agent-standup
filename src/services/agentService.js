import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

const AGENTS_COLLECTION = 'Agents'

export async function postAgentRecord(payload) {
  const documentRef = await addDoc(collection(db, AGENTS_COLLECTION), payload)
  return { id: documentRef.id, ...payload }
}
