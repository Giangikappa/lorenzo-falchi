# Lorenzo Falchi — E-commerce Gioielli

## Setup

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Configura il database
```bash
# Genera il client Prisma e crea il database SQLite
npx prisma migrate dev --name init

# (Opzionale) Seed con le categorie base
npm run db:seed
```

### 3. Configura le variabili d'ambiente
Copia `.env.example` in `.env.local` e modifica:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="scegli-una-stringa-segreta-lunga"
ADMIN_PASSWORD="la-tua-password-admin"
```

### 4. Avvia in sviluppo
```bash
npm run dev
```

---

## Struttura

| URL | Descrizione |
|-----|-------------|
| `/` | Home (Hero, Prodotti, Chi sono, Lead Gen) |
| `/shop` | Negozio con filtri |
| `/products/[slug]` | Pagina prodotto (generata automaticamente) |
| `/admin` | Dashboard amministratore |
| `/admin/login` | Login admin (password: vedi `.env.local`) |
| `/admin/products` | Gestione prodotti |
| `/admin/products/new` | Crea nuovo prodotto |
| `/admin/products/[id]/edit` | Modifica prodotto |
| `/admin/leads` | Contatti (richieste gioielli personalizzati) |
| `/admin/preorders` | Pre-ordini |
| `/admin/coupons` | Gestione coupon sconto |

---

## Funzionalità prodotti

- **ACTIVE** — disponibile all'acquisto
- **SOLD_OUT** — esaurito, bottone acquisto nascosto
- **PRE_ORDER** — non acquistabile, appare form contatto per essere avvisati
- **DRAFT** — non visibile al pubblico
- **Edizione Limitata** — badge speciale, filtro dedicato
- **Prezzo scontato** — mostra prezzo barrato + percentuale sconto
- **Varianti/taglie** — stock per taglia
- **Slug automatico** — la pagina prodotto si crea automaticamente dal nome

---

## API

| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | `/api/products` | Lista prodotti pubblici |
| POST | `/api/products` | Crea prodotto (admin) |
| PUT | `/api/products/[id]` | Aggiorna prodotto (admin) |
| DELETE | `/api/products/[id]` | Elimina prodotto (admin) |
| POST | `/api/leads` | Salva contatto lead gen |
| POST | `/api/preorders` | Registra pre-ordine |
| POST | `/api/coupons/validate` | Valida coupon |
| POST | `/api/coupons` | Crea coupon (admin) |
| PATCH | `/api/coupons/[id]` | Attiva/disattiva coupon (admin) |
| DELETE | `/api/coupons/[id]` | Elimina coupon (admin) |

---

## Deploy (Vercel + PlanetScale/Supabase)

1. Cambia `DATABASE_URL` con stringa PostgreSQL/MySQL
2. Nel `schema.prisma` cambia `provider = "sqlite"` → `"postgresql"`
3. `npx prisma migrate deploy`
4. Deploy su Vercel
