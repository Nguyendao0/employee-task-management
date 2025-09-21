// Import các thư viện cần thiết bằng CommonJS
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

// Import các route
// const ownerRoutes = require('./Routers/OwnerRouters');
const employeeRoutes = require('./Routers/EmployeeRouter');
const { createDemoEmployee } = require("./services/EmployeeService");


// Load biến môi trường từ .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Đăng ký các route
// app.use('/api/owner', ownerRoutes);
app.use('/api/employee', employeeRoutes);

// Lấy PORT từ biến môi trường hoặc dùng mặc định là 5000
const PORT = process.env.PORTSV || 5000;

// Lắng nghe server
// Khi server start thì chạy demo
app.listen(PORT, async () => {
  console.log(` Server running on http://localhost:${PORT}`);

  try {
    const result = await createDemoEmployee();
    console.log(" Demo employee created:", result);
  } catch (err) {
    console.error(" Error creating demo employee:", err.message);
  }
});
