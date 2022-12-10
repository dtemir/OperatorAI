const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, update, get } = require('firebase/database');
const { getCoordinates, analyzeTranscript } = require('./utils');

const app = initializeApp({
  apiKey: 'AIzaSyCvco7fC8XnCjXGir_bY_QKXVrn7qdZglU',
  authDomain: 'assemblyai-hackathon.firebaseapp.com',
  databaseURL: 'https://assemblyai-hackathon-default-rtdb.firebaseio.com',
  projectId: 'assemblyai-hackathon',
  storageBucket: 'assemblyai-hackathon.appspot.com',
  messagingSenderId: '675472088767',
  appId: '1:675472088767:web:07f34df7eb2a635ebb300a',
});

const db = getDatabase(app);

module.exports.initCallData = (callSid, payload) => {
  if (!callSid) {
    return;
  }

  return set(ref(db, `/calls/${callSid}`), {
    dateCreated: new Date().toISOString(),
    emergency: 'EMERGENCY',
    // geocode: undefined,
    // location: undefined,
    live: true,
    name: payload.CallerName ?? 'UNKNOWN CALLER',
    phone: payload.From ?? 'UNKNOWN NUMBER',
    priority: 'TBD', // HIGH | MEDIUM | LOW | TBD
    status: 'OPEN', // 'OPEN' | 'DISPATCHED' | 'RESOLVED'
    transcript: '',
  });
};

module.exports.updateOnDisconnect = async (callSid) => {
  if (!callSid) {
    return;
  }

  const updates = {
    live: false,
    dateDisconnected: new Date().toISOString(),
  };

  const snapshot = await get(ref(db, `/calls/${callSid}/transcript`));

  if (snapshot.exists()) {
    const transcript = snapshot.val();
    console.log('Final transcript: ', transcript);

    const data = (await analyzeTranscript(transcript)) ?? [];
    const sorted = data.sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA);

    const location = sorted.find(({ entity_group }) => entity_group === 'LOC')?.word;
    const name = sorted.find(({ entity_group }) => entity_group === 'PER')?.word;

    if (location) {
      console.log('Found location', location);
      updates.location = location;

      const coordinates = await getCoordinates(location);
      if (coordinates.lat && coordinates.lng) {
        updates.geocode = coordinates;
      }
    }

    // override because the caller has announced their name which is more accurate
    if (name) {
      console.log('Found name', name);
      updates.name = name;
    }
  }

  return update(ref(db, `/calls/${callSid}`), updates);
};

module.exports.updateTranscript = (callSid, transcript, priority) => {
  if (!callSid) {
    return;
  }

  return update(ref(db, `/calls/${callSid}`), {
    transcript,
    priority,
  });
};
