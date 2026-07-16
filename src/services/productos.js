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

export const productosIniciales = [
  {
    id: 1,
    nombre: 'Collar Dorado',
    precio: 45000,
    categoria: 'Accesorios',
    descripcion: 'Collar elegante para uso diario y eventos especiales.',
    stock: 8,
    imagen: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    nombre: 'Bolso de Tela',
    precio: 68000,
    categoria: 'Bolsos',
    descripcion: 'Bolso moderno, práctico y con diseño minimalista.',
    stock: 5,
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    nombre: 'Set de Cosméticos',
    precio: 59000,
    categoria: 'Belleza',
    descripcion: 'Kit de cuidado personal con productos esenciales.',
    stock: 10,
    imagen: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    nombre: 'Vestido Casual',
    precio: 87000,
    categoria: 'Ropa',
    descripcion: 'Vestido cómodo para salir, trabajar o combinar en cualquier ocasión.',
    stock: 4,
    imagen: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'
  }
];

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

export const productos = readProductos();
