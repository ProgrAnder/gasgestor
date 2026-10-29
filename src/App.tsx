import React, { useState, useEffect } from 'react';
import type { GasRecord, UserRole, FontSizeMode, UserSession } from './types/gas.ts';
import { SEED_RECORDS } from './utils/gasLogic.ts';
import {
  subscribeToGasRecords,
  saveGasRecordToCloud,
  deleteGasRecordFromCloud,
  resetGasRecordsInCloud,
} from './utils/cloudSync.ts';
import { Header } from './components/Header.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { CommunityView } from './components/CommunityView.tsx';
import { CollectorView } from './components/CollectorView.tsx';
import { VerifierView } from './components/VerifierView.tsx';
import { PrintSheetView } from './components/PrintSheetView.tsx';
import { MamaGuideView } from './components/MamaGuideView.tsx';
import { MamaSimpleCollector } from './components/MamaSimpleCollector.tsx';
import { CheckCircle2, AlertCircle, Info, HeartHandshake, Wifi, WifiOff } from 'lucide-react';

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

  // Estado de conexión a Internet
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Conexión reestablecida. Sincronizando con la nube...', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Sin conexión a Internet. Modo fuera de línea activo (los cambios se guardan localmente).', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Registros de Bombonas (con sincronización en la nube + soporte offline)
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

  // Nombre de la colección según el rol (colección aislada 'gas_records_sf10' para sf10)
  const isSf10 = session?.role === 'sf10';
  const collectionName = isSf10 ? 'gas_records_sf10' : 'gas_records';

  // Suscribirse a Firestore en tiempo real (lee localmente de inmediato y sincroniza en segundo plano)
  useEffect(() => {
    const unsubscribe = subscribeToGasRecords((cloudRecords) => {
      if (cloudRecords && cloudRecords.length > 0) {
        setRecords(cloudRecords);
      }
    }, collectionName);

    return () => unsubscribe();
  }, [collectionName]);

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

  // Guardar en localStorage de respaldo
  useEffect(() => {
    try {
      localStorage.setItem(`gasgestor_records_${collectionName}`, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving records:', e);
    }
  }, [records, collectionName]);

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
    if (newSession.role === 'sf10') {
      setCurrentRole('sf10');
    } else if (newSession.role === 'cobrador') {
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

  const handleAddRecord = async (newRecord: Omit<GasRecord, 'id' | 'fechaRegistro'>) => {
    const record: GasRecord = {
      ...newRecord,
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      fechaRegistro: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setRecords((prev) => [record, ...prev]);
    showToast(`Registro guardado para ${record.nombre}.`, 'success');
    try {
      await saveGasRecordToCloud(record, collectionName);
    } catch (e) {
      console.warn('Guardado en cache offline (se sincronizará al conectar):', e);
    }
  };

  const handleToggleCheck1 = async (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const updated = { ...target, check1_cobrador: !target.check1_cobrador };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast(
      updated.check1_cobrador
        ? `Datos validados para ${updated.nombre}.`
        : `Validación de datos retirada para ${updated.nombre}.`,
      'info'
    );
    try {
      await saveGasRecordToCloud(updated, collectionName);
    } catch (e) {
      console.warn('Actualizado en cache offline:', e);
    }
  };

  const handleToggleCheck2Manual = async (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const updated = { ...target, check2_manual: !target.check2_manual };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast(
      updated.check2_manual
        ? `Check Manual aprobado para ${updated.nombre}.`
        : `Check Manual retirado para ${updated.nombre}.`,
      'info'
    );
    try {
      await saveGasRecordToCloud(updated, collectionName);
    } catch (e) {
      console.warn('Actualizado en cache offline:', e);
    }
  };

  const handleToggleCheck2Banco = async (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const updated = { ...target, check2_banco: !target.check2_banco };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast(
      updated.check2_banco
        ? `Check Banco activado manualmente para ${updated.nombre}.`
        : `Check Banco desactivado para ${updated.nombre}.`,
      'info'
    );
    try {
      await saveGasRecordToCloud(updated, collectionName);
    } catch (e) {
      console.warn('Actualizado en cache offline:', e);
    }
  };

  const handleSetInconveniente = async (id: string, tieneInconveniente: boolean, motivo?: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const updated = {
      ...target,
      tieneInconveniente,
      motivoInconveniente: tieneInconveniente ? motivo : undefined,
    };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast(
      tieneInconveniente
        ? `Inconveniente reportado para ${updated.nombre}.`
        : `Inconveniente resuelto para ${updated.nombre}.`,
      tieneInconveniente ? 'error' : 'success'
    );
    try {
      await saveGasRecordToCloud(updated, collectionName);
    } catch (e) {
      console.warn('Actualizado en cache offline:', e);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Registro eliminado.', 'info');
    try {
      await deleteGasRecordFromCloud(id, collectionName);
    } catch (e) {
      console.warn('Eliminado en cache offline:', e);
    }
  };

  const handleResetData = async () => {
    if (confirm('¿Restablecer la lista con los 5 ejemplos de prueba iniciales (María Páez/María Mario, Pepe Pérez, etc.)?')) {
      setRecords(SEED_RECORDS);
      showToast('Se han restablecido los 5 ejemplos ficticios de prueba.', 'success');
      try {
        await resetGasRecordsInCloud(collectionName);
      } catch (e) {
        console.warn('Reset aplicado en cache local:', e);
      }
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

        {/* Indicador de Estado de Conexión (Offline / Online) */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nube Conectada (Sincronizado)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs animate-pulse">
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Modo Sin Conexión (Los datos se guardan en el teléfono)</span>
              </span>
            )}
          </div>
          <span className="text-2xs text-slate-400 font-medium">
            Firebase Firestore • Multi-dispositivo
          </span>
        </div>

        {/* Banner Estadístico Rápido (Oculto para sf10 para máxima sencillez) */}
        {!isSf10 && (
          <StatsCards records={records} fontSize={fontSize} />
        )}

        {/* Vista Ultra Simplificada para sf10 */}
        {isSf10 && (
          <MamaSimpleCollector
            records={records}
            onAddRecord={handleAddRecord}
            onDeleteRecord={handleDeleteRecord}
            fontSize={fontSize}
          />
        )}

        {/* Vistas según Rol Activo (cuando no es sf10) */}
        {!isSf10 && currentRole === 'comunidad' && (
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
          <div className="pt-2 flex justify-center">
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
