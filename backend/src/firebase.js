const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set, update } = require('firebase/database');

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

// To just create a new ID
const uid = () => push(ref(db, '/calls')).key;

module.exports.initCallData = (callSid, payload) => {
  if (!callSid) {
    return
  }

  return set(
    ref(db, `/calls/${callSid}`),
    // TODO: feed in data
    {
      dateCreated: new Date().toISOString(),
      emergency: 'EMERGENCY',
      geocode: {
        lat: 37.7623985,
        lng: -122.465668,
      },
      live: true,
      location: '//TODO 320 Judah St',
      name: payload.CallerName ?? 'UNKNOWN CALLER',
      phone: payload.From ?? 'UNKNOWN NUMBER',
      priority: 1,
      status: 'OPEN', // 'OPEN' | 'DISPATCHED' | 'RESOLVED'
      transcript: '',
    }
  );
};

module.exports.updateOnDisconnect = (callSid) => {
  if (!callSid) {
    return;
  }

  const updates = {
    live: false,
    dateDisconnected: new Date().toISOString()
  }

  return update(ref(db, `/calls/${callSid}`), updates);
}

module.exports.updateTranscript = (callSid, msg) => {
  if (!callSid) {
    return;
  }

  return set(ref(db, `/calls/${callSid}/transcript`), msg);
};
