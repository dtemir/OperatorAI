require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const WebSocket = require('ws');
const WaveFile = require('wavefile').WaveFile;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const { initCallData, updateTranscript, updateOnDisconnect } = require('./src/firebase');
const { analyzePriority } = require('./src/utils');

let chunks = [];
let callerMap = {}; //[msg.streamSid] = msg.callSid;
let assemblyAIWSMap = {}; //[msg.callSid]: assemblyAIWSConnection

wss.on('connection', (ws) => {
  console.info('New Connection Initiated');

  ws.on('message', async (message) => {
    const msg = JSON.parse(message);
    const callSid = msg.start?.callSid ?? callerMap[msg.streamSid];

    const assembly = assemblyAIWSMap[callSid]
    // if (!assembly) return console.error("AssemblyAI's WebSocket must be initialized.");

    switch (msg.event) {
      case 'connected':
        console.info('A new call has been connected.');
        break;

      case 'start':
        console.info('Starting media stream...');
        console.info(`callSid: ${msg.start.callSid}`);

        callerMap[msg.streamSid] = msg.start.callSid;

        const texts = {};

        assembly.onmessage = (assemblyMsg) => {
          let transcript = '';
          const res = JSON.parse(assemblyMsg.data);
          texts[res.audio_start] = res.text;
          const keys = Object.keys(texts);
          keys.sort((a, b) => a - b);
          for (const key of keys) {
            if (texts[key]) {
              transcript += ` ${texts[key]}`;
            }
          }

          const priority = analyzePriority(transcript);
          updateTranscript(callSid, msg.streamSid, transcript, priority);
        };
        break;

      case 'media':
        const twilioData = msg.media.payload;

        // Here are the current options explored using the WaveFile lib:

        // We build the wav file from scratch since it comes in as raw data
        let wav = new WaveFile();

        // Twilio uses MuLaw so we have to encode for that
        wav.fromScratch(1, 8000, '8m', Buffer.from(twilioData, 'base64'));

        // This library has a handy method to decode MuLaw straight to 16-bit PCM
        wav.fromMuLaw();

        // Here we get the raw audio data in base64
        const twilio64Encoded = wav.toDataURI().split('base64,')[1];

        // Create our audio buffer
        const twilioAudioBuffer = Buffer.from(twilio64Encoded, 'base64');

        // We send data starting at byte 44 to remove wav headers so our model sees only audio data
        chunks.push(twilioAudioBuffer.slice(44));

        // We have to chunk data b/c twilio sends audio durations of ~20ms and AAI needs a min of 100ms
        if (chunks.length >= 5) {
          // Here we want to concat our buffer to create one single buffer
          const audioBuffer = Buffer.concat(chunks);

          // Re-encode to base64
          const encodedAudio = audioBuffer.toString('base64');

          // Finally send to assembly and clear chunks
          assembly.send(JSON.stringify({ audio_data: encodedAudio }));
          chunks = [];
        }

        break;

      case 'stop':
        console.info('Call has ended');
        assembly.send(JSON.stringify({ terminate_session: true }));
        updateOnDisconnect(callerMap[msg.streamSid]);
        setTimeout(() => {
          assembly.close()
          delete assemblyAIWSMap[callSid]
        }, 100); // time?
        break;
    }
  });
});

app.get('/', (_, res) => res.send('Twilio Live Stream App'));

app.post('/', async (req, res) => {
  const callSid = req.body.CallSid;

  console.log('Webhook received');

  assemblyAIWSMap[callSid] = new WebSocket('wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000', {
    headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
  });
  assemblyAIWSMap[callSid].onerror = console.error;

  initCallData(callSid, req.body);

  res.set('Content-Type', 'text/xml');
  res.send(
    `<Response>
       <Start>
         <Stream url='wss://${req.headers.host}' />
       </Start>
       <Say>
         San Francisco nine one one. What is your emergency?
       </Say>
       <Pause length='6' />
       <Say>
         What's the address of your emergency?
       </Say>
       <Pause length='8' />
       <Say>
         We will send someone as soon as we can! Please stay on the line.
       </Say>
       <Pause length='60' />
     </Response>`
  );
});

server.listen(8080, () => console.log('Listening on Port 8080'));

const exitHandler = (exitCode = 0) =>
  function () {
    console.log('Gracefully terminating assemblyai connection', arguments);

    for (const assembly of Object.values(assemblyAIWSMap)){
      if (assembly) {
        assembly.send(JSON.stringify({ terminate_session: true }));
        assembly.close();
      }
    }
    process.exit(exitCode);
  };

process.on('uncaughtException', exitHandler(1));
process.on('unhandledRejection', exitHandler(1));
process.on('SIGTERM', exitHandler(0));
process.on('SIGINT', exitHandler(0));
