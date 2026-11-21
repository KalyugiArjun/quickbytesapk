# 🍕 QuickBite — Food Ordering Platform
> **Tagline:** *Khaao Pio Moj Karo*

QuickBite is a modern, full-stack, enterprise-grade food ordering and restaurant management platform built with React, Vite, Node.js, Express, and MongoDB.

---

## 🎨 Unified Brand & Design System

QuickBite uses **one consistent design language and color theme** across all 3 user roles (**Customer**, **Vendor / Restaurant Owner**, and **Admin / Super Admin**):

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Background** | `#111111` | Application base background |
| **Secondary Background** | `#1C1C1C` | Sidebars, navbars, drawers |
| **Card Background** | `#242424` | Food cards, metric widgets, modals |
| **Primary Orange** | `#FF7900` | Brand identity, primary CTAs, active highlights |
| **Secondary Orange** | `#FF5A00` | Accent gradients, badges, promotions |
| **Primary Text** | `#FFFFFF` | Headings, high emphasis text |
| **Secondary Text** | `#A3A3A3` | Labels, descriptions, subtotals |
| **Border Color** | `#333333` | Clean dark card and input outlines |
| **Success Color** | `#22C55E` | Pure Veg indicators, delivered status, discounts |
| **Error Color** | `#EF4444` | Cancellations, errors, warnings |

---

## 👥 Three Roles & Capabilities

### 1. 🍽️ Customer Role
- **Home Experience**: Hero search, categories (Biryani & Bowls, Woodfired Pizza, North Indian Thalis, South Indian, Desserts), featured top restaurants, and verified promo code banners (`QUICKBITE50`, `MOJKARO`, `FEAST20`).
- **Storefront & Menu Catalog**: Dynamic cuisine filtering, Pure Veg toggle, item reviews, add-to-cart with real-time quantity modifiers.
- **Cart & Slide-Over Drawer**: Coupon code validation and live recalculation, delivery fee breakdown, taxes & GST.
- **Checkout**: Address management, delivery instructions, payment method selection (**Cash on Delivery**, **QuickBite Wallet**, **UPI / QR**, **Credit/Debit Card**), and celebratory confetti animation upon completion.
- **Real-Time Live Order Tracking**: Animated step-by-step progress stepper:
  $$\text{Placed} \longrightarrow \text{Confirmed} \longrightarrow \text{Kitchen Preparing} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- **Customer Account**: Profile details, saved addresses, wallet balance indicator, and past order history with 1-click **Reorder**.

### 2. 👨‍🍳 Vendor / Restaurant Owner Role
- **Vendor Dashboard**: Real-time KPI metrics (Gross Revenue, Total Orders, Active Tickets, Kitchen Rating), Top-selling dishes breakdown, and instant **Open Kitchen / Close Kitchen** live toggle.
- **Order Pipeline**: Orders organized by state (New/Placed, Confirmed, Preparing, Dispatched, Delivered, Cancelled) with single-click status updates and order detail modals.
- **Menu Management**: Add new dishes, edit pricing, upload image URLs, spicy levels, prep time, and instant **In Stock / Out of Stock** switch.
- **Kitchen Profile & Logistics**: Storefront name, tagline, description, banner, cuisines, delivery fee, minimum order value, and prep time configuration.
- **Customer Reviews**: Real-time review feed with kitchen reply functionality.

### 3. 🛡️ Admin / Super Admin Role
- **Platform Analytics**: Gross Merchandise Value (GMV), platform commission cut earnings (10%), total registered customers, and partner counts.
- **Restaurant Governance**: Approve/suspend vendor applications, customize platform commission rates per vendor.
- **Global Order Inspector**: Filter and monitor live orders across all restaurants in the city.
- **Coupons & Deals Management**: Create and delete site-wide promotional discount codes.
- **Category Taxonomy**: Add and manage platform food categories.
- **User Directory**: View registered customers and vendors, with suspend/reactivate controls.

---

## ⚡ Instant 1-Click Demo Logins

To test all 3 roles without manual typing, open `/login` or use the profile menu dropdown in the navbar:

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@quickbite.com` | `password123` | Default addresses, ₹850 Wallet Balance, order history |
| **Vendor** | `vendor1@quickbite.com` | `password123` | The Royal Dum Biryani & Kebabs restaurant |
| **Admin** | `admin@quickbite.com` | `password123` | Full platform control & governance |

---

## 🚀 Running the Project Locally

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
*Note: The backend connects to `process.env.MONGODB_URI` if provided. If MongoDB is not running locally, it automatically initializes an embedded in-memory MongoDB database with full demo data so you can test immediately with zero configuration!*

### 2. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 📱 Future Deployment & Mobile APK

1. **Backend**: Ready to deploy on Render or Railway (`cd backend && npm start`).
2. **Frontend**: Ready to deploy on Vercel or Netlify (`cd frontend && npm run build`).
3. **Database**: Point `MONGODB_URI` to MongoDB Atlas in `backend/.env`.
4. **Android APK via Capacitor**:
   ```bash
   cd frontend
   npm run build
   npx cap add android
   npx cap copy
   npx cap open android
   ```
   *Capacitor config file is included at `capacitor.config.json` with App ID `com.quickbite.app`.*

---
*QuickBite — Khaao Pio Moj Karo!*
