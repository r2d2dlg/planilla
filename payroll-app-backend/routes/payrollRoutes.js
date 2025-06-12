// payroll-app-backend/routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// --- NUEVA RUTA ---
// Ruta para obtener los detalles de una planilla específica. Debe ir ANTES de las otras rutas con parámetros.
router.get('/payrolls/:id', payrollController.getPayrollDetails);


// --- Rutas Existentes ---
router.post('/employees', payrollController.createEmployee);
router.get('/employees', payrollController.getAllEmployees);
router.post('/contracts', payrollController.createContract);
router.post('/process-full-payroll', payrollController.processFullPayroll);
router.get('/payrolls', payrollController.getPayrollHistory);
// ... y todas las demás ...

module.exports = router;
