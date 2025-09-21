const express = require('express');
const router = express.Router();
const employeeCtrl = require('../Controller/EmployeeController');

router.post('/LoginEmail', employeeCtrl.loginEmail);
router.post('/ValidateAccessCode', employeeCtrl.validateAccessCode);

const { createDemoEmployee } = require("../services/EmployeeService");

// Endpoint: POST /api/employees/demo
router.post("/demo", async (req, res) => {
  const result = await createDemoEmployee();
  res.json(result);
});

module.exports = router;
