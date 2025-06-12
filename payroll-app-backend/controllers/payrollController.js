// payroll-app-backend/controllers/payrollController.js
const payrollService = require('../services/payrollService');

exports.getPayrollHistory = async (req, res, next) => {
  try {
    const history = await payrollService.getPayrollHistory(req.db);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

exports.getPayrollDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'ID de planilla inválido.' });
    }
    const details = await payrollService.getPayrollDetails(req.db, parseInt(id));
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const { nombres, apellidos, cedula } = req.body;
    if (!nombres || !apellidos || !cedula) {
      return res.status(400).json({ message: 'Nombres, apellidos y cédula son requeridos.' });
    }
    const newEmployee = await payrollService.createEmployee(req.db, req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

exports.createContract = async (req, res, next) => {
  try {
    const { id_empleado, cargo, salario_base, fecha_inicio } = req.body;
    if (!id_empleado || !cargo || !salario_base || !fecha_inicio) {
      return res.status(400).json({ message: 'Todos los campos del contrato son requeridos.' });
    }
    const newContract = await payrollService.createContract(req.db, req.body);
    res.status(201).json(newContract);
  } catch (error) {
    next(error);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await payrollService.getAllEmployees(req.db);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

exports.calculateBasicDeductionsForContract = async (req, res, next) => {
  try {
    const { contractId } = req.params;
    if (!contractId || isNaN(parseInt(contractId))) {
      return res.status(400).json({ message: 'ID de contrato inválido.' });
    }
    const result = await payrollService.calculateBasicDeductions(req.db, parseInt(contractId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.calculateCSSForEmployee = async (req, res, next) => {
  try {
    const { contractId, salarioBrutoPeriodo, tipoIngreso, fechaCalculo } = req.body;
    const result = await payrollService.calculateCSS(req.db, parseInt(contractId), parseFloat(salarioBrutoPeriodo), tipoIngreso.toUpperCase(), new Date(fechaCalculo || Date.now()));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.calculateISRForEmployee = async (req, res, next) => {
    try {
        const { contractId, salarioBrutoMensualRegular } = req.body;
        const result = await payrollService.calculateISR(req.db, parseInt(contractId), parseFloat(salarioBrutoMensualRegular));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.calculateDecimo = async (req, res, next) => {
    try {
        const { contractId, partida, anio } = req.body;
        const result = await payrollService.calculateDecimoTercerMes(req.db, parseInt(contractId), partida, parseInt(anio));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.calculateVacationPayout = async (req, res, next) => {
    try {
        const { contractId, diasVacacionesSolicitados, fechaReferencia } = req.body;
        const result = await payrollService.calculateVacaciones(req.db, parseInt(contractId), parseFloat(diasVacacionesSolicitados), new Date(fechaReferencia || Date.now()));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.calculatePrimaAntiguedad = async (req, res, next) => {
    try {
        const { contractId, fechaTerminacion } = req.body;
        const result = await payrollService.calculatePrimaAntiguedad(req.db, parseInt(contractId), new Date(fechaTerminacion));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.calculateIndemnizacion = async (req, res, next) => {
    try {
        const { contractId, causaTerminacion, fechaTerminacion } = req.body;
        const result = await payrollService.calculateIndemnizacion(req.db, parseInt(contractId), causaTerminacion, new Date(fechaTerminacion));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.calculateSettlement = async (req, res, next) => {
    try {
        const { contractId, causaTerminacion, fechaTerminacion } = req.body;
        const result = await payrollService.calculateSettlement(req.db, parseInt(contractId), causaTerminacion, new Date(fechaTerminacion));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.processFullPayroll = async (req, res, next) => {
  try {
    const { empresaId, periodoDesde, periodoHasta } = req.body;
    if (!empresaId || !periodoDesde || !periodoHasta) {
      return res.status(400).json({ message: 'Los campos empresaId, periodoDesde y periodoHasta son requeridos.' });
    }
    const result = await payrollService.processFullPayroll(
      req.db,
      parseInt(empresaId),
      new Date(periodoDesde),
      new Date(periodoHasta)
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
