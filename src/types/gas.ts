export type CylinderWeight = '10kg' | '18kg' | '27kg' | '43kg';
export type CylinderValve = 'Rosca' | 'Clip-on' | 'AutoGas';

export interface CylinderItem {
  id: string;
  weight: CylinderWeight;
  valve: CylinderValve;
  qty: number;
}

export type PaymentMethod = 'pago_movil' | 'transferencia' | 'efectivo';

export interface GasRecord {
  id: string;
  nombre: string; // Nombre real (ej: María Páez)
  apodoComunal?: string; // Nombre/referencia comunal conocida (ej: María Mario)
  bombonas: CylinderItem[];
  ref: string;
  monto: number;
  paymentMethod: PaymentMethod;
  fechaRegistro: string;
  check1_cobrador: boolean; // Check 1: Validar datos (Cobrador)
  check2_banco: boolean;    // Check 2: Verificación bancaria (Extracto)
  check2_manual: boolean;   // Check 3: Verificación manual (Verificador)
  tieneInconveniente?: boolean; // Estatus de inconveniente
  motivoInconveniente?: string; // Explicación del inconveniente
  bancoConciliadoAt?: string;
  notas?: string;
}

export type CommunityStatus = 'pendiente' | 'por_revision' | 'aprobado' | 'inconveniente';
export type CollectorStatus = 'pendiente_verificar' | 'verificado_banco' | 'inconveniente';
export type RecordStatusLevel = 'pendiente' | 'check1' | 'nivel1' | 'nivel2' | 'inconveniente';

export interface StatusDetail {
  level: RecordStatusLevel;
  title: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
  stepNumber: number; // 0 for pendiente, 1 for check1, 2 for nivel 1, 3 for nivel 2
  isApproved: boolean;
}

export type UserRole = 'comunidad' | 'cobrador' | 'verificador' | 'master' | 'guia_mama' | 'mama';

export interface UserSession {
  user: string;
  role: UserRole;
  name: string;
}

export type FontSizeMode = 'normal' | 'grande' | 'extragrande';
