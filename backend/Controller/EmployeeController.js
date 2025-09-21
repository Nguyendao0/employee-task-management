const db = require('../services/ServiceFirebase');

// Hàm random code 6 chữ số
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// (POST) LoginEmail
exports.loginEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = generateCode();
  await db.ref(`employeeAccess/${email.replace('.', '_')}`).set({ code });

  // TODO: gửi code qua email (có thể dùng nodemailer hoặc dịch vụ SMTP)
  console.log(`Access code sent to ${email}: ${code}`);

  res.json({ accessCode: code });
};

// (POST) ValidateAccessCode
exports.validateAccessCode = async (req, res) => {
  const { accessCode, email } = req.body;
  const snapshot = await db.ref(`employeeAccess/${email.replace('.', '_')}`).once('value');
  const data = snapshot.val();

  if (data && data.code === accessCode) {
    await db.ref(`employeeAccess/${email.replace('.', '_')}`).update({ code: "" });
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: "Invalid code" });
};
