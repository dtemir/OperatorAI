const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');

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

module.exports.initCallData = async () => {
  const key = uid();

  await set(
    ref(db, '/calls'),
    // TODO: feed in data
    {
      created: new Date().toISOString(),
      emergency: 'EMERGENCY',
      geocode: {
        lat: 31,
        lng: -122,
      },
      live: true,
      location: 'LOCATION',
      name: 'NAME',
      phone: 'PHONE',
      priority: 1,
      status: 'STATUS',
      transcript: '',
    }
  );

  return key;
};

module.exports.updateTranscript = (key, msg) => {
  if (!key) {
    return;
  }

  return set(ref(db, `/calls/${key}/transcript`), msg);
};
