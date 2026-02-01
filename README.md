# LandX - Fractional Real Estate Investment Platform

LandX is a modern fintech platform designed to democratize real estate investment. It allows users to invest in high-value properties with fractional ownership, track portfolio performance, and manage returns seamlessly.

![LandX Banner](https://via.placeholder.com/1200x400?text=LandX+Fractional+Real+Estate)

## 🚀 Features

- **🏠 Property Marketplace**: Browse curated commercial and residential properties with detailed financial metrics (Rent Yield, Appreciation, Funded %).
- **💰 Fractional Investment**: Invest small amounts to own a fraction of premium real estate.
- **💳 Wallet System**: Integrated digital wallet to add funds, withdraw rent, and track transactions.
- **🛡️ KYC Compliance**: Secure identity verification workflow (`PENDING` -> `VERIFIED`) required before investing.
- **📊 Portfolio Dashboard**: Real-time tracking of total investment value, rental income, and asset appreciation.
- **🔒 Secure Payments**: Integration with **Razorpay** for secure deposits and transactions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context

### Backend
- **Server**: Node.js & Express.js (Port 4000)
- **Database**: 
  - **Prisma** (SQLite) for application data.
  - **JSON DB** (Lightweight mock DB for rapid prototyping).
- **Authentication**: Custom Auth with JWT (Simulation).
- **Payments**: Razorpay Node.js SDK.

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
│   ├── login/            # Authentication pages
│   ├── dashboard/        # User portfolio dashboard
│   ├── property/[id]/    # Individual property details
│   └── ...
├── backend/              # Express.js Backend Server
│   ├── server.js         # Main server logic
│   └── db.json           # Mock database file
├── components/           # Reusable UI components
├── lib/                  # Utility functions & server actions
└── prisma/               # Database schema & seed scripts
```

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/zoro-00/LandX.git
cd LandX
```

### 2. Install Dependencies
Install dependencies for the frontend:
```bash
npm install
```

Install dependencies for the backend:
```bash
cd backend
npm install
cd ..
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend` folder for payment integration (Optional for test mode):
```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

### 4. Run the Application
You need to run both the frontend and backend servers.

**Terminal 1: Backend**
```bash
npm run dev:backend
# Runs Express server on http://localhost:4000
```

**Terminal 2: Frontend**
```bash
npm run dev
# Runs Next.js app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing Credentials
You can use the following test credentials or sign up with a new account:
- **Email**: `user@example.com`
- **Password**: `password123`

## 💳 Payment Testing
The project is configured with Razorpay Test Mode.
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP**: `123456`

## 📄 License
This project is licensed under the MIT License.