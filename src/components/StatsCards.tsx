import React from 'react';
import type { GasRecord, FontSizeMode } from '../types/gas.ts';
import { calculateTotals } from '../utils/gasLogic.ts';
import { Fuel, CheckCircle2, DollarSign, Clock } from 'lucide-react';

interface StatsCardsProps {
  records: GasRecord[];
  fontSize: FontSizeMode;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ records, fontSize }) => {
  const totals = calculateTotals(records);

  const numSizeClass =
    fontSize === 'extragrande'
      ? 'text-4xl'
      : fontSize === 'grande'
      ? 'text-3xl'
      : 'text-2xl';

  const labelSizeClass =
    fontSize === 'extragrande'
      ? 'text-base'
      : fontSize === 'grande'
      ? 'text-sm'
      : 'text-xs';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-4">

      {/* Total Bombonas */}
      <div
        className="bg-white rounded-2xl p-3.5 md:p-4 border hover:shadow-md transition-shadow"
        style={{ borderColor: '#BFDBFE', boxShadow: '0 2px 12px 0 rgba(59,130,246,0.07)' }}
      >
        <div className="flex items-center justify-between mb-1" style={{ color: '#1E40AF' }}>
          <span className={`font-bold uppercase tracking-wider ${labelSizeClass}`}>
            Total Bombonas
          </span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#DBEAFE' }}>
            <Fuel className="w-4 h-4" style={{ color: '#1D4ED8' }} />
          </div>
        </div>
        <div className={`font-black text-slate-900 ${numSizeClass}`}>
          {totals.totalCylinders}
        </div>
        <div className="text-xs text-slate-400 font-medium mt-1 flex flex-wrap gap-1">
          <span>10k:{totals.weightsCount['10kg']}</span> •
          <span>18k:{totals.weightsCount['18kg']}</span> •
          <span>27k:{totals.weightsCount['27kg']}</span> •
          <span>43k:{totals.weightsCount['43kg']}</span>
        </div>
      </div>

      {/* Aprobadas Nivel 2 */}
      <div
        className="bg-white rounded-2xl p-3.5 md:p-4 border hover:shadow-md transition-shadow"
        style={{ borderColor: '#BBF7D0', boxShadow: '0 2px 12px 0 rgba(22,163,74,0.07)' }}
      >
        <div className="flex items-center justify-between mb-1" style={{ color: '#15803D' }}>
          <span className={`font-bold uppercase tracking-wider ${labelSizeClass}`}>
            Aprobadas (Nivel 2)
          </span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#D9F2D8' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#16A34A' }} />
          </div>
        </div>
        <div className={`font-black ${numSizeClass}`} style={{ color: '#15803D' }}>
          {totals.totalNivel2Aprobados} / {totals.totalRecords}
        </div>
        <div className="text-xs font-bold mt-1" style={{ color: '#16A34A' }}>
          {totals.totalRecords > 0
            ? `${Math.round((totals.totalNivel2Aprobados / totals.totalRecords) * 100)}% listos para despacho`
            : 'Sin registros'}
        </div>
      </div>

      {/* Datos Validados / Inconvenientes */}
      <div
        className="bg-white rounded-2xl p-3.5 md:p-4 border hover:shadow-md transition-shadow"
        style={{
          borderColor: totals.totalInconvenientes > 0 ? '#FECACA' : '#FDE68A',
          background: totals.totalInconvenientes > 0 ? '#FFF8F8' : '#FFFFFF',
          boxShadow: '0 2px 12px 0 rgba(217,119,6,0.07)',
        }}
      >
        <div className="flex items-center justify-between mb-1" style={{ color: '#B45309' }}>
          <span className={`font-bold uppercase tracking-wider ${labelSizeClass}`}>
            Datos Validados / Inconvenientes
          </span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
            <Clock className="w-4 h-4" style={{ color: '#D97706' }} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`font-black text-slate-900 ${numSizeClass}`}>
            {totals.totalCheck1}
          </span>
          {totals.totalInconvenientes > 0 && (
            <span
              className="text-xs font-extrabold px-2 py-0.5 rounded-full border"
              style={{ background: '#FFE4E6', color: '#DC2626', borderColor: '#FECACA' }}
            >
              {totals.totalInconvenientes} con inconveniente
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          {totals.totalInconvenientes > 0
            ? 'Atención a reportes de pago'
            : `${totals.totalRecords - totals.totalCheck1} pendientes`}
        </div>
      </div>

      {/* Recaudado Bs */}
      <div
        className="bg-white rounded-2xl p-3.5 md:p-4 border hover:shadow-md transition-shadow"
        style={{ borderColor: '#C7D2FE', boxShadow: '0 2px 12px 0 rgba(99,102,241,0.07)' }}
      >
        <div className="flex items-center justify-between mb-1" style={{ color: '#4338CA' }}>
          <span className={`font-bold uppercase tracking-wider ${labelSizeClass}`}>
            Total Registrado
          </span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <DollarSign className="w-4 h-4" style={{ color: '#4F46E5' }} />
          </div>
        </div>
        <div className={`font-black text-slate-900 ${numSizeClass}`}>
          Bs. {totals.totalMonto.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs font-bold mt-1" style={{ color: '#4338CA' }}>
          Aprobado: Bs. {totals.totalRecaudadoAprobado.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

    </div>
  );
};
