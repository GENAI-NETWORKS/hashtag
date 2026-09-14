# Hashtag — Custom Printing E-Commerce App

> **Custom Prints • T-Shirts • Notebooks • More**  
> Salem's fastest custom printing service — Blinkit-style UX for personalized print products.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma)](https://prisma.io)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479a1?logo=mysql)](https://mysql.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR/SSG) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Icons | lucide-react |
| State | Zustand (cart, auth) |
| Server State | TanStack React Query |
| Database | MySQL (Hostinger) |
| ORM | Prisma 5 |
| Auth | JWT in httpOnly cookies |
| Uploads | Multer (local VPS storage) |
| Forms | React Hook Form + Zod |
| Carousel | Embla Carousel |
| Toasts | react-hot-toast |

---

## Project Structure

```
src/
├── app/
│   ├── api/               # All API routes
│   │   ├── auth/          # login, register, logout, me
│   │   ├── categories/    # GET /api/categories
│   │   ├── products/      # GET list, GET [slug]
│   │   ├── cart/          # GET, POST, PATCH [id], DELETE [id]
│   │   ├── orders/        # GET list, POST, GET [id]
│   │   ├── addresses/     # GET, POST
│   │   ├── coupons/       # GET validate
│   │   └── admin/         # orders, products, analytics
│   ├── (pages)/
│   │   ├── page.tsx           # Home
│   │   ├── products/          # Category listing
│   │   ├── products/[slug]/   # Product detail + customizer
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout stepper
│   │   ├── orders/            # My orders + [id] tracking
│   │   ├── auth/login/        # Login + Register
│   │   ├── about/             # About (LocalBusiness AEO)
│   │   └── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout + SEO metadata
│   ├── globals.css        # Brand design system (Tailwind v4)
│   ├── sitemap.ts         # Auto-generated sitemap
│   └── robots.ts          # robots.txt
├── components/
│   ├── layout/            # Header, BottomNav, CartBar
│   ├── product/           # ProductCard, CategoryChip
│   └── ui/                # Skeleton loaders
├── store/                 # Zustand stores
├── lib/                   # Prisma client, auth utils, helpers
└── types/                 # TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8.0+ (Hostinger or local)
- npm

### 1. Clone & Install

```bash
git clone <your-repo>
cd hashtag
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/hashtag_db"
JWT_SECRET="your-32-char-random-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to MySQL (creates all tables)
npm run db:push

# Seed with categories + sample products
npm run db:seed
```

### 4. Create Upload Directory

```bash
mkdir -p public/uploads/products
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

**Admin login:** `admin@hashtagprints.in` / `Admin@123`  
**Admin dashboard:** `http://localhost:3000/admin`

---

## Hostinger VPS Deployment

### Prerequisites on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Install PM2 for process management
npm install -g pm2

# Install MySQL 8
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### MySQL Setup on Hostinger

```sql
-- Connect to MySQL
sudo mysql -u root -p

-- Create database and user
CREATE DATABASE hashtag_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hashtag_user'@'localhost' IDENTIFIED BY 'StrongPassword@123';
GRANT ALL PRIVILEGES ON hashtag_db.* TO 'hashtag_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Deploy Application

```bash
# Upload files to VPS (example with rsync)
rsync -avz --exclude node_modules --exclude .next . user@your-vps-ip:/var/www/hashtag/

# SSH into VPS
ssh user@your-vps-ip

# Navigate to app directory
cd /var/www/hashtag

# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env
nano .env  # Fill in production values

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Create uploads directory
mkdir -p public/uploads/products

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "hashtag" -- start
pm2 save
pm2 startup  # Follow the instructions to auto-start on reboot
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/hashtag
server {
    listen 80;
    server_name hashtagprints.in www.hashtagprints.in;

    client_max_body_size 20M;  # For design uploads

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hashtag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Add SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d hashtagprints.in -d www.hashtagprints.in
```

### Production `.env` Values

```env
DATABASE_URL="mysql://hashtag_user:StrongPassword@123@localhost:3306/hashtag_db"
JWT_SECRET="<generate with: openssl rand -base64 32>"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="https://hashtagprints.in"
NODE_ENV="production"
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE_MB=10
ADMIN_EMAIL="admin@hashtagprints.in"
```

---

## Adding Razorpay Payments

When ready to enable real payments:

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Add to `.env`:
   ```env
   RAZORPAY_KEY_ID="rzp_live_XXXXXXXXXXXXXXXX"
   RAZORPAY_KEY_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_XXXXXXXXXXXXXXXX"
   ```
3. Install: `npm install razorpay`
4. Replace the mock payment section in `src/app/checkout/page.tsx` with Razorpay checkout integration

---

## SEO & AEO Strategy

- **JSON-LD**: Organization, LocalBusiness, Product, FAQPage, BreadcrumbList on all pages
- **FAQ sections**: On Home, About, category, and product pages — optimized for AI answer engines
- **Sitemap**: Auto-generated from live product/category data at `/sitemap.xml`
- **robots.txt**: Blocks `/admin`, `/api`, personal pages; allows all product/category pages
- **Canonical URLs**: Clean slugs on all product and category pages
- **Salem-specific copy**: All pages include "Salem", "Tamil Nadu", location-based delivery info
- **Structured data**: NAP (Name, Address, Phone) consistency across Organization and LocalBusiness schemas

---

## Brand Design System

The brand design tokens are defined in `src/app/globals.css` using Tailwind v4's CSS-first approach:

| Token | Value | Usage |
|---|---|---|
| `--color-cyan` | `#00AEEF` | Primary CTA, links, active states |
| `--color-magenta` | `#EC008C` | Accent, badges, cart bar |
| `--color-yellow` | `#FFD700` | Highlights, ratings |
| `--color-ink` | `#111111` | Primary text, dark buttons |

The `.cmyk-gradient`, `.cmyk-text`, `.cmyk-divider` utility classes apply the CMYK ink-splash motif throughout the UI.

---

## Common Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:push      # Sync schema to database
npm run db:seed      # Seed categories + products
npm run db:studio    # Prisma Studio (visual DB editor)
npm run lint         # ESLint
```

---

## Default Admin Credentials

> Change these immediately after first deployment!

- **Email**: `admin@hashtagprints.in`
- **Password**: `Admin@123`
- **Dashboard**: `/admin`

---

## License

MIT — Built for Hashtag Custom Prints, Salem, Tamil Nadu.
