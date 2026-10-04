const MAX_PAYLOAD_BYTES = 331;
const MAX_COMMENT_LENGTH = 140;
const MAX_AMOUNT = 999999999.99;

export function normalizeIban(value) {
  return value.replace(/\s+/g, '').toUpperCase();
}

export function isValidIban(value) {
  const iban = normalizeIban(value);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;

  for (const char of rearranged) {
    const chunk = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of chunk) remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

export function parseAmount(value) {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0.01 || amount > MAX_AMOUNT) return null;
  return amount;
}

function formatAmount(amount) {
  return `EUR${amount.toFixed(2)}`;
}

export function buildEpcPayload({ beneficiary, iban, bic, version = '002', charset = '1', amount, comment = '' }) {
  const cleanIban = normalizeIban(iban);
  const cleanBic = bic.replace(/\s+/g, '').toUpperCase();
  const cleanName = beneficiary.trim();
  const cleanComment = comment.trim().replace(/[\r\n]+/g, ' ');

  if (!cleanName || cleanName.length > 70) throw new Error('Le nom du bénéficiaire doit contenir entre 1 et 70 caractères.');
  if (!isValidIban(cleanIban)) throw new Error('L’IBAN configuré est invalide.');
  if (!/^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/.test(cleanBic)) throw new Error('Le BIC configuré est invalide.');
  if (cleanComment.length > MAX_COMMENT_LENGTH) throw new Error('La communication dépasse 140 caractères.');
  if (!Number.isFinite(amount) || amount < 0.01 || amount > MAX_AMOUNT) throw new Error('Le montant est invalide.');

  const fields = [
    'BCD',
    version,
    charset,
    'SCT',
    cleanBic,
    cleanName,
    cleanIban,
    formatAmount(amount),
    '',
    '',
    cleanComment,
  ];

  while (fields.at(-1) === '') fields.pop();
  const payload = fields.join('\n');
  const bytes = new TextEncoder().encode(payload).length;
  if (bytes > MAX_PAYLOAD_BYTES) throw new Error(`Les données EPC sont trop longues (${bytes}/${MAX_PAYLOAD_BYTES} octets).`);

  return { payload, bytes };
}
