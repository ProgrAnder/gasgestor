import React from 'react';
import type { UserRole, FontSizeMode, UserSession } from '../types/gas.ts';
import {
  Flame,
  Users,
  UserCheck,
  ShieldCheck,
  Printer,
  HeartHandshake,
  RotateCcw,
  LogOut,
  User,
} from 'lucide-react';

interface HeaderProps {
  session: UserSession;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  fontSize: FontSizeMode;
  onChangeFontSize: (size: FontSizeMode) => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  currentRole,
  onSelectRole,
  fontSize,
  onChangeFontSize,
  onResetData,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">

        {/* Fila Superior: Logo, Usuario y Accesibilidad */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Logo y Nombre Principal */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div
              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-sm transform hover:scale-105 transition-transform flex-shrink-0"
              style={{ background: '#F2D9DC' }}
            >
              <Flame className="w-6 h-6 md:w-7 md:h-7 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1
                  className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  GasGestor
                </h1>
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: '#D9F2D8', color: '#15803D' }}
                >
                  Comunal
                </span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-medium">
                Organización de Bombonas • Claro, rápido y digital
              </p>
            </div>
          </div>

          {/* Información del Usuario Activo, Accesibilidad y Cerrar Sesión */}
          <div className="flex items-center flex-wrap justify-center gap-2">

            {/* Tarjeta de Usuario y Rol */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs"
              style={{ background: '#FDF8F8', borderColor: '#F2D9DC' }}
            >
              <User className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400 block" style={{ fontSize: '10px' }}>Usuario:</span>
                <strong className="text-slate-800 font-bold">{session.name}</strong>
              </div>
              <span
                className="text-xs font-black px-1.5 py-0.5 rounded-full uppercase ml-1"
                style={{ background: '#F2D9DC', color: '#9F1239' }}
              >
                {session.role}
              </span>
            </div>

            {/* Controles de Letra */}
            <div
              className="flex items-center gap-1 p-1 rounded-2xl border"
              style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}
            >
              <span className="text-slate-400 font-semibold px-1" style={{ fontSize: '10px' }}>Letra:</span>
              <button
                type="button"
                onClick={() => onChangeFontSize('normal')}
                aria-label="Tamaño de letra normal"
                className={`px-2 py-1 rounded-xl cursor-pointer transition-all font-bold ${
                  fontSize === 'normal'
                    ? 'text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
                style={fontSize === 'normal' ? { background: '#F2D9DC', fontSize: '10px' } : { fontSize: '10px' }}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('grande')}
                aria-label="Tamaño de letra grande"
                className={`px-2 py-1 rounded-xl text-xs cursor-pointer transition-all font-bold ${
                  fontSize === 'grande'
                    ? 'text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
                style={fontSize === 'grande' ? { background: '#F2D9DC' } : {}}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('extragrande')}
                aria-label="Tamaño de letra extragrande"
                className={`px-2 py-1 rounded-xl text-sm cursor-pointer transition-all font-extrabold ${
                  fontSize === 'extragrande'
                    ? 'text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
                style={fontSize === 'extragrande' ? { background: '#F2D9DC' } : {}}
              >
                A++
              </button>
            </div>

            {/* Reiniciar Ejemplos */}
            <button
              type="button"
              onClick={onResetData}
              title="Restablecer ejemplos de prueba"
              className="text-xs font-medium text-slate-400 hover:text-slate-700 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            {/* Botón Cerrar Sesión */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all hover:opacity-90"
              style={{ background: '#FFE4E6', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>

          </div>
        </div>

        {/* Barra de Selección de Vistas / Roles (Oculta para Mamá para máxima sencillez) */}
        {session.role !== 'mama' && (
          <nav
            className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-1 scrollbar-none"
            aria-label="Selección de modo y rol"
          >
            {/* Vecinos / Comunidad */}
            <button
              type="button"
              onClick={() => onSelectRole('comunidad')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                currentRole === 'comunidad'
                  ? 'shadow-sm ring-2'
                  : 'hover:bg-slate-50 border-transparent'
              }`}
              style={
                currentRole === 'comunidad'
                  ? { background: '#DBEAFE', color: '#1E40AF', borderColor: '#BFDBFE', ringColor: '#BFDBFE' }
                  : { color: '#64748B', borderColor: 'transparent' }
              }
            >
              <Users className="w-4 h-4 text-current" />
              <span>1. Vecinos (Sin Clave)</span>
            </button>

            {/* Cobrador */}
            {(session.role === 'master' || session.role === 'cobrador') && (
              <button
                type="button"
                onClick={() => onSelectRole('cobrador')}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                  currentRole === 'cobrador'
                    ? 'shadow-sm ring-2'
                    : 'hover:bg-slate-50 border-transparent'
                }`}
                style={
                  currentRole === 'cobrador'
                    ? { background: '#F2D9DC', color: '#9F1239', borderColor: '#FECDD3' }
                    : { color: '#64748B', borderColor: 'transparent' }
                }
              >
                <UserCheck className="w-4 h-4 text-current" />
                <span>2. El Cobrador (Validar Datos)</span>
              </button>
            )}

            {/* Verificador de Banco */}
            {(session.role === 'master' || session.role === 'verificador') && (
              <button
                type="button"
                onClick={() => onSelectRole('verificador')}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                  currentRole === 'verificador'
                    ? 'shadow-sm ring-2'
                    : 'hover:bg-slate-50 border-transparent'
                }`}
                style={
                  currentRole === 'verificador'
                    ? { background: '#D9F2D8', color: '#14532D', borderColor: '#BBF7D0' }
                    : { color: '#64748B', borderColor: 'transparent' }
                }
              >
                <ShieldCheck className="w-4 h-4 text-current" />
                <span>3. Verificador (Banco)</span>
              </button>
            )}

            {/* Hoja de Impresión */}
            <button
              type="button"
              onClick={() => onSelectRole('master')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                currentRole === 'master'
                  ? 'shadow-sm ring-2'
                  : 'hover:bg-slate-50 border-transparent'
              }`}
              style={
                currentRole === 'master'
                  ? { background: '#FEF3C7', color: '#78350F', borderColor: '#FDE68A' }
                  : { color: '#64748B', borderColor: 'transparent' }
              }
            >
              <Printer className="w-4 h-4 text-current" />
              <span>Hoja de Impresión</span>
            </button>
          </nav>
        )}

      </div>
    </header>
  );
};
