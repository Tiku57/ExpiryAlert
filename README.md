<div align="center">
  <!-- Replace with actual logo if available -->
  <img src="https://via.placeholder.com/150x150.png?text=ExpiryAlert+Logo" alt="ExpiryAlert Logo" width="120" />
  
  # ExpiryAlert

  **The ultimate enterprise-grade document lifecycle and expiration management platform.**

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  
</div>

---

## 📖 Overview

**ExpiryAlert** is a robust, enterprise-grade SaaS platform designed to automate and simplify the tracking of document life cycles, compliance certificates, and essential contracts. 

In today's fast-paced corporate environment, missing a critical renewal deadline for an SLA, compliance certification, or insurance policy can lead to severe operational disruptions, hefty fines, or legal liabilities. **ExpiryAlert solves this real-world problem** by acting as a proactive centralized hub that monitors all sensitive deadlines. 

### Why Organizations Need ExpiryAlert:
- **Risk Mitigation**: Never miss a renewal deadline again with predictive alert systems.
- **Operational Efficiency**: Eliminate error-prone Excel spreadsheets and manual tracking workflows.
- **Compliance Automation**: Maintain continuous regulatory compliance by tracking audit dates and certification lifespans seamlessly.
- **Strategic Oversight**: High-level visibility into upcoming obligations allows for better budget forecasting and resource allocation.

By transforming document lifecycle management from a reactive chore into a proactive strategy, ExpiryAlert guarantees that your enterprise is always one step ahead.

---

## 🚀 Demo

