import * as XLSX from 'xlsx';

export type ImportRow = {
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  paid: boolean;
  date: Date;
  service: string;
};

export type ImportError = { row: number; reason: string };

const NAME_CANDIDATES = ['name', 'customername', 'clientname', 'client', 'fullname', 'customer'];

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

function parseAmount(raw: unknown): number {
  const digits = String(raw ?? '').replace(/[^0-9.]/g, '');
  return Math.round(Number(digits) || 0);
}

function parseStatus(raw: unknown): boolean {
  const s = String(raw ?? '').trim().toLowerCase();
  if (/unpaid|not\s*paid|owing|pending|outstanding|^no$|^n$|^0$|false/.test(s)) return false;
  return /paid|^yes$|^y$|^1$|true|complete/.test(s);
}

function parseDate(raw: unknown): Date {
  if (raw instanceof Date && !isNaN(raw.getTime())) return raw;
  if (typeof raw === 'number') {
    // Excel serial date fallback (cellDates:true should normally avoid this path)
    const parsed = XLSX.SSF.parse_date_code(raw);
    if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
  }
  const parsed = new Date(String(raw ?? ''));
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/** Find which row actually holds the column headers — handles sheets that have
 * a title ("Customer List 2026") or blank rows above the real header row. */
function findHeaderRowIndex(rawRows: unknown[][]): number {
  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const cells = (rawRows[i] ?? []).map((c) => normalizeHeader(String(c ?? '')));
    if (cells.some((c) => NAME_CANDIDATES.includes(c))) return i;
  }
  return 0; // fall back to the first row if nothing matches
}

export function parseSpreadsheet(buffer: Buffer): {
  rows: ImportRow[];
  errors: ImportError[];
  detectedHeaders: string[];
} {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
  const headerRowIndex = findHeaderRowIndex(rawRows);
  const detectedHeaders = (rawRows[headerRowIndex] ?? []).map((h) => String(h ?? '').trim()).filter(Boolean);

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', range: headerRowIndex });

  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];

  raw.forEach((r, i) => {
    const rowNum = headerRowIndex + i + 2; // +1 for header row, +1 for 1-indexing

    const name = String(findValue(r, NAME_CANDIDATES) ?? '').trim();
    if (!name) { errors.push({ row: rowNum, reason: 'Missing name' }); return; }

    let email = String(findValue(r, ['email', 'emailaddress', 'mail']) ?? '').trim();
    let phone = String(findValue(r, ['phone', 'phonenumber', 'mobile', 'tel', 'telephone', 'contactnumber']) ?? '').trim();

    if (!email && !phone) {
      const combined = String(findValue(r, ['emailphone', 'emailorphone', 'contact', 'contactinfo']) ?? '').trim();
      if (combined.includes('@')) email = combined;
      else phone = combined;
    }

    if (!email && !phone) { errors.push({ row: rowNum, reason: 'Missing email/phone' }); return; }

    const amount = parseAmount(findValue(r, ['amount', 'amountkes', 'amountpaid', 'price', 'cost', 'total', 'totalamount', 'fee', 'kes', 'ksh', 'amountksh']));
    if (!amount || amount <= 0) { errors.push({ row: rowNum, reason: 'Missing or invalid amount' }); return; }

    const paid = parseStatus(findValue(r, ['paidunpaidindicator', 'paidunpaid', 'status', 'paid', 'paymentstatus']));
    const date = parseDate(findValue(r, ['date', 'datepaid', 'paymentdate', 'dateofservice', 'servicedate', 'when', 'transactiondate']));
    const service = String(findValue(r, ['service', 'servicetype', 'description', 'workdone', 'job']) ?? '').trim() || 'General Service';

    rows.push({ name, email: email || undefined, phone: phone || undefined, amount, paid, date, service });
  });

  return { rows, errors, detectedHeaders };
}
