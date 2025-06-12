// payroll-app-frontend/src/App.jsx
import React, { useState, useEffect } from 'react';

// --- COMPONENTES REUTILIZABLES Y MODALES ---

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [employeeData, setEmployeeData] = useState({ nombres: '', apellidos: '', cedula: '', nss: '', id_empresa: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleChange = (e) => setEmployeeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('http://localhost:5000/api/payroll/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(employeeData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo agregar el empleado.');
      onEmployeeAdded();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"><h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Empleado</h3><form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label><input type="text" name="nombres" id="nombres" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div><div><label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label><input type="text" name="apellidos" id="apellidos" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div><div><label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label><input type="text" name="cedula" id="cedula" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div><div><label htmlFor="nss" className="block text-sm font-medium text-gray-700">NSS</label><input type="text" name="nss" id="nss" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<div className="mt-8 flex justify-end gap-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar Empleado'}</button></div></form></div></div>);
};

const AddContractModal = ({ isOpen, onClose, onContractAdded, employeeId }) => {
  const [contractData, setContractData] = useState({ id_empleado: employeeId, id_tipo_jornada: 1, tipo_contrato: 'Indefinido', cargo: '', salario_base: '', frecuencia_pago: 'Quincenal', fecha_inicio: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (employeeId) { setContractData(prev => ({ ...prev, id_empleado: employeeId, cargo: '', salario_base: '', fecha_inicio: new Date().toISOString().split('T')[0] })); } }, [employeeId]);
  if (!isOpen) return null;
  const handleChange = (e) => setContractData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('http://localhost:5000/api/payroll/contracts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contractData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo agregar el contrato.');
      onContractAdded();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg"><h3 className="text-2xl font-bold text-gray-800 mb-6">Asignar Contrato a Empleado ID: {employeeId}</h3><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="cargo" className="block text-sm font-medium text-gray-700">Cargo</label><input type="text" name="cargo" id="cargo" value={contractData.cargo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div><div><label htmlFor="salario_base" className="block text-sm font-medium text-gray-700">Salario Base Mensual</label><input type="number" name="salario_base" id="salario_base" step="0.01" value={contractData.salario_base} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div><div><label htmlFor="tipo_contrato" className="block text-sm font-medium text-gray-700">Tipo</label><select name="tipo_contrato" id="tipo_contrato" value={contractData.tipo_contrato} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"><option>Indefinido</option><option>Plazo Fijo</option><option>Obra Determinada</option></select></div><div><label htmlFor="frecuencia_pago" className="block text-sm font-medium text-gray-700">Frec. Pago</label><select name="frecuencia_pago" id="frecuencia_pago" value={contractData.frecuencia_pago} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"><option>Quincenal</option><option>Mensual</option><option>Semanal</option></select></div><div><label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label><input type="date" name="fecha_inicio" id="fecha_inicio" value={contractData.fecha_inicio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div></div>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<div className="mt-8 flex justify-end gap-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar Contrato'}</button></div></form></div></div>);
};

const PayrollDetailModal = ({ isOpen, onClose, payrollId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (isOpen && payrollId) {
      const fetchDetails = async () => {
        setLoading(true); setError(''); setDetails(null);
        try {
          const response = await fetch(`http://localhost:5000/api/payroll/payrolls/${payrollId}`);
          if (!response.ok) throw new Error('No se pudieron cargar los detalles.');
          const data = await response.json();
          setDetails(data);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
      };
      fetchDetails();
    }
  }, [isOpen, payrollId]);
  if (!isOpen) return null;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-PA');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800">Detalle de Planilla #{payrollId}</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button></div>
        {loading && <p>Cargando detalles...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {details && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div><p className="text-sm text-gray-600">Período:</p><p className="font-semibold">{formatDate(details.payrollInfo.periodo_planilla_desde)} - {formatDate(details.payrollInfo.periodo_planilla_hasta)}</p></div>
              <div><p className="text-sm text-gray-600">Total Ingresos:</p><p className="font-semibold">B/. {parseFloat(details.payrollInfo.total_ingresos).toFixed(2)}</p></div>
              <div><p className="text-sm text-gray-600">Total Deducciones:</p><p className="font-semibold">B/. {parseFloat(details.payrollInfo.total_deducciones).toFixed(2)}</p></div>
              <div><p className="text-sm text-gray-600">Neto a Pagar:</p><p className="font-bold text-lg">B/. {parseFloat(details.payrollInfo.neto_a_pagar).toFixed(2)}</p></div>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-200"><tr><th className="text-left py-2 px-3">Empleado</th><th className="text-right py-2 px-3">Ingresos</th><th className="text-right py-2 px-3">Deducciones</th><th className="text-right py-2 px-3">Neto</th></tr></thead>
              <tbody>{details.details.map(item => (<tr key={item.id_empleado} className="border-b"><td className="py-2 px-3">{item.nombres} {item.apellidos}</td><td className="text-right py-2 px-3">B/. {parseFloat(item.total_ingresos).toFixed(2)}</td><td className="text-right py-2 px-3">B/. {parseFloat(item.total_deducciones).toFixed(2)}</td><td className="text-right py-2 px-3 font-semibold">B/. {(parseFloat(item.total_ingresos) - parseFloat(item.total_deducciones)).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeeList = ({ onEmployeeSelect, refreshKey, onAssignContract }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchEmployees = async () => { setLoading(true); setError(''); try { const response = await fetch('http://localhost:5000/api/payroll/employees'); if (!response.ok) throw new Error('No se pudo obtener la lista de empleados.'); const data = await response.json(); setEmployees(data); } catch (err) { setError(err.message); } finally { setLoading(false); } };
    fetchEmployees();
  }, [refreshKey]);
  if (loading) return <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-center"><p className="text-gray-600">Cargando empleados...</p></div>;
  if (error) return <div className="mt-8 bg-red-100 p-6 rounded-lg shadow-md text-center"><p className="text-red-700">Error: {error}</p></div>;
  return (<div className="mt-8 bg-white p-6 rounded-lg shadow-md"><div className="overflow-x-auto"><table className="min-w-full bg-white"><thead className="bg-gray-200"><tr><th className="text-left py-3 px-4">ID</th><th className="text-left py-3 px-4">Nombre Completo</th><th className="text-left py-3 px-4">Cédula</th><th className="text-left py-3 px-4">Estado</th><th className="text-center py-3 px-4">Acciones</th></tr></thead><tbody className="text-gray-700">{employees.length > 0 ? employees.map((employee) => (<tr key={employee.id_empleado} className="border-b hover:bg-blue-50"><td className="py-3 px-4 cursor-pointer" onClick={() => onEmployeeSelect(employee.id_empleado)}>{employee.id_empleado}</td><td className="py-3 px-4 cursor-pointer" onClick={() => onEmployeeSelect(employee.id_empleado)}>{employee.apellidos}, {employee.nombres}</td><td className="py-3 px-4 cursor-pointer" onClick={() => onEmployeeSelect(employee.id_empleado)}>{employee.cedula}</td><td className="py-3 px-4 cursor-pointer" onClick={() => onEmployeeSelect(employee.id_empleado)}><span className={`py-1 px-3 rounded-full text-xs ${employee.activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{employee.activo ? 'Activo' : 'Inactivo'}</span></td><td className="py-3 px-4 text-center"><button onClick={() => onAssignContract(employee.id_empleado)} className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded">Asignar Contrato</button></td></tr>)) : <tr><td colSpan="5" className="text-center py-4">No hay empleados registrados.</td></tr>}</tbody></table></div></div>);
};

const SettlementCalculator = ({ selectedContractId }) => {
  const [formData, setFormData] = useState({ contractId: '', causaTerminacion: 'Despido Injustificado', fechaTerminacion: new Date().toISOString().split('T')[0] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (selectedContractId) { setFormData(prev => ({ ...prev, contractId: selectedContractId, causaTerminacion: 'Despido Injustificado', fechaTerminacion: new Date().toISOString().split('T')[0] })); setResult(null); setError(''); } }, [selectedContractId]);
  const handleChange = (e) => setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); setError(''); setResult(null); try { const response = await fetch('http://localhost:5000/api/payroll/calculate-settlement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Ocurrió un error en el servidor.'); setResult(data); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  const ResultDisplay = ({ data }) => ( <div className="mt-6 bg-green-50 p-6 rounded-lg border border-green-200"> <h4 className="text-xl font-semibold text-green-800 mb-4">Resultado de la Liquidación</h4> <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"> <div><p className="text-sm">Prima:</p><p className="font-medium">B/. {data.detalles.primaAntiguedad.toFixed(2)}</p></div><div><p className="text-sm">Indemnización:</p><p className="font-medium">B/. {data.detalles.indemnizacion.toFixed(2)}</p></div><div><p className="text-sm">Vacaciones ({data.detalles.vacacionesProporcionales.dias.toFixed(2)} días):</p><p className="font-medium">B/. {data.detalles.vacacionesProporcionales.monto.toFixed(2)}</p></div><div><p className="text-sm">Décimo:</p><p className="font-medium">B/. {data.detalles.decimoProporcional.toFixed(2)}</p></div></div><div className="mt-6 pt-4 border-t"><p className="text-lg font-semibold">Total Bruto:</p><p className="text-3xl font-bold">B/. {data.totalLiquidacion.toFixed(2)}</p></div></div> );
  return ( <div className="mt-8 bg-white p-6 rounded-lg shadow-md"> <h3 className="text-2xl font-semibold text-gray-800 mb-4">Calculadora de Liquidación</h3> <form onSubmit={handleSubmit}> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div><label htmlFor="contractId" className="block text-sm font-medium">ID del Contrato</label><input type="number" name="contractId" value={formData.contractId} onChange={handleChange} className="mt-1 block w-full" required /></div><div><label htmlFor="causaTerminacion" className="block text-sm font-medium">Causa</label><select name="causaTerminacion" value={formData.causaTerminacion} onChange={handleChange} className="mt-1 block w-full"><option>Despido Injustificado</option><option>Renuncia Voluntaria</option></select></div><div><label htmlFor="fechaTerminacion" className="block text-sm font-medium">Fecha</label><input type="date" name="fechaTerminacion" value={formData.fechaTerminacion} onChange={handleChange} className="mt-1 block w-full" required /></div></div><div className="mt-6"><button type="submit" disabled={loading || !formData.contractId} className="w-full py-3 px-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"> {loading ? 'Calculando...' : 'Calcular'}</button></div></form> {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>} {result && <ResultDisplay data={result} />} </div> );
};

const PayrollProcessor = () => {
  const [periodo, setPeriodo] = useState({ desde: '2025-06-01', hasta: '2025-06-15' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const handleProcess = async () => { setLoading(true); setError(''); setResult(null); try { const response = await fetch('http://localhost:5000/api/payroll/process-full-payroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empresaId: 1, periodoDesde: periodo.desde, periodoHasta: periodo.hasta, }), }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setResult(data); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return ( <div className="bg-white p-6 rounded-lg shadow-md"> <h3 className="text-2xl font-semibold text-gray-800 mb-4">Procesar Planilla</h3> <div className="flex items-end gap-4"> <div><label htmlFor="periodoDesde" className="block text-sm font-medium text-gray-700">Desde</label><input type="date" id="periodoDesde" value={periodo.desde} onChange={e => setPeriodo({...periodo, desde: e.target.value})} className="mt-1 block w-full"/></div><div><label htmlFor="periodoHasta" className="block text-sm font-medium text-gray-700">Hasta</label><input type="date" id="periodoHasta" value={periodo.hasta} onChange={e => setPeriodo({...periodo, hasta: e.target.value})} className="mt-1 block w-full"/></div><button onClick={handleProcess} disabled={loading} className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Procesando...' : 'Procesar'}</button> </div> {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>} {result && ( <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md"> <p><strong>¡Éxito!</strong> {result.message}</p> <p>Planilla ID: {result.planillaId}, Neto a Pagar: B/. {result.netoAPagar}</p> </div> )} </div> );
};


// --- COMPONENTES DE PÁGINA ---
const DashboardPage = ({ selectedContractId }) => ( <> <div className="flex justify-between items-center mb-6"> <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2> </div> <PayrollProcessor /> <SettlementCalculator selectedContractId={selectedContractId} /> </> );
const EmployeesPage = ({ onEmployeeSelect, employeeRefreshKey, onAssignContract, openAddEmployeeModal }) => ( <> <div className="flex justify-between items-center mb-6"> <h2 className="text-3xl font-semibold text-gray-800">Gestión de Empleados</h2> <button onClick={openAddEmployeeModal} className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"> + Agregar Empleado </button> </div> <EmployeeList onEmployeeSelect={onEmployeeSelect} refreshKey={employeeRefreshKey} onAssignContract={onAssignContract} /> </> );
const PayrollHistoryPage = ({ onRowClick }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => { const fetchHistory = async () => { setLoading(true); try { const response = await fetch('http://localhost:5000/api/payroll/payrolls'); if (!response.ok) throw new Error('No se pudo obtener el historial.'); const data = await response.json(); setHistory(data); } catch (err) { setError(err.message); } finally { setLoading(false); }}; fetchHistory(); }, []);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-PA');
    return (<> <div className="flex justify-between items-center mb-6"> <h2 className="text-3xl font-semibold text-gray-800">Historial de Planillas</h2> </div> <div className="bg-white p-6 rounded-lg shadow-md"> {loading && <p>Cargando...</p>} {error && <p>{error}</p>} {!loading && !error && (<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th>ID</th><th>Período</th><th>Neto a Pagar</th><th>Estado</th></tr></thead><tbody>{history.length > 0 ? history.map(item => (<tr key={item.id_planilla} className="hover:bg-blue-50 cursor-pointer" onClick={() => onRowClick(item.id_planilla)}><td>{item.id_planilla}</td><td>{formatDate(item.periodo_planilla_desde)} - {formatDate(item.periodo_planilla_hasta)}</td><td className="text-right font-bold">B/. {parseFloat(item.neto_a_pagar).toFixed(2)}</td><td className="text-center"><span className="py-1 px-3 rounded-full text-xs bg-yellow-200 text-yellow-800">{item.estado_planilla}</span></td></tr>)) : <tr><td colSpan="4" className="text-center py-4">No hay planillas procesadas.</td></tr>}</tbody></table></div>)} </div> </>);
};


// --- COMPONENTES ESTRUCTURALES ---
const Navbar = () => ( <nav className="bg-blue-600 text-white p-4 shadow-md"><div className="container mx-auto flex justify-between items-center"><h1 className="text-2xl font-bold">PlanillaMaestra SaaS</h1><div><button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">Iniciar Sesión</button></div></div></nav> );
const Sidebar = ({ currentPage, onNavigate }) => ( <aside className="w-64 bg-gray-100 p-4 space-y-4 hidden md:block rounded-lg shadow"><h2 className="text-xl font-semibold text-gray-700 mb-3">Menú Principal</h2><ul className="space-y-2"><li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} className={`block py-2 px-3 rounded-md transition duration-150 ${currentPage === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}>Dashboard</a></li><li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('employees'); }} className={`block py-2 px-3 rounded-md transition duration-150 ${currentPage === 'employees' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}>Empleados</a></li><li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('history'); }} className={`block py-2 px-3 rounded-md transition duration-150 ${currentPage === 'history' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}>Historial</a></li></ul></aside> );
const Footer = () => ( <footer className="bg-gray-800 text-gray-300 p-4 mt-auto"><div className="container mx-auto text-center"><p>&copy; {new Date().getFullYear()} PlanillaMaestra SaaS. Todos los derechos reservados.</p><p>Desarrollado con ❤️ en Panamá</p></div></footer> );

const MainContent = ({ page, ...props }) => {
  const renderPage = () => {
    switch (page) {
      case 'employees': return <EmployeesPage {...props} />;
      case 'history': return <PayrollHistoryPage {...props} />;
      case 'dashboard': default: return <DashboardPage {...props} />;
    }
  };
  return <main className="flex-1 p-6">{renderPage()}</main>;
};

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedContractId, setSelectedContractId] = useState('');
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [employeeIdForContract, setEmployeeIdForContract] = useState(null);
  const [selectedPayrollId, setSelectedPayrollId] = useState(null);
  const [employeeRefreshKey, setEmployeeRefreshKey] = useState(0);

  const handleNavigate = (page) => setCurrentPage(page);
  const handleEmployeeSelect = (contractId) => { setSelectedContractId(contractId); setCurrentPage('dashboard'); };
  const handleEmployeeAdded = () => { setIsEmployeeModalOpen(false); setEmployeeRefreshKey(prevKey => prevKey + 1); };
  const handleOpenContractModal = (employeeId) => { setEmployeeIdForContract(employeeId); setIsContractModalOpen(true); };
  const handleContractAdded = () => { setIsContractModalOpen(false); };
  const handleHistoryRowClick = (payrollId) => { setSelectedPayrollId(payrollId); setIsDetailModalOpen(true); };
  const closeDetailModal = () => { setIsDetailModalOpen(false); setSelectedPayrollId(null); };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 font-sans">
      <AddEmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} onEmployeeAdded={handleEmployeeAdded} />
      <AddContractModal isOpen={isContractModalOpen} onClose={() => setIsContractModalOpen(false)} onContractAdded={handleContractAdded} employeeId={employeeIdForContract} />
      <PayrollDetailModal isOpen={isDetailModalOpen} onClose={closeDetailModal} payrollId={selectedPayrollId} />
      <Navbar />
      <div className="flex flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <MainContent 
          page={currentPage}
          selectedContractId={selectedContractId}
          handleEmployeeSelect={handleEmployeeSelect}
          openAddEmployeeModal={() => setIsEmployeeModalOpen(true)}
          employeeRefreshKey={employeeRefreshKey}
          openAddContractModal={handleOpenContractModal}
          onRowClick={handleHistoryRowClick}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

