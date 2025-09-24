const db = require('./ServiceFirebase'); // file bạn vừa viết
const employee = require('../Model/Employee');

// Method demo: tạo 1 employee trong Firebase
async function createDemoEmployee() {
  try {
    const ref = db.ref("employees"); // root path: /employees
    const newEmployeeRef = ref.push(); // Firebase sẽ tự tạo key duy nhất

    const demoEmployee = new employee(
        newEmployeeRef.key,
      "Demo Employee",
      "Developer",
      "alice@example.com",
      "IT"
    );

    await newEmployeeRef.set(demoEmployee);

    console.log("✅ Demo employee created with ID:", newEmployeeRef.key);
    return { success: true, id: newEmployeeRef.key, ...demoEmployee };
  } catch (error) {
    console.error("❌ Error creating demo employee:", error);
    return { success: false, error: error.message };
  }
}

// Method lấy tất cả employees
async function getAllEmployees() {
  try {
    const snapshot = await db.ref("employees").once("value"); // Lấy dữ liệu từ Firebase
    return snapshot.val() || {}; // Trả về dữ liệu hoặc object rỗng nếu không có dữ liệu
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
}

module.exports = { createDemoEmployee, getAllEmployees };
