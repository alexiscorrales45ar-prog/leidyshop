const DEFAULT_VENDEDOR_WHATSAPP = '573001234567';
const WHATSAPP_STORAGE_KEY = 'leidyshop-vendedor-whatsapp';

export function readVendedorWhatsapp() {
  if (typeof window === 'undefined') {
    return DEFAULT_VENDEDOR_WHATSAPP;
  }

  const stored = window.localStorage.getItem(WHATSAPP_STORAGE_KEY);
  return stored || DEFAULT_VENDEDOR_WHATSAPP;
}

export function saveVendedorWhatsapp(numero) {
  if (typeof window !== 'undefined') {
    const normalized = String(numero || '').replace(/\D/g, '');
    window.localStorage.setItem(
      WHATSAPP_STORAGE_KEY,
      normalized || DEFAULT_VENDEDOR_WHATSAPP
    );
  }
}