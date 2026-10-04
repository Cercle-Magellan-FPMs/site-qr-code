import QRCode from 'qrcode';
import './style.css';
import { EPC_CONFIG } from './config.js';
import { buildEpcPayload, parseAmount } from './epc.js';

const STORAGE_KEYS = {
  amount: 'magellan-epc-amount',
  comment: 'magellan-epc-comment',
};

const amountInput = document.querySelector('#amount');
const commentInput = document.querySelector('#comment');
const amountError = document.querySelector('#amount-error');
const payloadError = document.querySelector('#payload-error');
const commentCount = document.querySelector('#comment-count');
const canvas = document.querySelector('#qr-canvas');
const emptyState = document.querySelector('#qr-empty');
const qrFrame = document.querySelector('.qr-frame');
const downloadButton = document.querySelector('#download');
const copyButton = document.querySelector('#copy');
const resetButton = document.querySelector('#reset');
const payloadPreview = document.querySelector('#payload-preview');
const beneficiaryDisplay = document.querySelector('#beneficiary-display');
const quickAmounts = document.querySelectorAll('.quick-amount');

beneficiaryDisplay.textContent = EPC_CONFIG.beneficiary;
amountInput.value = localStorage.getItem(STORAGE_KEYS.amount) ?? '';
commentInput.value = localStorage.getItem(STORAGE_KEYS.comment) ?? '';

let currentPayload = '';

function updateCount() {
  commentCount.textContent = `${commentInput.value.length} / 140`;
}

function setQrVisibility(visible) {
  canvas.hidden = !visible;
  qrFrame.hidden = !visible;
  emptyState.hidden = visible;
  downloadButton.disabled = !visible;
  copyButton.disabled = !visible;
}

async function render() {
  amountError.textContent = '';
  payloadError.textContent = '';
  currentPayload = '';
  payloadPreview.textContent = '';

  localStorage.setItem(STORAGE_KEYS.amount, amountInput.value);
  localStorage.setItem(STORAGE_KEYS.comment, commentInput.value);
  updateCount();

  const amount = parseAmount(amountInput.value);
  if (amount === null) {
    if (amountInput.value.trim()) {
      amountError.textContent = 'Entre un montant valide, avec maximum deux décimales.';
    }
    setQrVisibility(false);
    return;
  }

  try {
    const { payload, bytes } = buildEpcPayload({
      ...EPC_CONFIG,
      amount,
      comment: commentInput.value,
    });

    currentPayload = payload;
    payloadPreview.textContent = `${payload}\n\n${bytes} / 331 octets`;

    await QRCode.toCanvas(canvas, payload, {
      errorCorrectionLevel: 'M',
      margin: 3,
      width: 640,
      color: { dark: '#00040b', light: '#ffffff' },
    });

    setQrVisibility(true);
  } catch (error) {
    payloadError.textContent =
      error instanceof Error ? error.message : 'Impossible de générer le QR Code.';
    setQrVisibility(false);
  }
}

amountInput.addEventListener('input', render);
commentInput.addEventListener('input', render);

quickAmounts.forEach((button) => {
  button.addEventListener('click', () => {
    amountInput.value = button.dataset.amount ?? '';
    render();
    amountInput.focus();
  });
});

downloadButton.addEventListener('click', () => {
  if (!currentPayload) return;
  const link = document.createElement('a');
  link.download = 'virement-magellan-epc.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

copyButton.addEventListener('click', async () => {
  if (!currentPayload) return;
  await navigator.clipboard.writeText(currentPayload);
  const initial = copyButton.textContent;
  copyButton.textContent = 'Copié ✓';
  setTimeout(() => {
    copyButton.textContent = initial;
  }, 1200);
});

resetButton.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEYS.amount);
  localStorage.removeItem(STORAGE_KEYS.comment);
  amountInput.value = '';
  commentInput.value = '';
  updateCount();
  render();
  amountInput.focus();
});

updateCount();
render();
