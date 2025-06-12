// payroll-app-backend/services/payrollService.js

// --- SERVICIOS ACTUALIZADOS CON LOGS ---
exports.getAllEmployees = async (db) => {
  console.log("  --> [Service] Ejecutando getAllEmployees");
  const query = `
    SELECT id_empleado, codigo_empleado, nombres, apellidos, cedula, nss, activo
    FROM empleados
    ORDER BY apellidos, nombres;
  `;
  try {
    console.log("    -- [Service] A punto de ejecutar la consulta de empleados...");
    const { rows } = await db.query(query);
    console.log("    -- [Service] Consulta de empleados ejecutada. Filas encontradas:", rows.length);
    return rows;
  } catch (error) {
    console.error("    !!! [Service] Error al ejecutar la consulta de empleados:", error);
    throw error;
  }
};

exports.getPayrollHistory = async (db) => {
  console.log("  --> [Service] Ejecutando getPayrollHistory");
  const query = `
    SELECT id_planilla, fecha_pago, periodo_planilla_desde, periodo_planilla_hasta, 
           total_ingresos, total_deducciones, neto_a_pagar, estado_planilla 
    FROM planillas
    ORDER BY fecha_pago DESC, id_planilla DESC;
  `;
  try {
    console.log("    -- [Service] A punto de ejecutar la consulta de historial...");
    const { rows } = await db.query(query);
    console.log("    -- [Service] Consulta de historial ejecutada. Filas encontradas:", rows.length);
    return rows;
  } catch (error) {
    console.error("    !!! [Service] Error al obtener historial de planillas:", error);
    throw error;
  }
};


// --- Funciones Existentes (Omitidas por brevedad) ---
async function getParametroLegal(db, nombreParametro, fechaReferencia) { /* ... */ }
exports.createEmployee = async (db, employeeData) => { /* ... */ };
exports.createContract = async (db, contractData) => { /* ... */ };
exports.processFullPayroll = async (db, empresaId, periodoDesde, periodoHasta) => { /* ... */ };
// ... y todos los demás cálculos ...
