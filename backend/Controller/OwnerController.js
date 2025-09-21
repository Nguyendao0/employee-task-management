const db = require('../config/firebase');

// Tạo mã ngẫu nhiên 6 chữ số
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// (POST) CreateNewAccessCode
exports.createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: "phoneNumber required" });

  const code = generateCode();
  await db.ref(`owners/${phoneNumber}`).set({ accessCode: code });

  res.json({ accessCode: code });
};

// (POST) ValidateAccessCode
exports.validateAccessCode = async (req, res) => {
  const { accessCode, phoneNumber } = req.body;
  const snapshot = await db.ref(`owners/${phoneNumber}`).once('value');
  const data = snapshot.val();

  if (data && data.accessCode === accessCode) {
    await db.ref(`owners/${phoneNumber}`).update({ accessCode: "" });
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: "Invalid code" });
};

// (POST) GetEmployee
exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const snapshot = await db.ref(`employees/${employeeId}`).once('value');
  const employee = snapshot.val();

  if (employee) return res.json(employee);
  res.status(404).json({ error: "Employee not found" });
};

// (POST) CreateEmployee
exports.createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email || !department) return res.status(400).json({ error: "Missing fields" });

  const newRef = db.ref('employees').push();
  const employeeId = newRef.key;
  await newRef.set({ name, email, department });

  res.json({ success: true, employeeId });
};

// (POST) DeleteEmployee
exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.body;
  await db.ref(`employees/${employeeId}`).remove();
  res.json({ success: true });
};
