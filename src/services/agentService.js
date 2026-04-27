import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const AGENTS_COLLECTION = 'Agents'

export async function postAgentRecord(payload) {
  const documentRef = await addDoc(collection(db, AGENTS_COLLECTION), payload)
  return { id: documentRef.id, ...payload }
}

export async function fetchAgentRecords(agentUid) {
  if (!agentUid) return []

  const recordsQuery = query(
    collection(db, AGENTS_COLLECTION),
    where('agentUid', '==', agentUid),
    orderBy('createdAt', 'desc'),
  )

  const querySnapshot = await getDocs(recordsQuery)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
