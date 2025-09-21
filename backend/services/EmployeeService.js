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

module.exports = { createDemoEmployee };
