import * as XLSX from 'xlsx';

export type RowStatus = 'paid' | 'unpaid' | 'partial' | 'cancelled';

export type ImportRow = {
  sheet: string;
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  amountPaid: number;
  status: RowStatus;
  expense: number;
  date: Date;
  service: string;
  servedBy?: string;
};

export type ImportError = { sheet: string; row: number; reason: string };
export type SheetHeaders = { sheet: string; headers: string[] };

const NAME_CANDIDATES = ['name', 'customername', 'clientname', 'client', 'fullname', 'customer'];
const SERVICE_CANDIDATES = ['service', 'servicetype', 'serviceoffered', 'description', 'workdone', 'job'];
const AMOUNT_CANDIDATES = ['amount', 'amountkes', 'amountpaid', 'amountcharged', 'price', 'cost', 'total', 'totalamount', 'fee', 'kes', 'ksh', 'amountksh', 'charge'];
const PROFIT_CANDIDATES = ['profit', 'margin', 'netprofit'];
const EXPENSE_CANDIDATES = ['expense', 'expenses', 'expensekes', 'materialcost', 'partscost'];
const EMAIL_CANDIDATES = ['email', 'emailaddress', 'mail'];
const PHONE_CANDIDATES = ['phone', 'phonenumber', 'mobile', 'tel', 'telephone', 'contactnumber'];
const COMBINED_CONTACT_CANDIDATES = ['emailphone', 'emailorphone', 'contact', 'contactinfo'];
const STATUS_CANDIDATES = ['paidunpaidindicator', 'paidunpaid', 'status', 'paid', 'paymentstatus'];
const DATE_CANDIDATES = ['date', 'datepaid', 'paymentdate', 'dateofservice', 'servicedate', 'dateordered', 'when', 'transactiondate'];
const SERVED_BY_CANDIDATES = ['servedby', 'staff', 'staffname', 'technician', 'handledby'];

function normalizeHeader(h: string) {
  return h.toLowerCase().replace(/[^a-z]/g, '');
}

function findValue(row: Record<string, unknown>, candidates: string[]): unknown {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    const key = keys.find((k) => normalizeHeader(k) === candidate);
    if (key !== undefined && row[key] !== undefined && String(row[key]).trim() !== '') {
      return row[key];
    }
  }
  return undefined;
}

/** Parses a clean number (handles "KES 5,000", commas, etc). Returns null if the
 * cell looks like a formula/expression/description rather than a plain number —
 * callers can then fall back to deriving the value some other way. */
function parseCleanNumber(raw: unknown): number | null {
  if (typeof raw === 'number' && !isNaN(raw)) return Math.round(raw);
  const str = String(raw ?? '').trim();
  if (!str) return null;
  // Letters, parentheses, or arithmetic operators mean this is an expression/note,
  // not a plain figure — e.g. "(3*2500)+3500+400"
  if (/[a-zA-Z()*+]/.test(str)) return null;
  const cleaned = str.replace(/[^\d.-]/g, '');
  const n = Math.round(Number(cleaned));
  return isNaN(n) ? null : n;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Excel strips the leading 0 from Kenyan numbers stored as a number (e.g. 799300277).
  // Local mobile numbers are 9 digits after the 0 and start with 1 or 7.
  if (digits.length === 9 && /^[17]/.test(digits)) return `0${digits}`;
  return digits;
}

function parsePaymentInfo(raw: unknown, amount: number): { status: RowStatus; amountPaid: number } {
  const s = String(raw ?? '').trim().toLowerCase();
  if (!s) return { status: 'unpaid', amountPaid: 0 };

  if (/cancel/.test(s)) return { status: 'cancelled', amountPaid: 0 };

  if (/unpaid|not\s*paid|owing|pending|outstanding|^no$|^n$|^0$|false/.test(s)) {
    return { status: 'unpaid', amountPaid: 0 };
  }

  // "paid 800" — a partial payment against the full amount
  const numberMatch = s.match(/[\d,]+/);
  if (/paid/.test(s) && numberMatch) {
    const paidAmount = Math.round(Number(numberMatch[0].replace(/,/g, '')));
    if (paidAmount > 0 && paidAmount < amount) return { status: 'partial', amountPaid: paidAmount };
    return { status: 'paid', amountPaid: amount };
  }

  if (/paid|^yes$|^y$|^1$|true|complete/.test(s)) return { status: 'paid', amountPaid: amount };

  // Unrecognized text — treat conservatively as unpaid so it's visible for manual review
  return { status: 'unpaid', amountPaid: 0 };
}

