const express = require('express');
const router = express.Router();
const ownerCtrl = require('../controllers/ownerController');

router.post('/CreateNewAccessCode', ownerCtrl.createNewAccessCode);
router.post('/ValidateAccessCode', ownerCtrl.validateAccessCode);
router.post('/GetEmployee', ownerCtrl.getEmployee);
router.post('/CreateEmployee', ownerCtrl.createEmployee);
router.post('/DeleteEmployee', ownerCtrl.deleteEmployee);

module.exports = router;
