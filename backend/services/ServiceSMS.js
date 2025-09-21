require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_MESSAGING_SERVICE_SID,
  TWILIO_FROM,
  PORT
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.warn('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in env');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Simple file-backed store for codes
const DATA_FILE = path.join(__dirname, 'codes.json');
let codesStore = {};

// load existing
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    codesStore = raw ? JSON.parse(raw) : {};
  }
} catch (err) {
  console.error('Failed to load codes.json', err);
  codesStore = {};
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(codesStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write codes.json', err);
  }
}

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// POST /api/send-code { to }
app.post('/api/send-code', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: 'Missing "to" phone number' });

  const code = genCode();
  console.log(`Generated code for ${to}: ${code}`);
  const expiresAt = Date.now() + 1000; // 1 second

  // save to store
  codesStore[to] = { code, expiresAt };
  saveStore();

  // send SMS
  try {
    const opts = {
      to,
      body: `Your verification code: ${code}`
    };
    if (TWILIO_MESSAGING_SERVICE_SID) opts.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
    else if (TWILIO_FROM) opts.from = TWILIO_FROM;
    else return res.status(500).json({ error: 'No TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM configured' });

    const message = await client.messages.create(opts);
    return res.json({ sid: message.sid, status: message.status });
  } catch (err) {
    console.error('Twilio send error', err);
    return res.status(500).json({ error: err.message || 'Failed to send SMS' });
  }
});

// POST /api/verify-code { to, code }
app.post('/api/verify-code', (req, res) => {
  const { to, code } = req.body;
  if (!to || !code) return res.status(400).json({ error: 'Missing "to" or "code"' });

  const record = codesStore[to];
  if (!record) return res.status(400).json({ success: false, error: 'No code found for this number' });

  if (Date.now() > record.expiresAt) {
    delete codesStore[to];
    saveStore();
    return res.status(400).json({ success: false, error: 'Code expired' });
  }

  if (String(record.code) !== String(code)) {
    return res.status(400).json({ success: false, error: 'Invalid code' });
  }

  // success — remove code after verify
  delete codesStore[to];
  saveStore();
  return res.json({ success: true });
});

const port = 4001;
app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
