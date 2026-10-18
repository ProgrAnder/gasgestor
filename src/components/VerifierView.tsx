import React, { useState } from 'react';
import type { GasRecord, FontSizeMode } from '../types/gas.ts';
import { computeRecordStatus, reconcileBankExtract, normalizeSearch } from '../utils/gasLogic.ts';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ClipboardCheck,
  Search,
  Filter,
  Check,
  AlertTriangle,
  AlertCircle,
  Lock,
  User,
} from 'lucide-react';

interface VerifierViewProps {
  records: GasRecord[];
  onUpdateRecords: (updatedRecords: GasRecord[]) => void;
  onToggleCheck2Manual: (id: string) => void;
  onToggleCheck2Banco: (id: string) => void;
  onToggleCheck1?: (id: string) => void; // Solo editable por Master
  onSetInconveniente: (id: string, tieneInconveniente: boolean, motivo?: string) => void;
  fontSize: FontSizeMode;
  isMaster?: boolean;
}

const SAMPLE_BANK_EXTRACT = `ESTADO DE CUENTA BANCARIO - BANCO DE VENEZUELA
Fecha: 17/10/2026 - Cuenta Recaudadora Comunal
--------------------------------------------------------
17/10/2026 09:32 CREDITO PAGO MOVIL BANCO PROVINCIAL REF: 987654 MONTO: Bs. 850,00 APROBADO
17/10/2026 10:18 CREDITO PAGO MOVIL BANESCO REF: 112233 MONTO: Bs. 120,00 APROBADO
17/10/2026 11:05 TRANSFERENCIA MISMO BANCO REF: 554433 MONTO: Bs. 310,00 APROBADO
17/10/2026 11:50 PAGO MOVIL MERCANTIL REF: 778899 MONTO: Bs. 290,00 APROBADO
--------------------------------------------------------
TOTAL CREDITOS: 4 OPERACIONES`;

