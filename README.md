Project Overview
SupplyChainIQ is an AI-powered supply chain management system developed using the MERN stack. It optimizes inventory, orders, and logistics through predictive analytics, automated notifications, and efficient supplier management.

1. Installation
Prerequisites:
Node.js (v14 or later)
MongoDB (Cloud or local setup)
Git 

Steps:
Clone the repository: git clone https://github.com/swadha112/SupplyChainIQ.git
Navigate to the project folder
Install dependencies for both the frontend and backend: npm install


2. Configuration
Backend Configuration
Create a .env file in the backend directory and add  environment variables
Configure API keys for notifications if applicable: Twilio for SMS notifications, Nodemailer or SMTP credentials for email notifications.

Frontend Configuration
In the frontend directory, create a .env file to specify the backend API URL

3. Running the Project
Start MongoDB (if running locally).
Start the Backend Server: npm start
Start the Frontend Server: npm run dev
Open your browser and navigate to http://localhost:5173 to access the application.

4. Usage
Dashboard: View real-time metrics for inventory, orders, and logistics.
Inventory Management: Add, update, and monitor stock levels. Automated low-stock alerts will notify you when thresholds are met.
Order Management: Track orders from creation to delivery with status updates.
Logistics Tracking: View shipment progress and estimated delivery times.
Supplier Communication: Automates reorder notifications via email and SMS when stock levels are low.



