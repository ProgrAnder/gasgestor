import type { GasRecord, StatusDetail, RecordStatusLevel, UserRole, UserSession } from '../types/gas.ts';

export const DEFAULT_USERS: Record<string, { pass: string; role: UserRole; name: string }> = {
  admin: { pass: 'master123', role: 'master', name: 'Administrador Master' },
  cobrador: { pass: 'cobrad123', role: 'cobrador', name: 'Atención / Cobrador' },
  verificador: { pass: 'verifi123', role: 'verificador', name: 'Verificador / Banco' },
  sf10: { pass: '10751.', role: 'mama', name: 'Mamá (Cobrador)' },
};

export function authenticateUser(userInput: string, passInput: string): { success: boolean; session?: UserSession; error?: string } {
  const cleanUser = userInput.trim().toLowerCase();
  const cleanPass = passInput.trim();

  if (!cleanUser) {
    return { success: false, error: 'Por favor ingrese su usuario.' };
  }

  const userFound = DEFAULT_USERS[cleanUser];
  if (!userFound || userFound.pass !== cleanPass) {
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  }

  return {
    success: true,
    session: {
      user: cleanUser,
      role: userFound.role,
      name: userFound.name,
    },
  };
}

/**
 * Estatus simplificado para la Comunidad (Los Vecinos):
 * - Inconveniente (si fue marcado con problema)
 * - Pendiente por revisar
 * - Por revisión
 * - Aprobado (cuando tiene Check 1 + Banco + Manual)
 */
export function getCommunityStatus(record: Pick<GasRecord, 'check1_cobrador' | 'check2_banco' | 'check2_manual' | 'tieneInconveniente' | 'motivoInconveniente'>): {
  status: 'pendiente' | 'por_revision' | 'aprobado' | 'inconveniente';
  label: string;
  badgeClass: string;
  description: string;
} {
  if (record.tieneInconveniente) {
    return {
      status: 'inconveniente',
      label: 'Inconveniente con el pago',
      badgeClass: 'bg-red-100 text-red-900 border-red-400 ring-red-500',
      description: record.motivoInconveniente
        ? `Atención: ${record.motivoInconveniente}. Por favor comunícate con tu cobrador.`
        : 'Hay una discrepancia con el monto o la referencia. Comunícate con tu cobrador.',
    };
  }

  const isApproved = record.check1_cobrador && record.check2_banco && record.check2_manual;
  if (isApproved) {
    return {
      status: 'aprobado',
      label: 'Aprobado',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-emerald-500',
      description: '¡Tu pago está 100% verificado y aprobado! Tu bombona está lista para la entrega comunal.',
    };
  }

  if (record.check1_cobrador) {
    return {
      status: 'por_revision',
      label: 'Por revisión',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 ring-amber-500',
      description: 'Tus datos fueron recibidos por el cobrador y están en proceso de revisión con el banco.',
    };
  }

  return {
    status: 'pendiente',
    label: 'Pendiente por revisar',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-400 ring-orange-500',
    description: 'Tu registro fue recibido en el sistema. En espera de que el cobrador revise tus datos.',
  };
}

/**
 * Estatus para el Cobrador:
 * - Pendiente por verificar
 * - Verificado por el extracto bancario
 * - Inconveniente
 */
