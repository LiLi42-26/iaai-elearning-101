# IAAI eLearning 101

> Plateforme e-learning interactive pour l'apprentissage de l'Intelligence Artificielle — conçue pour les débutants francophones et arabophones.

**Projet de Fin d'Études — Université Mundiapolis, Casablanca**  

🔗 **Production** : [iaai-elearning-101.vercel.app](https://iaai-elearning-101.vercel.app)

---

## 📋 Description

IAAI eLearning 101 est une plateforme d'apprentissage en ligne proposant un parcours structuré en 8 modules couvrant les fondements de l'IA jusqu'aux LLMs et à l'IA générative. Elle intègre un chatbot RAG (ARIA), des vidéos animées générées avec Manim, un système de quiz, un suivi de progression, et un modèle freemium avec paiement Stripe.

### Fonctionnalités principales

- 🎓 **Parcours IA structuré** — 8 modules / 42 leçons / ~35 heures de contenu
- 🤖 **ARIA** — Chatbot RAG propulsé par Gemini 2.5 Flash + pgvector
- 🎬 **Vidéos Manim** — Animations pédagogiques générées en Python (style 3Blue1Brown)
- 📊 **Quiz interactifs** — Évaluation par module avec score, timer et résultats détaillés
- 📈 **Suivi de progression** — Tableau de bord personnalisé avec statistiques en temps réel
- 💳 **Modèle freemium** — Paiement unique 299 MAD via Stripe Checkout
- 🌐 **Internationalisation** — Support FR/AR avec RTL via i18next
- 🔐 **Sécurité** — Supabase RLS sur toutes les tables, JWT, anti-triche quiz
- 🐳 **Docker** — Conteneurisation multi-stage (Node 22 builder → Nginx Alpine)

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|---|---|
| Frontend | React 19, Vite 8, TailwindCSS 3 |
| Routing | React Router 7 |
| State | Zustand 5 |
| Backend | Supabase (PostgreSQL, Auth, RLS, Edge Functions Deno) |
| IA / RAG | Gemini 2.5 Flash, gemini-embedding-001, pgvector |
| Paiement | Stripe Checkout |
| i18n | i18next, react-i18next |
| Animations | Manim CE (Python) |
| Déploiement | Vercel (frontend), Supabase Edge Functions (backend) |
| Conteneurisation | Docker + Nginx |

---

## 🏗️ Architecture

```
iaai-elearning-101/
├── src/
│   ├── pages/          # 25 pages JSX (Auth, Dashboard, Learning, Quiz, Admin...)
│   ├── services/       # 8 services Supabase (auth, quiz, progress, aria, cours...)
│   ├── store/          # Zustand (authStore)
│   ├── router/         # AppRouter, PrivateRoute, AdminRoute
│   ├── layouts/        # AppLayout, AdminLayout, AuthLayout, PublicLayout
│   ├── components/     # Composants réutilisables (UI, layout)
│   ├── i18n/           # Traductions FR/AR
│   └── constants/      # Routes, config
├── supabase/
│   ├── functions/
│   │   ├── aria/            # Edge Function RAG chatbot
│   │   ├── stripe-checkout/ # Edge Function Stripe session
│   │   └── stripe-webhook/  # Edge Function confirmation paiement
│   └── migrations/          # Scripts SQL
├── Manim/              # Scripts Python de génération vidéo
├── public/
│   └── videos/         # Vidéos Manim générées (.mp4)
├── Dockerfile
└── vercel.json
```

---

## 🚀 Installation locale

### Prérequis

- Node.js 20+
- npm
- Compte Supabase
- Compte Stripe (mode Test)

### 1. Cloner le projet

```bash
git clone https://github.com/SALMA-isser26/iaai-elearning-101.git
cd iaai-elearning-101
git checkout develop
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d'environnement

Crée un fichier `.env` à la racine :

```env
# Supabase
VITE_SUPABASE_URL=https://ton-projet-ref.supabase.co
VITE_SUPABASE_ANON_KEY=ta_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
```

### 4. Lancer en développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

---

## 🗄️ Base de données

| Table | Description |
|---|---|
| `profiles` | Profils utilisateurs (plan, rôle, progression) |
| `modules` | Les 8 modules du parcours |
| `lessons` | Les leçons par module |
| `quizzes` | Quiz par module |
| `questions` | Questions des quiz |
| `answers` | Réponses (is_correct côté serveur uniquement) |
| `quiz_attempts` | Tentatives et scores |
| `user_progress` | Progression leçon par leçon |
| `user_activity` | Historique d'activité |
| `user_stats` | Statistiques agrégées |
| `lesson_chunks` | Chunks de contenu pour le RAG (ARIA) |
| `certificates` | Certificats de complétion |

---

## ☁️ Edge Functions Supabase

| Fonction | Rôle |
|---|---|
| `aria` | Chatbot RAG : embed → similarity search → Gemini 2.5 Flash |
| `stripe-checkout` | Crée une session Stripe Checkout (299 MAD) |
| `stripe-webhook` | Écoute `checkout.session.completed` → met à jour `plan = 'premium'` |

### Déploiement des fonctions

```bash
supabase functions deploy aria --project-ref <project-ref>
supabase functions deploy stripe-checkout --project-ref <project-ref>
supabase functions deploy stripe-webhook --project-ref <project-ref>
```

### Secrets requis

```bash
supabase secrets set GEMINI_API_KEY=...
supabase secrets set SB_URL=...
supabase secrets set SB_SERVICE_ROLE_KEY=...
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_PRICE_ID=price_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set APP_URL=https://iaai-elearning-101.vercel.app
```

---

## 💳 Modèle freemium

| Fonctionnalité | Gratuit | Premium (299 MAD) |
|---|---|---|
| Module 1 | ✅ | ✅ |
| Modules 2 à 8 | ❌ | ✅ |
| Quiz complets | ❌ | ✅ |
| Certificat | ❌ | ✅ |
| ARIA Chatbot | Limité | Illimité |
| Suivi progression | ✅ | ✅ |

---

## 🐳 Docker

```bash
docker build -t iaai-elearning-101 .
docker run -p 80:80 iaai-elearning-101
```

---

## 🧪 Compte de test

```
# Carte Stripe (mode Test uniquement)
Numéro   : 4242 4242 4242 4242
Expiry   : 12/26
CVC      : 123
```

---

## 👩‍💻 Auteure

**Salma ISSER** — Étudiante en Informatique Appliquée (Développement Logiciel)  
Université Mundiapolis, Casablanca  

---

*Projet académique — IAAI eLearning 101 © 2026*