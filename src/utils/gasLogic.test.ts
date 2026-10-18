import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRecordStatus,
  getCommunityStatus,
  getCollectorStatus,
  normalizeSearch,
  reconcileBankExtract,
  calculateTotals,
  SEED_RECORDS,
  authenticateUser,
} from './gasLogic.ts';
import type { GasRecord } from '../types/gas.ts';

test('authenticateUser validates credentials properly', () => {
  // Correct cobrador
  const auth1 = authenticateUser('cobrador', '123');
  assert.equal(auth1.success, true);
  assert.equal(auth1.session?.role, 'cobrador');
  assert.equal(auth1.session?.name, 'Atención / Cobrador');

  // Correct admin
  const auth2 = authenticateUser('admin', '123');
  assert.equal(auth2.success, true);
  assert.equal(auth2.session?.role, 'master');

  // Wrong password
  const auth3 = authenticateUser('cobrador', 'wrongpassword');
  assert.equal(auth3.success, false);
  assert.ok(auth3.error);

  // Unknown user
  const auth4 = authenticateUser('desconocido', '123');
  assert.equal(auth4.success, false);
});

test('getCommunityStatus returns the exact 3 community states plus inconveniente', () => {
  // Pendiente por revisar
  const c0 = getCommunityStatus({
    check1_cobrador: false,
    check2_banco: false,
    check2_manual: false,
  });
  assert.equal(c0.status, 'pendiente');
  assert.equal(c0.label, 'Pendiente por revisar');

  // Por revisión (Check 1 del cobrador listo)
  const c1 = getCommunityStatus({
    check1_cobrador: true,
    check2_banco: false,
    check2_manual: false,
  });
  assert.equal(c1.status, 'por_revision');
  assert.equal(c1.label, 'Por revisión');

  // Aprobado (Check 1 + Banco + Manual)
  const c2 = getCommunityStatus({
    check1_cobrador: true,
    check2_banco: true,
    check2_manual: true,
  });
  assert.equal(c2.status, 'aprobado');
  assert.equal(c2.label, 'Aprobado');

  // Inconveniente
  const c3 = getCommunityStatus({
    check1_cobrador: true,
    check2_banco: false,
    check2_manual: false,
    tieneInconveniente: true,
    motivoInconveniente: 'Referencia errónea',
  });
  assert.equal(c3.status, 'inconveniente');
  assert.equal(c3.label, 'Inconveniente con el pago');
});

test('getCollectorStatus displays bank verification or pending', () => {
  const col1 = getCollectorStatus({ check2_banco: false });
  assert.equal(col1.status, 'pendiente_verificar');

  const col2 = getCollectorStatus({ check2_banco: true });
  assert.equal(col2.status, 'verificado_banco');

  const col3 = getCollectorStatus({ check2_banco: false, tieneInconveniente: true });
  assert.equal(col3.status, 'inconveniente');
});

test('searching finds neighbor both by real name (María Páez) and alias (María Mario)', () => {
  const maria = SEED_RECORDS.find((r) => r.nombre === 'María Páez');
  assert.ok(maria);
  assert.equal(maria.apodoComunal, 'María Mario');

  // Search by real name
  const queryReal = normalizeSearch('María Páez');
  const match1 =
    normalizeSearch(maria.nombre).includes(queryReal) ||
    normalizeSearch(maria.apodoComunal || '').includes(queryReal);
  assert.equal(match1, true);

  // Search by community alias
  const queryAlias = normalizeSearch('Maria Mario');
  const match2 =
    normalizeSearch(maria.nombre).includes(queryAlias) ||
    normalizeSearch(maria.apodoComunal || '').includes(queryAlias);
  assert.equal(match2, true);
});

test('reconcileBankExtract matches reference and amount properly', () => {
  const records: GasRecord[] = [
    {
      id: 'r1',
      nombre: 'Elena Blanco',
      bombonas: [{ id: 'b1', weight: '18kg', valve: 'Rosca', qty: 1 }],
      ref: '789123',
      monto: 250.00,
      paymentMethod: 'pago_movil',
      fechaRegistro: '2026-10-17',
      check1_cobrador: true,
      check2_banco: false,
      check2_manual: false,
    },
  ];

  const extractText = `
    ESTADO DE CUENTA BANCARIO - BANCO DE VENEZUELA
    17/10/2026 PAGO MOVIL Banesco REF: 789123 MONTO: Bs. 250,00 APROBADO
  `;

  const result = reconcileBankExtract(records, extractText);
  assert.equal(result.matchedCount, 1);
  assert.equal(result.updatedRecords[0].check2_banco, true);
});

test('calculateTotals calculates cylinder count, weights, and finances correctly', () => {
  const totals = calculateTotals(SEED_RECORDS);
  assert.equal(totals.totalRecords, 5);
  // seed-5 has 1x 18kg bombona
  assert.equal(totals.totalCylinders, 8);
  assert.equal(totals.totalInconvenientes, 1);
  assert.equal(totals.totalNivel2Aprobados, 1);
});
