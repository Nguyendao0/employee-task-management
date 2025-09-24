const express = require('express');
const router = express.Router();
const employeeCtrl = require('../Controller/EmployeeController');
const { createDemoEmployee } = require("../services/EmployeeService");
const { getAllEmployees } = require("../services/EmployeeService");

router.post('/LoginEmail', employeeCtrl.loginEmail);
router.post('/ValidateAccessCode', employeeCtrl.validateAccessCode);




// Endpoint: POST /api/employees/demo
// router.post("/demo", async (req, res) => {
//   const result = await createDemoEmployee();
//   res.json(result);
// });

// GET /api/employees
router.get("/", async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