function parseDate(raw: unknown): Date {
  if (raw instanceof Date && !isNaN(raw.getTime())) return raw;
  if (typeof raw === 'number') {
    const parsed = XLSX.SSF.parse_date_code(raw);
    if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
  }

  const str = String(raw ?? '').trim();

  // "01/05/2026" or "01-05-2026" — Kenyan/UK convention is DD/MM/YYYY. JavaScript's
  // native Date constructor assumes US MM/DD/YYYY for slash-separated strings, which
  // silently swaps day and month for any date where both could be valid (e.g. it
  // reads "01/05/2026" as 5 January instead of 1 May). Parse this format explicitly.
  const dmy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // "2026-05-01" — ISO format is unambiguous, safe for native parsing
  const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback for text dates like "15 March 2026"
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

function findHeaderRowIndex(rawRows: unknown[][]): number {
  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const cells = (rawRows[i] ?? []).map((c) => normalizeHeader(String(c ?? '')));
    if (cells.some((c) => NAME_CANDIDATES.includes(c))) return i;
  }
  return 0;
}

function parseSheet(sheet: XLSX.WorkSheet, sheetName: string): {
  rows: ImportRow[];
  errors: ImportError[];
  headers: string[];
} {
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
  if (rawRows.length === 0) return { rows: [], errors: [], headers: [] };

  const headerRowIndex = findHeaderRowIndex(rawRows);
  const headers = (rawRows[headerRowIndex] ?? []).map((h) => String(h ?? '').trim()).filter(Boolean);

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', range: headerRowIndex });

  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];

  raw.forEach((r, i) => {
    const rowNum = headerRowIndex + i + 2;

    const name = String(findValue(r, NAME_CANDIDATES) ?? '').trim();
    if (!name) { errors.push({ sheet: sheetName, row: rowNum, reason: 'Missing name' }); return; }

    let email = String(findValue(r, EMAIL_CANDIDATES) ?? '').trim();
    let phone = String(findValue(r, PHONE_CANDIDATES) ?? '').trim();

    if (!email && !phone) {
      const combined = String(findValue(r, COMBINED_CONTACT_CANDIDATES) ?? '').trim();
      if (combined.includes('@')) email = combined;
      else phone = combined;
    }
    if (phone) phone = normalizePhone(phone);

    if (!email && !phone) { errors.push({ sheet: sheetName, row: rowNum, reason: 'Missing email/phone' }); return; }

    let amount = parseCleanNumber(findValue(r, AMOUNT_CANDIDATES));
    if (amount === null) {
      // Amount cell is a formula/expression (e.g. "(3*2500)+3500") — derive from profit + expense instead
      const profit = parseCleanNumber(findValue(r, PROFIT_CANDIDATES));
      const expenseForFallback = parseCleanNumber(findValue(r, EXPENSE_CANDIDATES)) ?? 0;
      if (profit !== null) amount = profit + expenseForFallback;
    }
    if (!amount || amount <= 0) { errors.push({ sheet: sheetName, row: rowNum, reason: 'Missing or invalid amount' }); return; }

    const expense = parseCleanNumber(findValue(r, EXPENSE_CANDIDATES)) ?? 0;
    const { status, amountPaid } = parsePaymentInfo(findValue(r, STATUS_CANDIDATES), amount);
    const date = parseDate(findValue(r, DATE_CANDIDATES));
    const service = String(findValue(r, SERVICE_CANDIDATES) ?? '').trim() || 'General Service';
    const servedBy = String(findValue(r, SERVED_BY_CANDIDATES) ?? '').trim() || undefined;

    rows.push({ sheet: sheetName, name, email: email || undefined, phone: phone || undefined, amount, amountPaid, status, expense, date, service, servedBy });
  });

  return { rows, errors, headers };
}

export function parseSpreadsheet(buffer: Buffer): {
  rows: ImportRow[];
  errors: ImportError[];
  detectedHeaders: SheetHeaders[];
} {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];
  const detectedHeaders: SheetHeaders[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const result = parseSheet(sheet, sheetName);
    rows.push(...result.rows);
    errors.push(...result.errors);
    if (result.headers.length > 0) detectedHeaders.push({ sheet: sheetName, headers: result.headers });
  }

  return { rows, errors, detectedHeaders };
}
