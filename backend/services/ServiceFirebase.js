const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('../../serviceAccountKey.json');

dotenv.config();

try {
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error.message);
}

const db = admin.database();
module.exports = db;