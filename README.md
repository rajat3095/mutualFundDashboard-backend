# mutualFundDashboard-backend

It is a mutual fund dashboard where the investor return is visible. Portfolio summary, analytics and portfolio wise holding is visible.

# Mutual Fund Dashboard - Backend 📈

A robust backend service built with Node.js and JavaScript to power the Mutual Fund Dashboard. This API serves essential financial data, calculating investor returns, portfolio summaries, deep-dive analytics, and portfolio-wise holdings.

## 🚀 Features

- **Investor Returns Calculation:** Endpoints to compute and deliver accurate return metrics (e.g., XIRR, Absolute Return).
- **Portfolio Summary:** Aggregated views of total investments, current values, and overall profits/losses.
- **Analytics Engine:** Data processing for visual analytics and trend tracking over time.
- **Portfolio-Wise Holdings:** Detailed breakdown of individual mutual fund assets, NAV (Net Asset Value) updates, and unit allocations.
- **RESTful API:** Clean, JSON-based API responses structured for easy frontend integration.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** JavaScript
- **Framework:** Express.js
- **Package Manager:** npm

## 📂 Project Structure

```text
mutualFundDashboard-backend/
├── src/                  # Source code for controllers, models, and routes
├── .gitignore            # Files and folders ignored by git
├── index.js              # Entry point of the application
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Dependency versions tree
└── README.md             # Project documentation
```

⚙️ Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (v24 or higher recommended)

npm (comes with Node.js)

A Database (MongoDB) installed and running, depending on your configuration.

💻 Installation & Setup
Clone the repository:

Bash
git clone git@github.com:rajat3095/mutualFundDashboard-backend.git
cd mutualFundDashboard-backend
Install dependencies:

Bash
npm install
npm run dev

# For development

The server should now be running on http://localhost:5000 (or the port you configured).