export function getCollectorStatus(record: Pick<GasRecord, 'check2_banco' | 'tieneInconveniente' | 'motivoInconveniente'>): {
  status: 'pendiente_verificar' | 'verificado_banco' | 'inconveniente';
  label: string;
  badgeClass: string;
} {
  if (record.tieneInconveniente) {
    return {
      status: 'inconveniente',
      label: 'Inconveniente',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
    };
  }

  if (record.check2_banco) {
    return {
      status: 'verificado_banco',
      label: 'Verificado por el extracto bancario',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }

  return {
    status: 'pendiente_verificar',
    label: 'Pendiente por verificar',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  };
}

/**
 * Calculates the comprehensive status detail (usado en Verificador y Master)
 */
export function computeRecordStatus(record: Pick<GasRecord, 'check1_cobrador' | 'check2_banco' | 'check2_manual' | 'tieneInconveniente' | 'motivoInconveniente'>): StatusDetail {
  if (record.tieneInconveniente) {
    return {
      level: 'inconveniente',
      title: 'Inconveniente con el Pago',
      shortLabel: 'Con Inconveniente',
      badgeClass: 'bg-red-100 text-red-900 border-red-400 ring-red-500',
      description: record.motivoInconveniente || 'Hay un inconveniente con este registro.',
      stepNumber: -1,
      isApproved: false,
    };
  }

  const { check1_cobrador, check2_banco, check2_manual } = record;

  if (check1_cobrador && check2_banco && check2_manual) {
    return {
      level: 'nivel2',
      title: 'Verificación Nivel 2 (Aprobado y Listo)',
      shortLabel: 'Nivel 2: Aprobado Definitivo',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500',
      description: '¡Todo verificado con éxito! Tu bombona está lista para ser despachada en la jornada.',
      stepNumber: 3,
      isApproved: true,
    };
  }

  if (check1_cobrador && (check2_banco || check2_manual)) {
    return {
      level: 'nivel1',
      title: 'Verificación Nivel 1',
      shortLabel: 'Nivel 1: Verificado Parcial',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500',
      description: 'Datos validados por el cobrador y con verificación bancaria o manual en proceso.',
      stepNumber: 2,
      isApproved: false,
    };
  }

  if (check1_cobrador) {
    return {
      level: 'check1',
      title: 'Check 1 (Validar datos)',
      shortLabel: 'Check 1: Datos Validados',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-500',
      description: 'El cobrador anotó y validó tus datos. En espera de verificación bancaria.',
      stepNumber: 1,
      isApproved: false,
    };
  }

  return {
    level: 'pendiente',
    title: 'Pendiente por Verificar',
    shortLabel: 'Pendiente de Revisión',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 ring-orange-500',
    description: 'Registro recibido en el sistema. En espera de revisión por el cobrador.',
    stepNumber: 0,
    isApproved: false,
  };
}

/**
 * Normalizes text for search by removing accents, lowercasing, and trimming.
 */
export function normalizeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Searches and reconciles bank statement text with pending records.
 * Supports different bank reference and amount formats (e.g. 850.00, 850,00, Bs. 850).
 */
export function reconcileBankExtract(
  records: GasRecord[],
  extractText: string
): {
  matchedCount: number;
  matchedRecordIds: string[];
  updatedRecords: GasRecord[];
  logs: string[];
} {
  if (!extractText || !extractText.trim()) {
    return {
      matchedCount: 0,
      matchedRecordIds: [],
      updatedRecords: [...records],
      logs: ['Texto del extracto bancario vacío.'],
    };
  }

  const cleanText = extractText.replace(/\r\n/g, '\n');
  const matchedRecordIds: string[] = [];
  const logs: string[] = [];

  const updatedRecords = records.map((rec) => {
    // If already validated by bank, preserve
    if (rec.check2_banco) {
      return rec;
    }

    const ref = rec.ref.trim();
    if (!ref || ref.length < 3) {
      return rec;
    }

    // Prepare variations of reference (full, or without leading zeros)
    const refNoZeros = ref.replace(/^0+/, '');
    const hasRef = cleanText.includes(ref) || (refNoZeros.length >= 4 && cleanText.includes(refNoZeros));

    if (!hasRef) {
      return rec;
    }

    // Check amount formats
    const amountInt = Math.floor(rec.monto).toString();
    const amountDot = rec.monto.toFixed(2); // "850.00"
    const amountComma = rec.monto.toFixed(2).replace('.', ','); // "850,00"

    const hasAmount =
      cleanText.includes(amountDot) ||
      cleanText.includes(amountComma) ||
      cleanText.includes(amountInt);

    if (hasAmount) {
      matchedRecordIds.push(rec.id);
      logs.push(`Coincidencia encontrada para ${rec.nombre}: Ref ${rec.ref} | Monto Bs. ${rec.monto.toFixed(2)}`);
      return {
        ...rec,
        check2_banco: true,
        bancoConciliadoAt: new Date().toISOString(),
      };
    } else {
      logs.push(`Referencia ${rec.ref} de ${rec.nombre} hallada, pero el monto no coincidió exactamente en el extracto.`);
      return rec;
    }
  });

  return {
    matchedCount: matchedRecordIds.length,
    matchedRecordIds,
    updatedRecords,
    logs,
  };
}

/**
 * Calculates global summaries for cylinders and collection.
 */
export function calculateTotals(records: GasRecord[]) {
  let totalCylinders = 0;
  let totalMonto = 0;
  let totalRecaudadoAprobado = 0;
  let totalNivel2Aprobados = 0;
  let totalCheck1 = 0;
  let totalInconvenientes = 0;

  const weightsCount: Record<string, number> = {
    '10kg': 0,
    '18kg': 0,
    '27kg': 0,
    '43kg': 0,
  };

  const valvesCount: Record<string, number> = {
    'Rosca': 0,
    'Clip-on': 0,
    'AutoGas': 0,
  };

  for (const r of records) {
    totalMonto += r.monto;
    if (r.tieneInconveniente) {
      totalInconvenientes++;
    }
    const isLevel2 = !r.tieneInconveniente && r.check1_cobrador && r.check2_banco && r.check2_manual;
    if (isLevel2) {
      totalRecaudadoAprobado += r.monto;
      totalNivel2Aprobados++;
    }
    if (r.check1_cobrador && !r.tieneInconveniente) {
      totalCheck1++;
    }

    for (const b of r.bombonas) {
      const qty = b.qty || 1;
      totalCylinders += qty;
      weightsCount[b.weight] = (weightsCount[b.weight] || 0) + qty;
      valvesCount[b.valve] = (valvesCount[b.valve] || 0) + qty;
    }
  }

  return {
    totalRecords: records.length,
    totalCylinders,
    totalMonto,
    totalRecaudadoAprobado,
    totalNivel2Aprobados,
    totalCheck1,
    totalInconvenientes,
    weightsCount,
    valvesCount,
  };
}

export const SEED_RECORDS: GasRecord[] = [
  {
    id: 'seed-1',
    nombre: 'Pepe Pérez',
    apodoComunal: 'Don Pepe (El de la bodega)',
    bombonas: [
      { id: 'b1-1', weight: '18kg', valve: 'Rosca', qty: 2 },
      { id: 'b1-2', weight: '43kg', valve: 'Clip-on', qty: 1 },
    ],
    ref: '987654',
    monto: 850.00,
    paymentMethod: 'pago_movil',
    fechaRegistro: '2026-10-17 09:30',
    check1_cobrador: true,
    check2_banco: true,
    check2_manual: true,
    notas: 'Ejemplo con Verificación Nivel 2 (Listo para entrega)',
  },
  {
    id: 'seed-2',
    nombre: 'María Páez',
    apodoComunal: 'María Mario',
    bombonas: [
      { id: 'b2-1', weight: '10kg', valve: 'Rosca', qty: 1 },
    ],
    ref: '112233',
    monto: 120.00,
    paymentMethod: 'pago_movil',
    fechaRegistro: '2026-10-17 10:15',
    check1_cobrador: true,
    check2_banco: true,
    check2_manual: false,
    notas: 'Vecina conocida en la comunidad como María Mario. En revisión por verificador.',
  },
  {
    id: 'seed-3',
    nombre: 'Carlos Ruiz',
    apodoComunal: 'Carlitos (Mecánico)',
    bombonas: [
      { id: 'b3-1', weight: '27kg', valve: 'Clip-on', qty: 1 },
    ],
    ref: '554433',
    monto: 310.00,
    paymentMethod: 'transferencia',
    fechaRegistro: '2026-10-17 11:00',
    check1_cobrador: true,
    check2_banco: true,
    check2_manual: false,
    notas: 'Ejemplo en Nivel 1 (Cobrador + Banco OK, falta Check Manual)',
  },
  {
    id: 'seed-4',
    nombre: 'Carmen Rodríguez',
    apodoComunal: 'Doña Carmen',
    bombonas: [
      { id: 'b4-1', weight: '10kg', valve: 'Rosca', qty: 1 },
      { id: 'b4-2', weight: '18kg', valve: 'AutoGas', qty: 1 },
    ],
    ref: '778899',
    monto: 290.00,
    paymentMethod: 'efectivo',
    fechaRegistro: '2026-10-17 11:45',
    check1_cobrador: false,
    check2_banco: false,
    check2_manual: false,
    notas: 'Ejemplo nuevo recién registrado (Pendiente por revisar)',
  },
  {
    id: 'seed-5',
    nombre: 'José Antonio Silva',
    apodoComunal: 'El Mocho José',
    bombonas: [
      { id: 'b5-1', weight: '18kg', valve: 'Rosca', qty: 1 },
    ],
    ref: '332211',
    monto: 150.00,
    paymentMethod: 'pago_movil',
    fechaRegistro: '2026-10-17 12:10',
    check1_cobrador: true,
    check2_banco: false,
    check2_manual: false,
    tieneInconveniente: true,
    motivoInconveniente: 'El comprobante enviado está borroso y no coincide la referencia en el banco.',
    notas: 'Ejemplo con estatus de inconveniente para alertar al vecino y al cobrador.',
  },
];
