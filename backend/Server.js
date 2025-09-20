const axios = require('axios');
const jwt = require('jsonwebtoken');
const serviceAccount = require('../serviceAccountKey.json'); // Đường dẫn đến file JSON của bạn
require('dotenv').config(); // Load biến môi trường từ .env


// Thay thế với URL Realtime Database của bạn
// Ví dụ: https://employee-task-management-f7802-default-rtdb.firebaseio.com
const DATABASE_URL = process.env.FIREBASE_DB_URL;

// Hàm tạo JWT token để xác thực
function createAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now,
    exp: now + 3600, // Token có hiệu lực trong 1 giờ (3600 giây)
    uid: 'my-service-account-id', // ID duy nhất cho service account của bạn
    claims: {
      admin: true // Đặt quyền admin nếu cần (thay đổi trong Security Rules)
    }
  };
  return jwt.sign(payload, serviceAccount.private_key, { algorithm: 'RS256' });
}

async function fetchData(path) {
  try {
    const authToken = createAuthToken();
    const url = `${DATABASE_URL}${path}.json?auth=${authToken}`;
    const response = await axios.get(url);
    console.log(`Dữ liệu từ ${path}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu từ ${path}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function writeData(path, data) {
  try {
    const authToken = createAuthToken();
    const url = `${DATABASE_URL}${path}.json?auth=${authToken}`;
    const response = await axios.put(url, data); // PUT sẽ ghi đè toàn bộ dữ liệu tại path
    console.log(`Dữ liệu đã ghi thành công vào ${path}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi ghi dữ liệu vào ${path}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function updateData(path, data) {
  try {
    const authToken = createAuthToken();
    const url = `${DATABASE_URL}${path}.json?auth=${authToken}`;
    const response = await axios.patch(url, data); // PATCH sẽ cập nhật từng phần dữ liệu tại path
    console.log(`Dữ liệu đã cập nhật thành công tại ${path}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật dữ liệu tại ${path}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

// --- Ví dụ sử dụng ---
async function runExamples() {
  // Ghi dữ liệu vào đường dẫn /tasks/task1
  await writeData('/tasks/task1', {
    title: 'Code review',
    description: 'Review pull request #123',
    assignedTo: 'Alice',
    status: 'pending'
  });

  // Đọc dữ liệu từ /tasks
  await fetchData('/tasks');

  // Cập nhật trạng thái của task1
  await updateData('/tasks/task1', { status: 'completed' });

  // Đọc lại dữ liệu của task1 sau khi cập nhật
  await fetchData('/tasks/task1');
}

runExamples();
