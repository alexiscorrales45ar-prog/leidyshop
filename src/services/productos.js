const DEFAULT_VENDEDOR_WHATSAPP = '573001234567';
const STORAGE_KEY = 'leidyshop-productos';
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
    window.localStorage.setItem(WHATSAPP_STORAGE_KEY, normalized || DEFAULT_VENDEDOR_WHATSAPP);
  }
}
export function readProductos() {
  if (typeof window === 'undefined') {
    return [...productosIniciales];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productosIniciales));
    return [...productosIniciales];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [...productosIniciales];
  }
}

export function saveProductos(productos) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  }
}