export const VerifierView: React.FC<VerifierViewProps> = ({
  records,
  onUpdateRecords,
  onToggleCheck2Manual,
  onToggleCheck2Banco,
  onToggleCheck1,
  onSetInconveniente,
  fontSize,
  isMaster = false,
}) => {
  const [bankText, setBankText] = useState('');
  const [conciliationResult, setConciliationResult] = useState<{
    count: number;
    logs: string[];
  } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'listos' | 'falta_banco' | 'falta_manual' | 'inconveniente'>('todos');

  const handleProcessBank = () => {
    if (!bankText.trim()) {
      alert('Por favor pegue el texto del extracto bancario o use el botón de ejemplo.');
      return;
    }

    const res = reconcileBankExtract(records, bankText);
    onUpdateRecords(res.updatedRecords);
    setConciliationResult({
      count: res.matchedCount,
      logs: res.logs,
    });
  };

  const handlePasteSampleBank = () => {
    setBankText(SAMPLE_BANK_EXTRACT);
  };

  const cleanSearch = normalizeSearch(searchFilter);
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      !cleanSearch ||
      normalizeSearch(rec.nombre).includes(cleanSearch) ||
      (rec.apodoComunal && normalizeSearch(rec.apodoComunal).includes(cleanSearch)) ||
      rec.ref.includes(cleanSearch);

    if (!matchesSearch) return false;

    if (statusFilter === 'inconveniente') return rec.tieneInconveniente;
    const status = computeRecordStatus(rec);
    if (statusFilter === 'listos') return status.level === 'nivel2';
    if (statusFilter === 'falta_banco') return !rec.check2_banco;
    if (statusFilter === 'falta_manual') return !rec.check2_manual;
    return true;
  });

  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-6">
      
      {/* Encabezado del Módulo del Verificador */}
      <div className="bg-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black flex-shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black font-['Outfit']">
              Módulo del Verificador (Banco)
            </h2>
            <p className="text-indigo-200 text-sm md:text-base">
              Supervisa el <strong>Check 1 (Validar datos)</strong>, concilia el extracto bancario (<strong>Check 2</strong>) y coloca tu <strong>Check 3 (Verificación manual)</strong>.
            </p>
          </div>
        </div>

        <div className="bg-indigo-900/80 px-4 py-2.5 rounded-xl border border-indigo-700 text-xs md:text-sm font-bold text-indigo-200">
          Nivel 2 Aprobado = Check 1 (Validar datos) + Check 2 (Verificación bancaria) + <span className="text-amber-400 font-black">Check 3 (Verificación manual)</span>
        </div>
      </div>

      {/* Módulo de Conciliación Automática */}
      <section className="bg-white border-3 border-indigo-400 rounded-3xl p-5 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
              Check 2: Verificación bancaria (Conciliación Automática)
            </h3>
          </div>
          <button
            type="button"
            onClick={handlePasteSampleBank}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          >
            📋 Pegar Extracto Bancario de Prueba
          </button>
        </div>

        <p className="text-slate-600 text-sm md:text-base mb-3 font-medium">
          Pega el texto del banco. El sistema verifica si coincide la referencia y el monto de cada vecino.
        </p>

        <textarea
          rows={4}
          value={bankText}
          onChange={(e) => setBankText(e.target.value)}
          placeholder="Pegue aquí el texto del extracto bancario o notificaciones de Pago Móvil..."
          className="w-full font-mono text-xs md:text-sm p-4 rounded-2xl border-2 border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleProcessBank}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-base shadow-md cursor-pointer transition-colors"
          >
            <ClipboardCheck className="w-5 h-5" />
            <span>Procesar Extracto Bancario</span>
          </button>

          {bankText && (
            <button
              type="button"
              onClick={() => {
                setBankText('');
                setConciliationResult(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 cursor-pointer"
            >
              Limpiar texto
            </button>
          )}
        </div>

        {/* Resumen de la Conciliación */}
        {conciliationResult && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-300 text-indigo-950 animate-fade-in">
            <h4 className="font-extrabold text-base flex items-center gap-2 text-indigo-900">
              <CheckCircle2 className="w-5 h-5 text-indigo-700" />
              <span>
                Conciliación completada: {conciliationResult.count} pago(s) validados con éxito.
              </span>
            </h4>
            {conciliationResult.logs.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs font-mono bg-white p-3 rounded-xl border border-indigo-200 max-h-40 overflow-y-auto">
                {conciliationResult.logs.map((log, idx) => (
                  <li key={idx} className="text-slate-700">
                    • {log}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Tabla de Pagos y Control de Verificación */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-5 md:p-6 shadow-sm">
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar vecino (ej: María Mario o María Páez) o ref..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === 'todos'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('falta_banco')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === 'falta_banco'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              Falta Banco ({records.filter((r) => !r.check2_banco).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('falta_manual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === 'falta_manual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}
            >
              Falta Manual ({records.filter((r) => !r.check2_manual).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('listos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === 'listos'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              Aprobados Nivel 2 ({records.filter((r) => !r.tieneInconveniente && r.check1_cobrador && r.check2_banco && r.check2_manual).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inconveniente')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                statusFilter === 'inconveniente'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              Con Inconveniente ({records.filter((r) => r.tieneInconveniente).length})
            </button>
          </div>
        </div>

        {/* Tabla Detallada con Permisos Estrictos */}
        <div className="overflow-x-auto -mx-2 md:mx-0">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-extrabold border-b-2 border-slate-300">
                <th className="p-3">Vecino / Identificación Comunal</th>
                <th className="p-3">Ref. y Monto</th>
                <th className="p-3">Check 1 (Validar datos)</th>
                <th className="p-3">Check 2 (Verif. bancaria)</th>
                <th className="p-3">Check 3 (Verif. manual)</th>
                <th className="p-3 text-center">Estatus Final</th>
                <th className="p-3 text-center">Inconveniente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRecords.map((rec) => {
                const status = computeRecordStatus(rec);
                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      rec.tieneInconveniente
                        ? 'bg-red-50/70 hover:bg-red-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    
                    {/* Vecino y Apodo */}
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900 text-base">
                        {rec.nombre}
                      </div>
                      {rec.apodoComunal && (
                        <div className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          Referencia: <strong>{rec.apodoComunal}</strong>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.bombonas.map((b, i) => (
                          <span
                            key={i}
                            className="text-2xs bg-slate-200/80 text-slate-800 font-bold px-1.5 py-0.5 rounded"
                          >
                            {b.qty}x {b.weight} ({b.valve})
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Referencia y Monto */}
                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        Ref: {rec.ref}
                      </span>
                      <span className="font-extrabold text-indigo-900 text-sm block">
                        Bs. {rec.monto.toFixed(2)}
                      </span>
                    </td>

                    {/* Check 1 (Validar datos) - Solo lectura para Verificador, editable solo por Master */}
                    <td className="p-3">
                      {isMaster && onToggleCheck1 ? (
                        <button
                          type="button"
                          onClick={() => onToggleCheck1(rec.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                            rec.check1_cobrador
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {rec.check1_cobrador ? '✓ Datos Validados (Master)' : 'Falta Validar (Master)'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {rec.check1_cobrador ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs">
                              <Check className="w-3.5 h-3.5" /> Datos Validados
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs">
                              <Lock className="w-3 h-3 text-slate-400" /> Falta Validar
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Check 2 (Verificación bancaria) */}
                    <td className="p-3">
                      <div className="space-y-1">
                        {rec.check2_banco ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-extrabold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />
                            Banco OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                            Sin Coincidencia
                          </span>
                        )}
                        {isMaster && (
                          <button
                            type="button"
                            onClick={() => onToggleCheck2Banco(rec.id)}
                            className="block text-2xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            {rec.check2_banco ? 'Desmarcar banco' : 'Marcar banco'}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Check 3 (Verificación manual) - Este sí lo coloca el Verificador */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => onToggleCheck2Manual(rec.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition-colors shadow-xs ${
                          rec.check2_manual
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        {rec.check2_manual ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Verificación manual OK</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Verificación manual</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Estatus Final */}
                    <td className="p-3 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-black border ${status.badgeClass}`}>
                        {status.shortLabel}
                      </span>
                    </td>

                    {/* Botón de Inconveniente */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (rec.tieneInconveniente) {
                            onSetInconveniente(rec.id, false);
                          } else {
                            const motivo = prompt('Describa el inconveniente (ej: Referencia no concuerda en el banco, monto incorrecto, etc.):');
                            if (motivo !== null) {
                              onSetInconveniente(rec.id, true, motivo || 'Inconveniente bancario.');
                            }
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          rec.tieneInconveniente
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {rec.tieneInconveniente ? 'Resolver' : 'Marcar Inconveniente'}
                      </button>
                      {rec.tieneInconveniente && rec.motivoInconveniente && (
                        <div className="text-2xs text-red-800 mt-1 max-w-[140px] truncate" title={rec.motivoInconveniente}>
                          {rec.motivoInconveniente}
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
};
