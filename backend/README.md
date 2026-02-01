# LandX Backend

A simple Node.js/Express backend for LandX, using a local JSON file for data persistence.

## Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    npm start
    ```

The server will run on `http://localhost:4000`.

## API Endpoints

-   `GET /api/properties`: List all properties
-   `GET /api/properties/:id`: Get a property details
-   `GET /api/users/:id`: Get user profile (including transactions)
-   `PUT /api/users/:id`: Update user profile `{ name?, email? }`
-   `GET /api/investments?userId=:id`: Get user investments
-   `POST /api/kyc`: Submit KYC verify `{ userId }`
-   `POST /api/wallet/add-funds`: Add funds `{ userId, amount }`
-   `POST /api/wallet/withdraw-rent`: Withdraw rent `{ userId, amount }`
-   `POST /api/invest`: Invest in property `{ userId, propertyId, amount }`
-   `POST /api/payments/create-order`: Create payment order `{ userId, amount, propertyId?, description? }`
-   `POST /api/payments/verify`: Verify payment `{ orderId, paymentId, signature, userId, amount, propertyId? }`
-   `GET /api/payments/order/:orderId`: Get payment order status

## Data
Data is stored in `db.json`. You can edit this file directly to modify initial data.
