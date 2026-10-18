import React, { useState } from 'react';
import type { GasRecord, CylinderItem, PaymentMethod, FontSizeMode } from '../types/gas.ts';
import { getCommunityStatus, normalizeSearch } from '../utils/gasLogic.ts';
import { CylinderSelector } from './CylinderSelector.tsx';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Fuel,
  Send,
  Building2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface CommunityViewProps {
  records: GasRecord[];
  onAddRecord: (newRecord: Omit<GasRecord, 'id' | 'fechaRegistro'>) => void;
  fontSize: FontSizeMode;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  records,
  onAddRecord,
  fontSize,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Formulario de auto-registro
  const [nombre, setNombre] = useState('');
  const [ref, setRef] = useState('');
  const [monto, setMonto] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pago_movil');
  const [cylinders, setCylinders] = useState<CylinderItem[]>([
    { id: 'c-1', weight: '18kg', valve: 'Rosca', qty: 1 },
  ]);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const cleanQuery = normalizeSearch(searchQuery);
  const searchResults = cleanQuery
    ? records.filter((r) => normalizeSearch(r.nombre).includes(cleanQuery))
    : [];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !ref.trim() || !monto.trim()) {
      alert('Por favor ingrese su Nombre completo, Referencia y Monto.');
      return;
    }

    const numMonto = parseFloat(monto.replace(',', '.'));
    if (isNaN(numMonto) || numMonto <= 0) {
      alert('Ingrese un monto válido en Bolívares (Bs.).');
      return;
    }

    onAddRecord({
      nombre: nombre.trim(),
      bombonas: cylinders,
      ref: ref.trim(),
      monto: numMonto,
      paymentMethod,
      check1_cobrador: false,
      check2_banco: false,
      check2_manual: false,
      tieneInconveniente: false,
      notas: 'Registrado por el vecino desde el teléfono.',
    });

    setFormSuccessMessage(`¡Listo, ${nombre}! Tu pago de Bs. ${numMonto.toFixed(2)} fue recibido en el sistema.`);
    setNombre('');
    setRef('');
    setMonto('');
    setCylinders([{ id: 'c-1', weight: '18kg', valve: 'Rosca', qty: 1 }]);
    setShowRegisterForm(false);
    setSearchQuery(nombre.trim());

    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 8000);
  };

  const titleSizeClass =
    fontSize === 'extragrande' ? 'text-2xl' : fontSize === 'grande' ? 'text-xl' : 'text-lg';
  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';
  const inputPaddingClass =
    fontSize === 'extragrande' ? 'p-5 text-xl' : fontSize === 'grande' ? 'p-4 text-lg' : 'p-3.5 text-base';

  return (
    <div className="space-y-6">
      
      {/* Alerta de éxito si se registró */}
      {formSuccessMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-4 md:p-5 rounded-2xl flex items-start gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-lg md:text-xl text-emerald-900">
              ¡Comprobante Registrado con Éxito!
            </h4>
            <p className={`mt-1 font-medium ${textSizeClass}`}>{formSuccessMessage}</p>
            <p className="mt-1 text-sm text-emerald-800">
              El cobrador revisará tus datos y pasará al banco. Puedes consultar aquí cuando gustes.
            </p>
          </div>
        </div>
      )}

      {/* Tarjeta de Consulta Rápida para Vecinos */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-5 md:p-7 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Consulta Vecinal Sin Clave
          </span>
          <h2 className={`font-black text-slate-900 font-['Outfit'] ${fontSize === 'extragrande' ? 'text-3xl' : 'text-2xl md:text-3xl'}`}>
            ¿Cómo va el pago de mi bombona?
          </h2>
          <p className={`text-slate-600 mt-2 font-medium ${textSizeClass}`}>
            Escribe tu nombre para saber en qué etapa está tu bombona: <strong>Pendiente por revisar</strong>, <strong>Por revisión</strong> o <strong>Aprobado</strong>.
          </p>
        </div>

        {/* Buscador grande */}
        <div className="relative max-w-xl mx-auto">
          <label htmlFor="vecino-search" className="sr-only">
            Buscar por Nombre Completo
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
          <input
            id="vecino-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Escribe tu Nombre Completo (Ej: María Páez o Pepe Pérez)..."
            className={`w-full pl-13 pr-4 rounded-2xl border-3 border-blue-600 bg-white font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm ${inputPaddingClass}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold px-2 py-1 text-sm rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Atajos rápidos para probar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-500">
          <span>O presiona para ver ejemplos:</span>
          {['María Páez', 'Pepe Pérez', 'Carlos Ruiz', 'José Antonio Silva'].map((nombreEjemplo) => (
            <button
              key={nombreEjemplo}
              type="button"
              onClick={() => setSearchQuery(nombreEjemplo)}
              className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              {nombreEjemplo}
            </button>
          ))}
        </div>

        {/* Resultados de la Búsqueda */}
        <div className="mt-6 max-w-3xl mx-auto space-y-4">
          {searchQuery && searchResults.length === 0 && (
            <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center text-amber-900">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <p className={`font-bold ${textSizeClass}`}>
                No encontramos ningún registro con "{searchQuery}".
              </p>
              <p className="text-sm text-amber-800 mt-1">
                Verifica la ortografía o registra tu pago con el botón verde de abajo.
              </p>
            </div>
          )}

          {searchResults.map((rec) => {
            const commStatus = getCommunityStatus(rec);
            return (
              <div
                key={rec.id}
                className={`border-3 rounded-3xl p-5 md:p-6 shadow-sm transition-all ${
                  commStatus.status === 'inconveniente'
                    ? 'bg-red-50/60 border-red-400'
                    : commStatus.status === 'aprobado'
                    ? 'bg-emerald-50/40 border-emerald-400'
                    : 'bg-slate-50 border-slate-300'
                }`}
              >
                {/* Cabecera del vecino: Únicamente Nombre Oficial/Real (el apodo es interno para el equipo) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Vecino anotado
                    </span>
                    <h3 className={`font-black text-slate-900 ${titleSizeClass}`}>
                      {rec.nombre}
                    </h3>
                  </div>

                  <div className="inline-block">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black border-2 ${commStatus.badgeClass} ${textSizeClass}`}>
                      {commStatus.status === 'aprobado' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      )}
                      {commStatus.status === 'por_revision' && (
                        <Clock className="w-5 h-5 text-amber-700" />
                      )}
                      {commStatus.status === 'pendiente' && (
                        <Clock className="w-5 h-5 text-orange-700" />
                      )}
                      {commStatus.status === 'inconveniente' && (
                        <AlertTriangle className="w-5 h-5 text-red-700" />
                      )}
                      {commStatus.label}
                    </span>
                  </div>
                </div>

                {/* Explicación en lenguaje claro para la comunidad */}
                <div className={`my-4 p-4 rounded-2xl border shadow-2xs ${
                  commStatus.status === 'inconveniente'
                    ? 'bg-red-100/70 border-red-300 text-red-950 font-extrabold'
                    : 'bg-white border-slate-200 text-slate-800 font-bold'
                }`}>
                  <p className={textSizeClass}>{commStatus.description}</p>
                </div>

                {/* Progreso visual simplificado para la comunidad: 3 pasos */}
                {commStatus.status !== 'inconveniente' && (
                  <div className="my-5">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-2">
                      Estado del Trámite:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      
                      {/* Estado 1: Pendiente por revisar */}
                      <div className={`p-3 rounded-xl border text-center ${
                        commStatus.status === 'pendiente'
                          ? 'bg-orange-100 border-orange-400 text-orange-950 font-black ring-2 ring-orange-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        <div className="text-xs text-slate-500">Etapa 1</div>
                        <div className="text-xs sm:text-sm font-extrabold">Pendiente por revisar</div>
                      </div>

                      {/* Estado 2: Por revisión */}
                      <div className={`p-3 rounded-xl border text-center ${
                        commStatus.status === 'por_revision'
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-black ring-2 ring-amber-300'
                          : commStatus.status === 'aprobado'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        <div className="text-xs text-slate-500">Etapa 2</div>
                        <div className="text-xs sm:text-sm font-extrabold">Por revisión</div>
                      </div>

                      {/* Estado 3: Aprobado */}
                      <div className={`p-3 rounded-xl border text-center ${
                        commStatus.status === 'aprobado'
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        <div className="text-xs text-slate-500">Etapa 3</div>
                        <div className="text-xs sm:text-sm font-extrabold">¡Aprobado!</div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Detalles del pedido */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2 text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Fuel className="w-4 h-4 text-blue-600" />
                    <span>Bombonas registradas:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.bombonas.map((b, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-extrabold"
                      >
                        {b.qty}x {b.weight} (Pico {b.valve})
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-500 text-xs block">Referencia:</span>
                      <span className="font-mono font-extrabold text-base text-slate-900">{rec.ref}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 text-xs block">Monto Pagado:</span>
                      <span className="font-extrabold text-base text-slate-900">
                        Bs. {rec.monto.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Botón para abrir el formulario de registro */}
      <div className="text-center">
        {!showRegisterForm ? (
          <button
            type="button"
            onClick={() => setShowRegisterForm(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-lg md:text-xl shadow-md transition-all cursor-pointer transform hover:scale-[1.01]"
          >
            <Send className="w-6 h-6" />
            <span>¿Hiciste tu pago? Haz clic aquí para anotarte</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowRegisterForm(false)}
            className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer text-sm"
          >
            Ocultar formulario de registro
          </button>
        )}
      </div>

      {/* Formulario de Auto-Registro Comunal */}
      {showRegisterForm && (
        <section className="bg-white border-3 border-emerald-500 rounded-3xl p-5 md:p-8 shadow-lg max-w-2xl mx-auto">
          <div className="border-b-2 border-slate-200 pb-4 mb-5">
            <h3 className={`font-black text-slate-900 font-['Outfit'] ${titleSizeClass}`}>
              Registrar Pago de Bombona
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Llena los datos tal como aparecen en tu comprobante bancario.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            {/* Nombre completo */}
            <div>
              <label htmlFor="form-nombre" className={`block font-extrabold text-slate-900 mb-2 ${textSizeClass}`}>
                Tu Nombre Completo:
              </label>
              <input
                id="form-nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ejemplo: María Páez"
                className={`w-full rounded-xl border-2 border-slate-300 font-bold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
              />
            </div>

            {/* Selector de Bombonas */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <CylinderSelector
                cylinders={cylinders}
                onChange={setCylinders}
                fontSize={fontSize}
              />
            </div>

            {/* Método de Pago */}
            <div>
              <label className={`block font-extrabold text-slate-900 mb-2 ${textSizeClass}`}>
                Forma en que pagaste:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pago_movil', label: 'Pago Móvil' },
                  { id: 'transferencia', label: 'Transferencia' },
                  { id: 'efectivo', label: 'Efectivo' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3 rounded-xl border-2 font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Número de Referencia */}
            <div>
              <label htmlFor="form-ref" className={`block font-extrabold text-slate-900 mb-2 ${textSizeClass}`}>
                Número de Referencia Bancaria:
              </label>
              <input
                id="form-ref"
                type="text"
                required
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Ej: 987654 (los últimos 6 u 8 dígitos)"
                className={`w-full rounded-xl border-2 border-slate-300 font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
              />
            </div>

            {/* Monto en Bolívares */}
            <div>
              <label htmlFor="form-monto" className={`block font-extrabold text-slate-900 mb-2 ${textSizeClass}`}>
                Monto Pagado en Bolívares (Bs.):
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">
                  Bs.
                </span>
                <input
                  id="form-monto"
                  type="number"
                  step="0.01"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 850.00"
                  className={`w-full pl-14 pr-4 rounded-xl border-2 border-slate-300 font-extrabold text-slate-900 focus:border-blue-600 focus:outline-none ${inputPaddingClass}`}
                />
              </div>
            </div>

            {/* Botón de Enviar */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full p-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-md cursor-pointer transition-colors"
              >
                Enviar Registro de Pago
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Información de Cuentas Comunitarias para Pago */}
      <section className="bg-blue-50/80 border-2 border-blue-200 rounded-3xl p-5 md:p-6 text-slate-800">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-lg mb-2">
          <Building2 className="w-5 h-5 text-blue-700" />
          <span>Datos Bancarios de la Jornada Comunal</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Ten estos datos a mano para realizar tu Pago Móvil o Transferencia antes de registrar el número de referencia:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-medium text-sm">
          <div className="bg-white p-3 rounded-xl border border-blue-200">
            <span className="text-xs text-slate-500 block font-bold">Banco:</span>
            <strong className="text-slate-900">Banco de Venezuela (0102) / Banesco (0134)</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-200">
            <span className="text-xs text-slate-500 block font-bold">Pago Móvil:</span>
            <strong className="text-slate-900">Teléfono: 0414-1234567 • C.I: V-12.345.678</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-200">
            <span className="text-xs text-slate-500 block font-bold">Concepto sugerido:</span>
            <strong className="text-slate-900">Gas [Tu Nombre Completo]</strong>
          </div>
        </div>
      </section>

    </div>
  );
};
