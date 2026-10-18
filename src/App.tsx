import React, { useState, useEffect } from 'react';
import type { GasRecord, UserRole, FontSizeMode, UserSession } from './types/gas.ts';
import { SEED_RECORDS } from './utils/gasLogic.ts';
import { Header } from './components/Header.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { CommunityView } from './components/CommunityView.tsx';
import { CollectorView } from './components/CollectorView.tsx';
import { VerifierView } from './components/VerifierView.tsx';
import { PrintSheetView } from './components/PrintSheetView.tsx';
import { MamaGuideView } from './components/MamaGuideView.tsx';
import { CheckCircle2, AlertCircle, Info, HeartHandshake } from 'lucide-react';

export default function App() {
  // Estado de Sesión de Usuario
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const savedSession = localStorage.getItem('gasgestor_session');
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch (e) {
      console.error('Error loading session:', e);
    }
    return null;
  });

  // Registros de Bombonas
  const [records, setRecords] = useState<GasRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gasgestor_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved records:', e);
    }
    return SEED_RECORDS;
  });

  // Rol activo para visualización
  const [currentRole, setCurrentRole] = useState<UserRole>('comunidad');

  // Tamaño de fuente para accesibilidad
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    return (localStorage.getItem('gasgestor_fontsize') as FontSizeMode) || 'normal';
  });

  // Mensajes Toast temporales
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gasgestor_records', JSON.stringify(records));
    } catch (e) {
      console.error('Error saving records:', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('gasgestor_fontsize', fontSize);
    } catch (e) {
      console.error('Error saving fontsize:', e);
    }
  }, [fontSize]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem('gasgestor_session', JSON.stringify(newSession));
    } catch (e) {
      console.error('Error saving session:', e);
    }

    // Configurar la vista correspondiente según el rol
    if (newSession.role === 'cobrador') {
      setCurrentRole('cobrador');
    } else if (newSession.role === 'verificador') {
      setCurrentRole('verificador');
    } else if (newSession.role === 'master') {
      setCurrentRole('cobrador');
    } else {
      setCurrentRole('comunidad');
    }

    showToast(`Bienvenido/a, ${newSession.name}.`, 'success');
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem('gasgestor_session');
    } catch (e) {
      console.error('Error clearing session:', e);
    }
    showToast('Sesión cerrada correctamente.', 'info');
  };

  const handleAddRecord = (newRecord: Omit<GasRecord, 'id' | 'fechaRegistro'>) => {
    const record: GasRecord = {
      ...newRecord,
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      fechaRegistro: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setRecords((prev) => [record, ...prev]);
    showToast(`Registro guardado para ${record.nombre}.`, 'success');
  };

  const handleToggleCheck1 = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.check1_cobrador;
          showToast(
            next
              ? `Datos validados para ${r.nombre}.`
              : `Validación de datos retirada para ${r.nombre}.`,
            'info'
          );
          return { ...r, check1_cobrador: next };
        }
        return r;
      })
    );
  };

  const handleToggleCheck2Manual = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.check2_manual;
          showToast(
            next
              ? `Check Manual aprobado para ${r.nombre}.`
              : `Check Manual retirado para ${r.nombre}.`,
            'info'
          );
          return { ...r, check2_manual: next };
        }
        return r;
      })
    );
  };

  const handleToggleCheck2Banco = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.check2_banco;
          showToast(
            next
              ? `Check Banco activado manualmente para ${r.nombre}.`
              : `Check Banco desactivado para ${r.nombre}.`,
            'info'
          );
          return { ...r, check2_banco: next };
        }
        return r;
      })
    );
  };

  const handleSetInconveniente = (id: string, tieneInconveniente: boolean, motivo?: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(
            tieneInconveniente
              ? `Inconveniente reportado para ${r.nombre}.`
              : `Inconveniente resuelto para ${r.nombre}.`,
            tieneInconveniente ? 'error' : 'success'
          );
          return {
            ...r,
            tieneInconveniente,
            motivoInconveniente: tieneInconveniente ? motivo : undefined,
          };
        }
        return r;
      })
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Registro eliminado.', 'info');
  };

  const handleResetData = () => {
    if (confirm('¿Restablecer la lista con los 5 ejemplos de prueba iniciales (María Páez/María Mario, Pepe Pérez, etc.)?')) {
      setRecords(SEED_RECORDS);
      showToast('Se han restablecido los 5 ejemplos ficticios de prueba.', 'success');
    }
  };

  // Si no hay sesión iniciada, mostrar la pantalla de Login
  if (!session) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />
    );
  }

  // Clases dinámicas de fuente en el contenedor raíz
  const rootFontClass =
    fontSize === 'extragrande'
      ? 'text-lg'
      : fontSize === 'grande'
      ? 'text-base'
      : 'text-sm sm:text-base';

  const isMaster = session.role === 'master';

  return (
    <div className={`min-h-screen bg-[#FDF8F8] flex flex-col ${rootFontClass}`}>

      {/* Toast Notification — Friendly Design */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-bounce-short">
          <div
            className="p-4 rounded-3xl shadow-xl flex items-center gap-3 border"
            style={
              toast.type === 'success'
                ? { background: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' }
                : toast.type === 'error'
                ? { background: '#FFF1F2', color: '#DC2626', borderColor: '#FECDD3' }
                : { background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }
            }
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#16A34A' }} />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#DC2626' }} />}
            {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" style={{ color: '#2563EB' }} />}
            <span className="font-bold text-sm md:text-base">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Cabecera Principal con Sesión Activa */}
      <Header
        session={session}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 md:py-6">

        {/* Banner Estadístico Rápido */}
        {currentRole !== 'guia_mama' && (
          <StatsCards records={records} fontSize={fontSize} />
        )}

        {/* Vistas según Rol Activo */}
        {currentRole === 'comunidad' && (
          <CommunityView
            records={records}
            onAddRecord={handleAddRecord}
            fontSize={fontSize}
          />
        )}

        {currentRole === 'cobrador' && (
          <CollectorView
            records={records}
            onAddRecord={handleAddRecord}
            onToggleCheck1={handleToggleCheck1}
            onSetInconveniente={handleSetInconveniente}
            onDeleteRecord={handleDeleteRecord}
            fontSize={fontSize}
            isMaster={isMaster}
          />
        )}

        {currentRole === 'verificador' && (
          <VerifierView
            records={records}
            onUpdateRecords={(updated) => {
              setRecords(updated);
              showToast('Extracto bancario procesado y actualizado.', 'success');
            }}
            onToggleCheck2Manual={handleToggleCheck2Manual}
            onToggleCheck2Banco={handleToggleCheck2Banco}
            onToggleCheck1={isMaster ? handleToggleCheck1 : undefined}
            onSetInconveniente={handleSetInconveniente}
            fontSize={fontSize}
            isMaster={isMaster}
          />
        )}

        {currentRole === 'master' && (
          <PrintSheetView records={records} fontSize={fontSize} />
        )}

        {currentRole === 'guia_mama' && (
          <MamaGuideView
            onSelectRole={setCurrentRole}
            onResetData={handleResetData}
            fontSize={fontSize}
          />
        )}

      </main>

      {/* Pie de Página — Friendly Design */}
      <footer className="bg-white border-t border-slate-100 text-slate-500 py-6 px-4 mt-8 text-center text-xs md:text-sm print:hidden">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-700 flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span>GasGestor • Desarrollado con cariño para facilitar la jornada comunal de gas</span>
          </p>
          <p className="text-slate-400">
            Sesión iniciada como <strong className="text-slate-700">{session.name}</strong> ({session.role}).
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentRole('guia_mama')}
              className="text-amber-500 hover:text-amber-600 font-bold underline cursor-pointer"
            >
              Ver Guión y Explicación para Mamá
            </button>
            <span className="text-slate-200">•</span>
            <button
              type="button"
              onClick={handleLogout}
              className="font-bold underline cursor-pointer"
              style={{ color: '#DC2626' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
