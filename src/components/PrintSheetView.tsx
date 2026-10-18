import React from 'react';
import type { GasRecord, FontSizeMode } from '../types/gas.ts';
import { computeRecordStatus, calculateTotals } from '../utils/gasLogic.ts';
import { Printer, Download, BookOpen, CheckSquare, Sparkles } from 'lucide-react';

interface PrintSheetViewProps {
  records: GasRecord[];
  fontSize: FontSizeMode;
}

export const PrintSheetView: React.FC<PrintSheetViewProps> = ({ records, fontSize }) => {
  const totals = calculateTotals(records);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Nº',
      'Nombre del Vecino',
      'Bombonas Solicitadas',
      'Referencia Bancaria',
      'Monto (Bs.)',
      'Metodo',
      'Check 1 (Validar datos)',
      'Check 2 (Verificacion bancaria)',
      'Check 3 (Verificacion manual)',
      'Estatus Comunal',
    ];

    const rows = records.map((r, idx) => {
      const status = computeRecordStatus(r);
      const bombonasStr = r.bombonas
        .map((b) => `${b.qty}x ${b.weight} (${b.valve})`)
        .join(' + ');

      return [
        idx + 1,
        `"${r.nombre.replace(/"/g, '""')}"`,
        `"${bombonasStr}"`,
        `"${r.ref}"`,
        r.monto.toFixed(2),
        r.paymentMethod,
        r.check1_cobrador ? 'SI' : 'NO',
        r.check2_banco ? 'SI' : 'NO',
        r.check2_manual ? 'SI' : 'NO',
        `"${status.shortLabel}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jornada_gas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Explicación de la Fase de Prueba y Respaldo */}
      <div className="bg-amber-50 border-3 border-amber-400 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-black flex-shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-950 font-['Outfit']">
              Fase de Respaldo en Paralelo: Lista para el Cuaderno
            </h3>
            <p className="text-amber-900 text-sm md:text-base font-medium">
              "Durante las primeras jornadas, podemos seguir teniendo la hoja en papel mientras nos acostumbramos a la aplicación para que no haya dudas."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md text-sm md:text-base"
          >
            <Printer className="w-5 h-5 text-amber-400" />
            <span>🖨️ Imprimir Hoja / Guardar PDF</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 rounded-xl font-bold cursor-pointer transition-colors text-sm md:text-base"
          >
            <Download className="w-5 h-5 text-slate-600" />
            <span>Descargar Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Hoja de Impresión Principal (Diseño tipo Planilla Comunitaria) */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Cabecera Oficial Comunitaria */}
        <div className="border-b-4 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">
                Planilla de Control Comunal de Bombonas de Gas
              </h1>
              <p className="text-slate-600 font-bold text-sm mt-0.5">
                GasGestor • Jornada de Distribución Comunitaria
              </p>
            </div>
            <div className="text-right text-xs md:text-sm font-bold text-slate-500">
              <div>Fecha: {new Date().toLocaleDateString('es-VE')}</div>
              <div className="text-slate-900 font-black">Total Vecinos: {records.length}</div>
            </div>
          </div>

          {/* Resumen para el Camión de Gas */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t-2 border-slate-300">
            <div className="bg-slate-100 p-2 rounded-lg text-center">
              <span className="text-2xs font-bold text-slate-500 block uppercase">10 kg (Pequeña)</span>
              <strong className="text-base text-slate-900">{totals.weightsCount['10kg']} bombonas</strong>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-center">
              <span className="text-2xs font-bold text-slate-500 block uppercase">18 kg (Mediana)</span>
              <strong className="text-base text-slate-900">{totals.weightsCount['18kg']} bombonas</strong>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-center">
              <span className="text-2xs font-bold text-slate-500 block uppercase">27 kg (Grande)</span>
              <strong className="text-base text-slate-900">{totals.weightsCount['27kg']} bombonas</strong>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-center">
              <span className="text-2xs font-bold text-slate-500 block uppercase">43 kg (Industrial)</span>
              <strong className="text-base text-slate-900">{totals.weightsCount['43kg']} bombonas</strong>
            </div>
            <div className="bg-blue-900 text-white p-2 rounded-lg text-center col-span-2 sm:col-span-1">
              <span className="text-2xs font-bold text-blue-200 block uppercase">Total a Cargar</span>
              <strong className="text-base text-amber-400">{totals.totalCylinders} Bombonas</strong>
            </div>
          </div>
        </div>

        {/* Tabla Lista para Imprimir / Cuaderno */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-2 border-slate-900 text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-black border-b-2 border-slate-900 uppercase">
                <th className="p-2 border-r border-slate-400 text-center w-10">Nº</th>
                <th className="p-2 border-r border-slate-400">Nombre del Vecino</th>
                <th className="p-2 border-r border-slate-400">Bombonas</th>
                <th className="p-2 border-r border-slate-400">Ref. Banco</th>
                <th className="p-2 border-r border-slate-400 text-right">Monto (Bs.)</th>
                <th className="p-2 border-r border-slate-400 text-center">1. Validar Datos</th>
                <th className="p-2 border-r border-slate-400 text-center">2. Verif. Banco</th>
                <th className="p-2 border-r border-slate-400 text-center">3. Verif. Manual</th>
                <th className="p-2 border-r border-slate-400 text-center">Estatus</th>
                <th className="p-2 text-center w-28">Entregado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400">
              {records.map((rec, index) => {
                const status = computeRecordStatus(rec);
                return (
                  <tr key={rec.id} className="even:bg-slate-50">
                    <td className="p-2 border-r border-slate-400 text-center font-bold">
                      {index + 1}
                    </td>
                    <td className="p-2 border-r border-slate-400 font-black text-slate-900">
                      <div>{rec.nombre}</div>
                      {rec.apodoComunal && (
                        <div className="text-2xs font-bold text-slate-600 italic">
                          ({rec.apodoComunal})
                        </div>
                      )}
                    </td>
                    <td className="p-2 border-r border-slate-400 font-medium">
                      {rec.bombonas
                        .map((b) => `${b.qty}x ${b.weight} (${b.valve})`)
                        .join(', ')}
                    </td>
                    <td className="p-2 border-r border-slate-400 font-mono font-bold">
                      {rec.ref}
                    </td>
                    <td className="p-2 border-r border-slate-400 text-right font-bold text-slate-900">
                      {rec.monto.toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-slate-400 text-center font-bold">
                      {rec.check1_cobrador ? '✓' : '-'}
                    </td>
                    <td className="p-2 border-r border-slate-400 text-center font-bold">
                      {rec.check2_banco ? '✓' : '-'}
                    </td>
                    <td className="p-2 border-r border-slate-400 text-center font-bold">
                      {rec.check2_manual ? '✓' : '-'}
                    </td>
                    <td className="p-2 border-r border-slate-400 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-2xs font-extrabold ${
                        rec.tieneInconveniente
                          ? 'bg-red-200 text-red-950 font-black'
                          : status.level === 'nivel2'
                          ? 'bg-emerald-200 text-emerald-900 font-black'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {rec.tieneInconveniente ? 'INCONVENIENTE' : status.shortLabel}
                      </span>
                    </td>
                    <td className="p-2 border-slate-400 text-center font-bold text-slate-400">
                      [ &nbsp;&nbsp; ]
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
