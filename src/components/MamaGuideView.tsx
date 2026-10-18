import React from 'react';
import type { UserRole, FontSizeMode } from '../types/gas.ts';
import {
  Heart,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  UserCheck,
  Smartphone,
  Printer,
  MessageCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface MamaGuideViewProps {
  onSelectRole: (role: UserRole) => void;
  onResetData: () => void;
  fontSize: FontSizeMode;
}

export const MamaGuideView: React.FC<MamaGuideViewProps> = ({
  onSelectRole,
  onResetData,
  fontSize,
}) => {
  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. La Idea Principal */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 text-blue-950 p-6 md:p-8 rounded-3xl shadow-lg border-4 border-amber-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-md">
            <Heart className="w-7 h-7 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              Punto 1 • El Resumen Corto
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-['Outfit']">
              La Idea Principal para Explicarle a Mamá
            </h2>
          </div>
        </div>

        <blockquote className="bg-white/90 backdrop-blur-sm p-5 md:p-6 rounded-2xl border-2 border-amber-600/30 text-blue-950 font-extrabold text-lg md:text-xl leading-relaxed shadow-sm">
          “Mamá, estoy creando esta página web para que dejemos de usar el cuaderno y el lápiz al organizar el cobro de las bombonas. Con esta herramienta, todo queda guardado en el teléfono de forma clara, evitamos enredos con el dinero o las referencias, y los vecinos pueden saber el estado de su pago sin necesidad de estar llamando o preguntando a cada rato.”
        </blockquote>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            onClick={() => onSelectRole('comunidad')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-xl font-black text-sm md:text-base cursor-pointer shadow-md transition-colors"
          >
            <Play className="w-4 h-4 text-amber-400" />
            <span>Ver cómo lo ven los Vecinos</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectRole('cobrador')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-blue-950 rounded-xl font-black text-sm md:text-base cursor-pointer shadow-md transition-colors"
          >
            <UserCheck className="w-5 h-5 text-blue-700" />
            <span>Ver pantalla del Cobrador</span>
          </button>
        </div>
      </section>

      {/* 2. Puntos Clave para Explicarle (Paso a Paso) */}
      <section className="bg-white border-3 border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b-2 border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Punto 2 • Paso a Paso
          </span>
          <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            Puntos Clave para Explicarle
          </h3>
        </div>

        {/* A. ¿Por qué es mejor que el cuaderno? */}
        <div className="space-y-4">
          <h4 className="text-lg md:text-xl font-black text-blue-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>A. ¿Por qué es mejor que el cuaderno de papel?</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>No se pierden las cuentas</span>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Todo queda guardado automáticamente en la aplicación. Si el teléfono se apaga o se cierra, no se borra nada.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Sin enredos de dinero</span>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Separa el trabajo en pasos claros: primero anotas, luego el banco valida, y al final queda aprobado.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Letras grandes y fácil de usar</span>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                La pantalla está diseñada con botones grandes y letras claras, pensada para que personas mayores puedan usarla sin complicaciones táctiles.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Sin cédulas ni direcciones complejas</span>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Cada vecino se anota simplemente con su Nombre completo (por ejemplo: Pepe Pérez), haciéndolo rápido y sin trabas.
              </p>
            </div>

          </div>
        </div>

        {/* B. ¿Cómo trabajaremos entre todos? (Los Roles) */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-200">
          <h4 className="text-lg md:text-xl font-black text-blue-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>B. ¿Cómo trabajaremos entre todos? (Roles y Checks Claros)</span>
          </h4>

          <div className="space-y-3">
            
            {/* Comunidad */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col md:flex-row gap-3 items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded">
                  La Comunidad (Los Vecinos)
                </span>
                <h5 className="font-black text-emerald-950 text-base md:text-lg mt-1">
                  Acceso Sin Clave y Búsqueda por Nombre o Apodo
                </h5>
                <p className="text-emerald-900 text-sm mt-1">
                  Los vecinos entran sin contraseña. Si María Páez entra y escribe "María Páez" o "María Mario" (su apodo en el barrio), la app la encuentra igual. Solo ven 3 estados claros: <strong>Pendiente por revisar</strong>, <strong>Por revisión</strong> o <strong>Aprobado</strong> (y alerta en rojo si tiene algún inconveniente).
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('comunidad')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Ver pantalla Vecinos →
              </button>
            </div>

            {/* Cobrador */}
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col md:flex-row gap-3 items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                  El Cobrador (Atención al Vecino)
                </span>
                <h5 className="font-black text-blue-950 text-base md:text-lg mt-1">
                  Recepción de Datos y Check 1 (Validar datos)
                </h5>
                <p className="text-blue-900 text-sm mt-1">
                  Recibe el pago o datos por WhatsApp o en persona. Comprueba que el monto y la referencia estén bien anotados y presiona <strong>Check 1: Validar datos</strong>. En su pantalla solo verá si el extracto bancario ya coincide (<strong>Verificado por el extracto bancario</strong>) o si sigue <strong>Pendiente por verificar</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('cobrador')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Ver pantalla Cobrador →
              </button>
            </div>

            {/* Verificador */}
            <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col md:flex-row gap-3 items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded">
                  El Verificador (Banco)
                </span>
                <h5 className="font-black text-indigo-950 text-base md:text-lg mt-1">
                  Check 2: Verificación bancaria y Check 3: Verificación manual
                </h5>
                <p className="text-indigo-900 text-sm mt-1">
                  Pega el extracto del banco para que la app valide automáticamente las referencias (<strong>Check 2: Verificación bancaria</strong>). Luego ella revisa en su cuenta y confirma con <strong>Check 3: Verificación manual</strong>. El verificador <em>no puede alterar el Check 1 del cobrador</em>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('verificador')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Ver pantalla Verificador →
              </button>
            </div>

            {/* Master */}
            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex flex-col md:flex-row gap-3 items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-purple-700 bg-purple-200 px-2 py-0.5 rounded">
                  El Administrador Master
                </span>
                <h5 className="font-black text-purple-950 text-base md:text-lg mt-1">
                  Control Total y Corrección General
                </h5>
                <p className="text-purple-900 text-sm mt-1">
                  El Master tiene permisos para editar y corregir cualquier check (Cobrador, Banco o Manual), resolver inconvenientes, modificar referencias y exportar la lista de respaldo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('master')}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Ver Lista General Master →
              </button>
            </div>

          </div>
        </div>

        {/* C. ¿Cómo será la fase de prueba? */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-200">
          <h4 className="text-lg md:text-xl font-black text-blue-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span>C. ¿Cómo será la fase de prueba?</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-blue-600 font-black text-sm block mb-1">1. Primero probamos nosotros</span>
              <p className="text-xs text-slate-600">
                Haremos pruebas anotando 3 o 4 ejemplos ficticios (como Pepe Pérez) para que veas lo fácil que es presionar los botones y revisar las listas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-blue-600 font-black text-sm block mb-1">2. Uso en paralelo</span>
              <p className="text-xs text-slate-600">
                Durante las primeras jornadas, podemos seguir anotando en papel con la <strong>"Lista para Cuaderno"</strong> mientras nos acostumbramos a la aplicación para asegurarnos de que no haya fallas ni dudas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-blue-600 font-black text-sm block mb-1">3. Mejoras continuas</span>
              <p className="text-xs text-slate-600">
                Cualquier cosa que te parezca difícil o confusa, me la dices y yo cambio el programa al instante para adaptarlo a lo que tú necesites.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Guion de Conversación */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md border-3 border-slate-700 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <MessageCircle className="w-6 h-6" />
          <h3 className="text-xl md:text-2xl font-black font-['Outfit']">
            3. Guion de Conversación (Ejemplo de lo que le puedes decir)
          </h3>
        </div>

        <blockquote className="bg-slate-800/90 p-5 md:p-6 rounded-2xl border-l-4 border-amber-400 text-slate-100 text-base md:text-lg leading-relaxed font-medium">
          “Mira mamá, para la próxima jornada de gas no vamos a tener que estar revisando página por página del cuaderno a ver quién pagó y quién falta. Yo hice un sistema donde la persona que cobra anota a Pepe con sus 2 bombonas de 18kg. Luego la persona del banco pega el estado de cuenta y la aplicación valida sola si la referencia coincide. Así tú solo tienes que ver en la pantalla quién está listo y quién tiene algún problema de pago, todo con letra grande y sin enredos.”
        </blockquote>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Cargar / Reiniciar 4 Ejemplos de Prueba Ficticios</span>
          </button>
        </div>
      </section>

    </div>
  );
};
