import React from 'react';
import type { CylinderItem, CylinderWeight, CylinderValve } from '../types/gas.ts';
import { Plus, Trash2, Fuel } from 'lucide-react';

interface CylinderSelectorProps {
  cylinders: CylinderItem[];
  onChange: (cylinders: CylinderItem[]) => void;
  fontSize: 'normal' | 'grande' | 'extragrande';
}

const WEIGHT_OPTIONS: { value: CylinderWeight; label: string; badge: string }[] = [
  { value: '10kg', label: '10 kg (Pequeña)', badge: 'bg-blue-100 text-blue-800' },
  { value: '18kg', label: '18 kg (Mediana)', badge: 'bg-indigo-100 text-indigo-800' },
  { value: '27kg', label: '27 kg (Grande)', badge: 'bg-purple-100 text-purple-800' },
  { value: '43kg', label: '43 kg (Industrial)', badge: 'bg-rose-100 text-rose-800' },
];

const VALVE_OPTIONS: { value: CylinderValve; label: string }[] = [
  { value: 'Rosca', label: 'Rosca (Tradicional)' },
  { value: 'Clip-on', label: 'Clip-on (Presión)' },
  { value: 'AutoGas', label: 'AutoGas (Vehicular/Especial)' },
];

export const CylinderSelector: React.FC<CylinderSelectorProps> = ({
  cylinders,
  onChange,
  fontSize,
}) => {
  const addCylinder = () => {
    const newItem: CylinderItem = {
      id: 'cyl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      weight: '18kg',
      valve: 'Rosca',
      qty: 1,
    };
    onChange([...cylinders, newItem]);
  };

  const removeCylinder = (index: number) => {
    if (cylinders.length <= 1) return;
    const updated = cylinders.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateCylinder = (index: number, field: keyof CylinderItem, value: any) => {
    const updated = cylinders.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const textSizeClass =
    fontSize === 'extragrande'
      ? 'text-xl'
      : fontSize === 'grande'
      ? 'text-lg'
      : 'text-base';

  const btnPaddingClass =
    fontSize === 'extragrande'
      ? 'p-4 text-xl'
      : fontSize === 'grande'
      ? 'p-3 text-lg'
      : 'p-2.5 text-base';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`font-bold text-slate-800 flex items-center gap-2 ${textSizeClass}`}>
          <Fuel className="w-5 h-5 text-blue-700" />
          Bombonas a solicitar ({cylinders.reduce((acc, c) => acc + (c.qty || 1), 0)} en total):
        </label>
        <button
          type="button"
          onClick={addCylinder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          + Agregar otra bombona
        </button>
      </div>

      <div className="space-y-3">
        {cylinders.map((cyl, idx) => (
          <div
            key={cyl.id || idx}
            className="p-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center shadow-xs"
          >
            <div className="flex items-center gap-2 text-slate-700 font-bold min-w-16">
              <span className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm">
                #{idx + 1}
              </span>
              <span className="text-sm text-slate-500 md:hidden">Bombona</span>
            </div>

            {/* Selector de Peso */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Capacidad / Peso:
              </label>
              <select
                aria-label={`Capacidad de bombona #${idx + 1}`}
                value={cyl.weight}
                onChange={(e) => updateCylinder(idx, 'weight', e.target.value as CylinderWeight)}
                className={`w-full bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-800 focus:border-blue-600 focus:outline-none ${btnPaddingClass}`}
              >
                {WEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Pico / Válvula */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tipo de Válvula / Pico:
              </label>
              <select
                aria-label={`Tipo de válvula de bombona #${idx + 1}`}
                value={cyl.valve}
                onChange={(e) => updateCylinder(idx, 'valve', e.target.value as CylinderValve)}
                className={`w-full bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-800 focus:border-blue-600 focus:outline-none ${btnPaddingClass}`}
              >
                {VALVE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad con botones táctiles grandes + y - */}
            <div className="w-full md:w-36">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Cantidad:
              </label>
              <div className="flex items-center border-2 border-slate-300 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  aria-label={`Disminuir cantidad de bombona #${idx + 1}`}
                  onClick={() => updateCylinder(idx, 'qty', Math.max(1, (cyl.qty || 1) - 1))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg transition-colors cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  aria-label={`Cantidad de bombonas #${idx + 1}`}
                  min="1"
                  max="20"
                  value={cyl.qty}
                  onChange={(e) =>
                    updateCylinder(idx, 'qty', Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full text-center font-extrabold text-slate-800 text-lg border-none focus:outline-none py-1"
                />
                <button
                  type="button"
                  aria-label={`Aumentar cantidad de bombona #${idx + 1}`}
                  onClick={() => updateCylinder(idx, 'qty', (cyl.qty || 1) + 1)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Eliminar fila si hay más de 1 */}
            {cylinders.length > 1 && (
              <div className="flex items-end justify-end md:self-end pb-0.5">
                <button
                  type="button"
                  aria-label={`Quitar bombona #${idx + 1}`}
                  onClick={() => removeCylinder(idx)}
                  className="p-2.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                  title="Quitar esta bombona"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
