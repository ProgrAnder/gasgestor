import React, { useState } from 'react';
import type { GasRecord, CylinderItem, PaymentMethod, FontSizeMode } from '../types/gas.ts';
import { normalizeSearch } from '../utils/gasLogic.ts';
import { CylinderSelector } from './CylinderSelector.tsx';
import {
  PlusCircle,
  Search,
  Trash2,
  Heart,
  User,
  Hash,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Receipt,
  Users,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';

interface MamaSimpleCollectorProps {
  records: GasRecord[];
  onAddRecord: (newRecord: Omit<GasRecord, 'id' | 'fechaRegistro'>) => void;
  onDeleteRecord: (id: string) => void;
  fontSize: FontSizeMode;
}

export const MamaSimpleCollector: React.FC<MamaSimpleCollectorProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  fontSize,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [apodoComunal, setApodoComunal] = useState('');
  const [ref, setRef] = useState('');
  const [monto, setMonto] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pago_movil');
  const [cylinders, setCylinders] = useState<CylinderItem[]>([
    { id: 'c-mama-1', weight: '18kg', valve: 'Rosca', qty: 1 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Por favor escribe el nombre de la persona.');
      return;
    }

    const totalCyl = cylinders.reduce((acc, c) => acc + c.qty, 0);
    if (totalCyl === 0) {
      alert('Debes agregar al menos una bombona.');
      return;
    }

    onAddRecord({
      nombre: nombre.trim(),
      apodoComunal: apodoComunal.trim() || undefined,
      bombonas: cylinders,
      ref: ref.trim() || 'S/R',
      monto: Number(monto) || 0,
      paymentMethod,
      check1_cobrador: true, // Se marca verificado por ella misma
      check2_banco: true,
      check2_manual: true,
    });

    // Resetear formulario
    setNombre('');
    setApodoComunal('');
    setRef('');
    setMonto('');
    setCylinders([{ id: 'c-mama-1', weight: '18kg', valve: 'Rosca', qty: 1 }]);
    setShowAddForm(false);
  };

  // Filtrado simple por nombre o referencia
  const filteredRecords = records.filter((r) => {
    if (!searchFilter.trim()) return true;
    const query = normalizeSearch(searchFilter);
    const inName = normalizeSearch(r.nombre).includes(query);
    const inNick = r.apodoComunal ? normalizeSearch(r.apodoComunal).includes(query) : false;
    const inRef = r.ref ? normalizeSearch(r.ref).includes(query) : false;
    return inName || inNick || inRef;
  });

  const [showTotalMonto, setShowTotalMonto] = useState(false);

  // Totales y desglose por válvulas
  const totalBombonas = records.reduce(
    (acc, r) => acc + r.bombonas.reduce((s, b) => s + b.qty, 0),
    0
  );

  const valveCounts = records.reduce(
    (acc, r) => {
      r.bombonas.forEach((b) => {
        if (b.valve === 'Rosca') acc.rosca += b.qty;
        else if (b.valve === 'Clip-on') acc.clipon += b.qty;
        else if (b.valve === 'AutoGas') acc.autogas += b.qty;
      });
      return acc;
    },
    { rosca: 0, clipon: 0, autogas: 0 }
  );

  const totalMonto = records.reduce((acc, r) => acc + (r.monto || 0), 0);

  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      
      {/* Banner Superior Amigable */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-5 md:p-6 rounded-3xl shadow-md space-y-4">
        
        {/* Fila del Título y Total Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black">Libreta de Cobro sf10</h2>
              <p className="text-rose-100 text-xs md:text-sm font-medium">
                Control de entregas y conteo de bombonas
              </p>
            </div>
          </div>

          {/* Contador General de Personas y Bombonas */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <div>
              <span className="text-2xs text-rose-100 block font-bold uppercase">Personas</span>
              <strong className="text-xl font-black">{records.length}</strong>
            </div>
            <div className="w-px bg-white/30 my-0.5"></div>
            <div>
              <span className="text-2xs text-rose-100 block font-bold uppercase">Total Bombonas</span>
              <strong className="text-xl font-black text-amber-200">{totalBombonas}</strong>
            </div>
          </div>
        </div>

        {/* Desglose por Válvulas y Total Bs Oculto */}
        <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Pills de Válvulas */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/25 flex items-center gap-1.5">
              <span className="font-medium text-rose-100">Rosca:</span>
              <strong className="text-sm font-black text-white">{valveCounts.rosca}</strong>
            </div>

            <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/25 flex items-center gap-1.5">
              <span className="font-medium text-rose-100">Clip-on:</span>
              <strong className="text-sm font-black text-white">{valveCounts.clipon}</strong>
            </div>

            <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/25 flex items-center gap-1.5">
              <span className="font-medium text-rose-100">AutoGas:</span>
              <strong className="text-sm font-black text-white">{valveCounts.autogas}</strong>
            </div>
          </div>

          {/* Total Bs con opción Oculta / Revelar */}
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
            <span className="text-2xs font-bold text-rose-200">Total Bs:</span>
            {showTotalMonto ? (
              <strong className="text-sm font-black text-emerald-300">
                Bs. {totalMonto.toLocaleString('es-VE', { minimumFractionDigits: 0 })}
              </strong>
            ) : (
              <span className="font-mono text-sm tracking-widest text-slate-300 select-none">••••••••</span>
            )}
            <button
              type="button"
              onClick={() => setShowTotalMonto(!showTotalMonto)}
              className="text-white/80 hover:text-white cursor-pointer ml-1"
              title={showTotalMonto ? 'Ocultar Total Bs' : 'Mostrar Total Bs'}
            >
              {showTotalMonto ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* Botón para Abrir Formulario */}
      <div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg md:text-xl rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-6 h-6" />
          <span>{showAddForm ? 'Cerrar Formulario' : '＋ Anotar Nueva Bombona'}</span>
          {showAddForm ? <ChevronUp className="w-5 h-5 ml-1" /> : <ChevronDown className="w-5 h-5 ml-1" />}
        </button>
      </div>

      {/* Formulario Sencillo y Limpio */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 md:p-6 rounded-3xl shadow-lg border-2 border-emerald-300 space-y-4 animate-fade-in"
        >
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>Datos del Vecino y la Bombona</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carmen Rodríguez"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Apodo o Casa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Apodo o Casa (Opcional):
              </label>
              <input
                type="text"
                value={apodoComunal}
                onChange={(e) => setApodoComunal(e.target.value)}
                placeholder="Ej: Carmen la de la esquina, Casa #12"
                className="w-full px-3 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Monto Bs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monto en Bs:
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="any"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Referencia o Notas:
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Ej: 4589 o 'Pagó en efectivo'"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Selector de Bombonas */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ¿Qué bombonas entrega?:
            </label>
            <CylinderSelector cylinders={cylinders} onChange={setCylinders} />
          </div>

          {/* Botón Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-md cursor-pointer transition-colors"
            >
              Guardar en mi lista
            </button>
          </div>
        </form>
      )}

      {/* Buscador Simple */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por nombre o referencia..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Lista de Registros Anotados */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">No hay registros anotados todavía.</p>
            <p className="text-xs">Haz clic en "＋ Anotar Nueva Bombona" para empezar.</p>
          </div>
        ) : (
          filteredRecords.map((r, index) => {
            const bombonasTexto = r.bombonas
              .map((b) => `${b.qty}x ${b.weight} (${b.valve})`)
              .join(', ');

            return (
              <div
                key={r.id}
                className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <strong className="text-slate-900 font-black text-base md:text-lg">
                      {r.nombre}
                    </strong>
                    {r.apodoComunal && (
                      <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        ({r.apodoComunal})
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 font-bold pl-8">
                    🏷️ {bombonasTexto}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pl-8 font-medium">
                    <span>Monto: <strong className="text-slate-700">Bs. {r.monto?.toLocaleString('es-VE')}</strong></span>
                    <span>•</span>
                    <span>Ref: <strong className="text-slate-700">{r.ref || 'S/R'}</strong></span>
                  </div>
                </div>

                {/* Botón Borrar */}
                <div className="sm:self-center self-end pl-8 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar el registro de ${r.nombre}?`)) {
                        onDeleteRecord(r.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar de mi lista"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
