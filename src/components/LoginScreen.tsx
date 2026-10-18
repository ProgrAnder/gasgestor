import React, { useState } from 'react';
import type { UserSession, FontSizeMode } from '../types/gas.ts';
import { authenticateUser } from '../utils/gasLogic.ts';
import {
  Flame,
  Lock,
  User,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  fontSize: FontSizeMode;
  onChangeFontSize: (size: FontSizeMode) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  fontSize,
  onChangeFontSize,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = authenticateUser(username, password);
    if (result.success && result.session) {
      onLoginSuccess(result.session);
    } else {
      setErrorMessage(result.error || 'Usuario o contraseña incorrectos.');
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
    const result = authenticateUser(user, pass);
    if (result.success && result.session) {
      onLoginSuccess(result.session);
    }
  };

  const handleComunidadAccess = () => {
    onLoginSuccess({
      user: 'comunidad',
      role: 'comunidad',
      name: 'Vecino / Comunidad',
    });
  };

  const textSizeClass =
    fontSize === 'extragrande' ? 'text-xl' : fontSize === 'grande' ? 'text-lg' : 'text-base';
  const inputPaddingClass =
    fontSize === 'extragrande' ? 'p-4.5 text-xl' : fontSize === 'grande' ? 'p-4 text-lg' : 'p-3.5 text-base';

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{
        background: 'linear-gradient(150deg, #FDF4F5 0%, #F9FDF9 50%, #F4F8FF 100%)',
      }}
    >
      {/* Controles de accesibilidad superiores */}
      <div className="w-full max-w-lg flex items-center justify-between mb-5 px-2">
        <span className="text-slate-500 text-xs font-semibold tracking-wide">Tamaño de letra:</span>
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-[#F2D9DC] shadow-sm">
          <button
            type="button"
            onClick={() => onChangeFontSize('normal')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              fontSize === 'normal'
                ? 'bg-[#F2D9DC] text-slate-800 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            A Normal
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize('grande')}
            className={`px-3 py-1 rounded-xl text-sm font-bold cursor-pointer transition-all ${
              fontSize === 'grande'
                ? 'bg-[#F2D9DC] text-slate-800 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            A+ Grande
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize('extragrande')}
            className={`px-3 py-1 rounded-xl text-base font-extrabold cursor-pointer transition-all ${
              fontSize === 'extragrande'
                ? 'bg-[#F2D9DC] text-slate-800 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            A++ Mayor
          </button>
        </div>
      </div>

      {/* Tarjeta Principal de Inicio de Sesión */}
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-7 md:p-10 space-y-6 border border-[#F2D9DC]/60 animate-slide-up"
        style={{ boxShadow: '0 16px 56px 0 rgba(0,0,0,0.10)' }}
      >
        {/* Logo y Encabezado */}
        <div className="text-center space-y-3">
          <div
            className="w-18 h-18 rounded-3xl mx-auto flex items-center justify-center shadow-md"
            style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
            }}
          >
            <Flame className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl font-black text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            GasGestor
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Sistema Comunal de Control de Bombonas
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 animate-bounce-short">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-semibold text-sm md:text-base">{errorMessage}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo Usuario */}
          <div>
            <label
              htmlFor="login-username"
              className={`block font-bold text-slate-700 mb-1.5 ${textSizeClass}`}
            >
              Usuario:
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: admin, cobrador, verificador"
                className={`w-full pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:border-[#F2D9DC] focus:ring-2 focus:ring-[#F2D9DC]/50 focus:outline-none transition-all ${inputPaddingClass}`}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="login-password"
              className={`block font-bold text-slate-700 mb-1.5 ${textSizeClass}`}
            >
              Contraseña:
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su clave (ej: 123)"
                className={`w-full pl-12 pr-12 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:border-[#F2D9DC] focus:ring-2 focus:ring-[#F2D9DC]/50 focus:outline-none transition-all ${inputPaddingClass}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            className="w-full py-4 font-black text-xl rounded-2xl shadow-md cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 text-white"
            style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%)' }}
          >
            <LogIn className="w-6 h-6" />
            <span>Ingresar al Sistema</span>
          </button>

        </form>

        {/* Separador */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white px-2">
            O para Vecinos
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Botón de Acceso Comunitario SIN Contraseña */}
        <div>
          <button
            type="button"
            onClick={handleComunidadAccess}
            className="w-full py-4 font-black text-lg md:text-xl rounded-2xl shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3 text-white"
            style={{ background: 'linear-gradient(135deg, #15803D 0%, #16A34A 100%)' }}
          >
            <Users className="w-6 h-6" />
            <span>Acceso Vecinos / Comunidad (Sin Clave)</span>
          </button>
          <p className="text-center text-xs text-slate-400 font-medium mt-2">
            Los vecinos no necesitan contraseña; solo escriben su nombre para consultar el estatus.
          </p>
        </div>

        {/* Atajos Rápidos de Prueba para Mamá / Equipo */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            Atajos de Prueba (1 toque):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('cobrador', '123')}
              className="p-2.5 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-blue-800 font-bold text-xs text-center cursor-pointer transition-colors"
            >
              👤 Cobrador
              <span className="block text-2xs text-blue-500 font-mono mt-0.5">clave: 123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('verificador', '123')}
              className="p-2.5 rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-indigo-800 font-bold text-xs text-center cursor-pointer transition-colors"
            >
              🏦 Verificador
              <span className="block text-2xs text-indigo-500 font-mono mt-0.5">clave: 123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '123')}
              className="p-2.5 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] text-amber-800 font-bold text-xs text-center cursor-pointer transition-colors"
            >
              👑 Administrador
              <span className="block text-2xs text-amber-600 font-mono mt-0.5">clave: 123</span>
            </button>
          </div>
        </div>

      </div>

      <p className="text-slate-400 text-xs font-medium mt-6 text-center">
        GasGestor • Desarrollado para organizar las jornadas comunales de gas sin cuaderno ni enredos.
      </p>

    </div>
  );
};
