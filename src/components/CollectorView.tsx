import React, { useState } from 'react';
import type { GasRecord, CylinderItem, PaymentMethod, FontSizeMode } from '../types/gas.ts';
import { getCollectorStatus, normalizeSearch } from '../utils/gasLogic.ts';
import { CylinderSelector } from './CylinderSelector.tsx';
import {
  UserCheck,
  PlusCircle,
  Search,
  Check,
  XCircle,
  Trash2,
  Filter,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building,
  User,
  AlertCircle,
} from 'lucide-react';

interface CollectorViewProps {
  records: GasRecord[];
  onAddRecord: (newRecord: Omit<GasRecord, 'id' | 'fechaRegistro'>) => void;
  onToggleCheck1: (id: string) => void;
  onSetInconveniente: (id: string, tieneInconveniente: boolean, motivo?: string) => void;
  onDeleteRecord?: (id: string) => void;
  fontSize: FontSizeMode;
  isMaster?: boolean;
}

export const CollectorView: React.FC<CollectorViewProps> = ({
  records,
  onAddRecord,
  onToggleCheck1,
  onSetInconveniente,
  onDeleteRecord,
  fontSize,
  isMaster = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterMode, setFilterMode] = useState<'todos' | 'sin_check1' | 'con_check1' | 'banco_ok' | 'inconveniente'>('todos');
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [nombre, setNombre] = useState('');
  const [apodoComunal, setApodoComunal] = useState('');
  const [ref, setRef] = useState('');
  const [monto, setMonto] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pago_movil');
  const [giveImmediateCheck1, setGiveImmediateCheck1] = useState(true);
  const [cylinders, setCylinders] = useState<CylinderItem[]>([
    { id: 'c-init-1', weight: '18kg', valve: 'Rosca', qty: 1 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Por favor ingrese el Nombre completo del vecino.');
      return;
    }
    if (!ref.trim()) {
      alert('Por favor ingrese el número de referencia bancaria.');
      return;
    }
    const numMonto = parseFloat(monto.replace(',', '.'));
    if (isNaN(numMonto) || numMonto <= 0) {
      alert('Por favor ingrese un monto válido en Bolívares.');
      return;
    }

    onAddRecord({
      nombre: nombre.trim(),
      apodoComunal: apodoComunal.trim() || undefined,
      bombonas: cylinders,
      ref: ref.trim(),
      monto: numMonto,
      paymentMethod,
      check1_cobrador: giveImmediateCheck1,
      check2_banco: false,
      check2_manual: false,
      tieneInconveniente: false,
      notas: 'Anotado por Cobrador.',
    });

    // Reset Form
    setNombre('');
    setApodoComunal('');
    setRef('');
    setMonto('');
    setCylinders([{ id: 'c-new-' + Date.now(), weight: '18kg', valve: 'Rosca', qty: 1 }]);
    setShowAddForm(false);
  };

  const cleanSearch = normalizeSearch(searchFilter);
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      !cleanSearch ||
      normalizeSearch(rec.nombre).includes(cleanSearch) ||
      (rec.apodoComunal && normalizeSearch(rec.apodoComunal).includes(cleanSearch)) ||
      rec.ref.includes(cleanSearch);

    if (!matchesSearch) return false;

    if (filterMode === 'inconveniente') return rec.tieneInconveniente;
    if (filterMode === 'sin_check1') return !rec.check1_cobrador;
    if (filterMode === 'con_check1') return rec.check1_cobrador;
    if (filterMode === 'banco_ok') return rec.check2_banco;
    return true;
  });

  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';
  const inputPaddingClass =
    fontSize === 'extragrande' ? 'p-4 text-xl' : fontSize === 'grande' ? 'p-3.5 text-lg' : 'p-3 text-base';

  return (
    <div className="space-y-6">
      
      {/* Encabezado del Rol Cobrador */}
      <div className="bg-blue-900 text-white rounded-3xl p-5 md:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black flex-shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black font-['Outfit']">
              Módulo de Cobranza (Atención al Vecino)
            </h2>
            <p className="text-blue-200 text-sm md:text-base">
              Verifica los datos recibidos y presiona <strong>Validar datos</strong>. Observa si el banco ya verificó el extracto.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-extrabold text-sm md:text-base cursor-pointer transition-colors"
        >
          {showAddForm ? (
            <>
              <ChevronUp className="w-5 h-5" />
              <span>Cerrar Formulario</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>+ Anotar Vecino</span>
            </>
          )}
        </button>
      </div>

      {/* Formulario de Registro para Cobrador */}
      {showAddForm && (
        <section className="bg-white border-3 border-blue-400 rounded-3xl p-5 md:p-7 shadow-sm">
          <div className="border-b-2 border-slate-200 pb-3 mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-blue-600" />
              <span>Anotar Vecino para la Jornada</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Paso 1: Validar datos
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="cob-nombre" className={`block font-bold text-slate-900 mb-1.5 ${textSizeClass}`}>
                  Nombre Completo del Vecino:
                </label>
                <input
                  id="cob-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: María Páez"
                  className={`w-full rounded-xl border-2 border-slate-300 font-bold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
                />
              </div>

              {/* Apodo o Referencia Comunal */}
              <div>
                <label htmlFor="cob-apodo" className={`block font-bold text-slate-900 mb-1.5 ${textSizeClass}`}>
                  Nombre o Referencia de Barrio / Familiar:
                </label>
                <input
                  id="cob-apodo"
                  type="text"
                  value={apodoComunal}
                  onChange={(e) => setApodoComunal(e.target.value)}
                  placeholder="Ej: María Mario (esposa de Mario)"
                  className={`w-full rounded-xl border-2 border-slate-300 font-bold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
                />
              </div>
            </div>

            {/* Selector de Bombonas */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <CylinderSelector
                cylinders={cylinders}
                onChange={setCylinders}
                fontSize={fontSize}
              />
            </div>

            {/* Referencia y Monto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cob-ref" className={`block font-bold text-slate-900 mb-1.5 ${textSizeClass}`}>
                  Referencia Bancaria:
                </label>
                <input
                  id="cob-ref"
                  type="text"
                  required
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Ej: 987654"
                  className={`w-full rounded-xl border-2 border-slate-300 font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
                />
              </div>

              <div>
                <label htmlFor="cob-monto" className={`block font-bold text-slate-900 mb-1.5 ${textSizeClass}`}>
                  Monto Cobrado (Bs.):
                </label>
                <input
                  id="cob-monto"
                  type="number"
                  step="0.01"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 850.00"
                  className={`w-full rounded-xl border-2 border-slate-300 font-extrabold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Método de pago recibido:
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'pago_movil', label: 'Pago Móvil' },
                  { id: 'transferencia', label: 'Transferencia' },
                  { id: 'efectivo', label: 'Efectivo' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-bold cursor-pointer transition-colors ${
                      paymentMethod === m.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Validar datos inmediato */}
            <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between">
              <label htmlFor="immediate-check1" className="flex items-center gap-2.5 font-bold text-blue-950 cursor-pointer">
                <input
                  id="immediate-check1"
                  type="checkbox"
                  checked={giveImmediateCheck1}
                  onChange={(e) => setGiveImmediateCheck1(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Validar datos inmediatamente (Confirmar datos recibidos)</span>
              </label>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-md cursor-pointer transition-colors"
            >
              Guardar y Registrar Vecino
            </button>
          </form>
        </section>
      )}

      {/* Lista de Registros para el Cobrador */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-5 md:p-6 shadow-sm">
        
        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por vecino (ej: María Mario o María Páez) o ref..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-300 text-sm font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterMode('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('sin_check1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'sin_check1'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Falta Validar Datos ({records.filter((r) => !r.check1_cobrador).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('con_check1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'con_check1'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Datos Validados ({records.filter((r) => r.check1_cobrador).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('banco_ok')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'banco_ok'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              Verificado Banco ({records.filter((r) => r.check2_banco).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('inconveniente')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'inconveniente'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              Inconvenientes ({records.filter((r) => r.tieneInconveniente).length})
            </button>
          </div>

        </div>

        {/* Tabla / Tarjetas de Vecinos */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-bold text-base">No hay registros que coincidan con el filtro.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((rec) => {
              const collectorStatus = getCollectorStatus(rec);
              return (
                <div
                  key={rec.id}
                  className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    rec.tieneInconveniente
                      ? 'bg-red-50/70 border-red-400'
                      : rec.check1_cobrador
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-amber-50/60 border-amber-300'
                  }`}
                >
                  {/* Datos del Vecino */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-lg md:text-xl">
                        {rec.nombre}
                      </span>
                      {rec.apodoComunal && (
                        <span className="bg-indigo-100 text-indigo-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                          Ubicar como: <strong>{rec.apodoComunal}</strong>
                        </span>
                      )}
                    </div>

                    {/* Estatus visible para el cobrador: extracto bancario */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                      <span className="font-bold text-slate-600">Estado del Banco:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold border ${collectorStatus.badgeClass}`}>
                        {collectorStatus.label}
                      </span>
                    </div>

                    {/* Bombonas */}
                    <div className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-700">
                      {rec.bombonas.map((b, i) => (
                        <span key={i} className="bg-white px-2.5 py-1 rounded-md border border-slate-300">
                          {b.qty}x {b.weight} ({b.valve})
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-3 pt-1">
                      <span>Ref: <strong className="font-mono text-slate-900">{rec.ref}</strong></span>
                      <span>Monto: <strong className="text-slate-900">Bs. {rec.monto.toFixed(2)}</strong></span>
                      <span>Método: <strong className="capitalize">{rec.paymentMethod.replace('_', ' ')}</strong></span>
                    </div>

                    {/* Si tiene inconveniente, mostrar mensaje explicativo */}
                    {rec.tieneInconveniente && (
                      <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-950 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                        <span>Inconveniente: {rec.motivoInconveniente || 'Datos incompletos o referencia con problema.'}</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones de Validar Datos e Inconveniente */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    
                    {/* Botón Validar Datos */}
                    <button
                      type="button"
                      onClick={() => onToggleCheck1(rec.id)}
                      className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm cursor-pointer transition-all shadow-xs ${
                        rec.check1_cobrador
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      }`}
                    >
                      {rec.check1_cobrador ? (
                        <>
                          <Check className="w-5 h-5 text-white" />
                          <span>Datos Validados</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Validar Datos</span>
                        </>
                      )}
                    </button>

                    {/* Botón Marcar / Resolver Inconveniente */}
                    <button
                      type="button"
                      onClick={() => {
                        if (rec.tieneInconveniente) {
                          onSetInconveniente(rec.id, false);
                        } else {
                          const motivo = prompt('Escriba el motivo del inconveniente (ej: Referencia no coincide, monto incompleto, etc.):');
                          if (motivo !== null) {
                            onSetInconveniente(rec.id, true, motivo || 'Datos con discrepancia.');
                          }
                        }
                      }}
                      className={`p-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                        rec.tieneInconveniente
                          ? 'bg-white border-2 border-emerald-500 text-emerald-800 hover:bg-emerald-50'
                          : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {rec.tieneInconveniente ? 'Resolver Inconveniente' : 'Reportar Inconveniente'}
                    </button>

                    {/* Botón Eliminar (solo si es Master o permitido) */}
                    {isMaster && onDeleteRecord && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar registro de ${rec.nombre}?`)) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        className="p-3 text-red-600 hover:bg-red-50 hover:text-red-800 rounded-xl border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Eliminar este registro"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
};