- **Live Demo**: [https://expiryalert.demo.com](#) *(Placeholder)*
- **Demo Video**: [Watch on YouTube](#) *(Placeholder)*

> **Note:** The live demo is populated with realistic enterprise seed data to showcase the application's full potential out of the box.

---

## ✨ Features

### 📊 Dashboard
- **KPI Cards**: Instantly view total, active, expiring soon, and critical records.
- **Expiry Analytics**: Interactive data visualizations showing expiry distribution.
- **Charts**: Custom, beautifully themed Recharts tooltips replacing default styles.
- **Category Insights**: Breakdowns of documents by type (e.g., Vendor Contracts, Compliance).
- **Upcoming Deadlines**: Quick-access timeline of impending expirations.

### 🗂️ Record Management
- **Create & Edit Records**: Comprehensive forms with advanced validation.
- **Delete & Bulk Delete**: Optimistic UI state updates for instant deletion feedback.
- **Renew Records**: Seamless workflow to update expiry dates and archive previous histories.
- **Search, Sort & Filter**: Lightning-fast data tables powered by TanStack Table.
- **Pagination**: Efficient server-side data slicing.
- **Categorization & Departments**: Group items intuitively based on enterprise architecture.
- **Priority Management**: Tag records as Low, Medium, High, or Critical.

### 🔔 Notifications
- **Smart Alerts**: Auto-generated triggers for `Critical` and `Expiring Soon` records.
- **Mark All As Read**: Effortless inbox-zero functionality with real-time UI synchronization.
- **Notification Badge**: Global navbar indicator for pending alerts.
- **Renewal Reminders**: Proactive nudges before documents expire.

### 📂 File Management
- **Upload & Download Documents**: Secure attachment processing.
- **Attachment Support**: Link multiple digital files per record.
- **Validation**: Strict size and format checking upon upload.

### 📈 Analytics
- **Monthly Expiry Trends**: Visually map which months require the most renewal budgets.
- **Category Distribution**: Understand where your compliance liabilities are concentrated.
- **Dashboard Metrics**: Executive-level summaries.

### 🔐 Authentication
- **Secure Login & Registration**: Powered by NextAuth.js.
- **Session Management**: Persistent, secure enterprise sessions.

### ⚙️ Settings
- **Profile & Organization Management**: Update tenant details and personal avatars.
- **Security & Preferences**: Customize the user experience.

### 🎨 UI / UX
- **Responsive Design**: Flawless execution across Desktop, Tablet, and Mobile.
- **Enterprise Dark Theme**: Sleek, modern, and easy on the eyes.
- **Smooth Animations**: Micro-interactions (fade-ins, scale-ups) powered by Framer Motion.
- **Accessible Components**: Screen-reader friendly architecture using Radix UI.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js (App Router)](https://nextjs.org/) & [React 18](https://react.dev/) |
| **Backend** | Next.js Server Actions & API Routes |
| **Database** | PostgreSQL (or SQLite for dev) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication**| [NextAuth.js (Auth.js)](https://next-auth.js.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🏗️ Architecture

ExpiryAlert operates on a modern, monolithic serverless architecture utilizing the Next.js App Router paradigm.

- **Client**: Highly interactive React components utilizing optimistic UI patterns to provide instant feedback without requiring page reloads.
- **Server**: Next.js Server Components for high-performance initial page loads and SEO, coupled with Server Actions for secure, direct database mutations.
- **Database**: A relational database structured for multi-tenant SaaS environments, seamlessly queried via Prisma ORM.
- **API Layer**: Exposes secure endpoints for file uploads, auth callbacks, and external webhooks.
- **Authentication Layer**: NextAuth handles session tokens, password hashing (bcrypt), and route protection middleware.
- **Storage Layer**: Local filesystem routing for development, engineered to easily scale to AWS S3 or Vercel Blob for production attachment storage.

---

## 📁 Folder Structure

```text
expiry-alert/
├── prisma/
│   ├── schema.prisma       # Database schema and models
│   └── seed.ts             # High-quality enterprise demo data seeder
├── public/
│   └── uploads/            # Local attachment storage
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, APIs)
│   │   ├── (auth)/         # Authentication routes (Login, Register)
│   │   ├── actions/        # Server Actions (CRUD operations)
│   │   ├── api/            # REST APIs (NextAuth, File Uploads)
│   │   ├── dashboard/      # Protected dashboard application
│   │   └── globals.css     # Global Tailwind imports
│   ├── components/         # Reusable React components
│   │   ├── dashboard/      # Analytics, Charts, Stat Cards
│   │   ├── layout/         # Sidebars, Navbars, Popovers
│   │   ├── records/        # Data Tables, Forms, Row Actions
│   │   └── ui/             # shadcn/ui generic components
│   └── lib/                # Utility functions, Prisma Client, Logic
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tailwind.config.ts      # Tailwind CSS configuration
```

---

## 🗄️ Database Schema

The database is built for a multi-tenant environment with scalable relationships:

- **`User`**: Represents individuals utilizing the platform. Contains authentication details and links to a primary Organization.
- **`Organization`**: The top-level tenant. All records, users, and categories belong to an organization, ensuring absolute data isolation.
- **`Record`**: The core entity tracking documents. Stores title, expiry dates, status, vendor details, and priority levels.
- **`Attachment`**: Represents digital files (PDFs, Images) tied to a specific `Record`.
- **`Notification`**: An inbox system tied to a specific `User`. Flags records that enter critical timeframes.
- **`RenewalHistory`**: A historical ledger. Whenever a record is renewed, its previous state is archived here for audit trailing.

<details>
<summary>View Prisma Schema Relationships</summary>

```prisma
model User {
  id             String        @id @default(cuid())
  email          String        @unique
  organizationId String
  Organization   Organization  @relation(fields: [organizationId], references: [id])
  Notifications  Notification[]
}

model Record {
  id             String        @id @default(cuid())
  title          String
  expiryDate     DateTime
  organizationId String
  Attachments    Attachment[]
  History        RenewalHistory[]
}
```
</details>

---

## 🖼️ Screenshots

<div align="center">

| Landing Page | Dashboard Analytics |
|:---:|:---:|
| <img src="https://via.placeholder.com/600x350.png?text=Landing+Page" width="400" /> | <img src="https://via.placeholder.com/600x350.png?text=Dashboard+Analytics" width="400" /> |

| Record Management | Smart Notifications |
|:---:|:---:|
| <img src="https://via.placeholder.com/600x350.png?text=Data+Table" width="400" /> | <img src="https://via.placeholder.com/600x350.png?text=Notification+Popover" width="400" /> |

</div>

---

## 💻 Installation

Get ExpiryAlert running locally in just a few minutes.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Tiku57/ExpiryAlert.git
cd ExpiryAlert
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
*Edit the `.env` file to include your secure database strings and auth secrets.*

### 4. Run Prisma Migrations
```bash
npm run prisma:migrate
```

### 5. Seed the database (Optional but highly recommended)
This will populate the application with ~50 realistic enterprise records.
```bash
npm run prisma:seed
```

### 6. Start the development server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the application!

---

## 🔐 Environment Variables

Reference the `.env.example` file. You must set these in your deployment environment.

```env
# Database Connection (e.g. PostgreSQL, Supabase, Neon, or local SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
# Generate a secret using: `openssl rand -base64 32`
NEXTAUTH_SECRET="your_super_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm install` | Installs all project dependencies. |
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to identify and report code issues. |
| `npm run prisma:generate`| Generates the Prisma Client based on your schema. |
| `npm run prisma:migrate` | Pushes the schema state to your database. |
| `npm run prisma:seed` | Populates the database with realistic demo data. |

---

## ⚡ Performance 

ExpiryAlert achieves near-instantaneous interaction speeds through:
- **Optimistic UI Updates**: Table deletions and notification dismissals update the client state instantly while syncing with the server in the background.
- **Server Components**: Massive reduction in JavaScript bundle sizes sent to the browser.
- **Pagination & Throttling**: Efficient data fetching strategies prevent browser memory leaks on large datasets.

---

## 🛡️ Security

Security is critical when handling enterprise contracts:
- **Authentication**: JWT-based secure sessions.
- **Data Validation**: End-to-end type safety using Zod parsing on all user inputs.
- **Multi-Tenant Isolation**: Database queries are strictly scoped by `organizationId`.
- **File Validation**: Malicious uploads are blocked via strict MIME-type and size checks.

---

## 🛣️ Future Roadmap

We are continuously evolving ExpiryAlert. Planned features include:
- [ ] **Email & SMS Reminders**: Automated outbound alerts via SendGrid/Twilio.
- [ ] **WhatsApp Notifications**: Enterprise alerts sent directly to WhatsApp.
- [ ] **AI-Powered Expiry Prediction**: Suggesting renewal lead times based on contract complexity.
- [ ] **OCR Document Scanning**: Auto-extracting expiry dates directly from uploaded PDFs.
- [ ] **Cloud Storage**: Native AWS S3 and Google Cloud Storage integration.
- [ ] **Team Collaboration**: @mentions and commenting on records.
- [ ] **Audit Logs**: Indelible tracking of every action taken within an organization.
- [ ] **Role-Based Access Control (RBAC)**: Admin, Manager, and Viewer permissions.
- [ ] **Calendar Integration**: Export expirations directly to Google Calendar or MS Outlook.
- [ ] **Webhook Support & REST API**: For seamless integration with existing ERPs.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code passes `npm run lint` and `npm run build` prior to submitting a PR.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📫 Contact

- **GitHub**: [@Tiku57](https://github.com/Tiku57)
- **LinkedIn**: [Your Name](#) *(Placeholder)*
- **Portfolio**: [Your Portfolio](#) *(Placeholder)*
- **Email**: [your.email@example.com](mailto:your.email@example.com) *(Placeholder)*

<div align="center">
  <sub>Built with ❤️ for the enterprise.</sub>
</div>
