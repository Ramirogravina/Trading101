# Trading101 Portfolio Simulator (Web App)

Web app responsive (mobile-first) para simular y trackear portfolios ficticios con transacciones históricas.

## Stack
- React + TypeScript + Vite
- React Router DOM
- Recharts
- localStorage
- Deploy recomendado: Vercel

## Ejecución local
```bash
npm run dev
```

> Nota: en este entorno de evaluación no se ejecuta `npm install` por restricciones de red/política del registry.

## Build
```bash
npm run build
npm run preview
```

## Estructura de carpetas
```text
src/
  components/            # UI reutilizable (modal, chart)
  data/                  # Datos mockeados iniciales
  hooks/                 # Persistencia localStorage
  layouts/               # Shell + navegación
  pages/                 # Dashboard, portfolio, analytics, asset detail
  types/                 # Tipos de dominio
  utils/                 # Lógica de cálculo portfolio
  App.tsx                # Rutas + estado principal
  main.tsx               # Entry point
  styles.css             # Estilo dark mode mobile-first
```

## Flujo funcional
1. Agregás una transacción desde el botón flotante.
2. La app calcula automáticamente shares = investedAmount / purchasePrice.
3. Agrupa transacciones por ticker y calcula:
   - avg cost
   - current value
   - P/L
   - retorno %
   - allocation
4. Guarda todo en localStorage.

## Pantallas
- Dashboard/Home
- Portfolio holdings
- Add transaction modal
- Asset detail page
- Analytics page

## Dónde pegar cada archivo
Pegá exactamente cada archivo en la misma ruta incluida en este repositorio. Si creás el proyecto desde cero, copiá:
- Config raíz: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`
- Código fuente en `src/**`
- Documentación en `README.md`

## Preparado para futura API market data
La app hoy usa `src/data/mockAssets.ts`. Luego podés reemplazar este origen por un provider/API sin romper la UI porque la lógica está separada en `utils` + `hooks`.

## Deploy en Vercel (con GitHub)
1. Subí el repo a GitHub.
2. Entrá a Vercel y `New Project`.
3. Importá el repo.
4. Framework: Vite (autodetect).
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy.
