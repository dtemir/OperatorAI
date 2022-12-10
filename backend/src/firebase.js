const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push } = require('firebase/database');

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

const _ref = ref(db, '/calls');

// To just create a new ID
const key = () => push(_ref).key;

module.exports.createCallData = () => {
  return push(_ref, {
    foo: 'bar',
  });
};
