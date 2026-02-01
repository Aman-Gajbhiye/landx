const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const PORT = 4000;
const DB_FILE = path.join(__dirname, 'db.json');

// Razorpay Configuration
// For development, use test keys. In production, use environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your actual key
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'thisisasecretkey' // Test secret - replace with your actual secret
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper functions for DB
function readDb() {
    if (!fs.existsSync(DB_FILE)) {
        return { users: [], properties: [], investments: [], transactions: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes

// Auth 1. Signup
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = readDb();
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In a real app, hash this!
        kycStatus: 'PENDING',
        walletBalance: 0,
        transactions: []
    };

    db.users.push(newUser);
    writeDb(db);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
});

// Auth 2. Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDb();

    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// 0. Root
app.get('/', (req, res) => {
    res.send('LandX Backend is Running!');
});

// 1. Properties
app.get('/api/properties', (req, res) => {
    const db = readDb();
    // Ensure all properties have required fields for consistency
    const properties = db.properties.map(p => ({
        ...p,
        totalValue: p.totalValue || p.totalAmount || 1000000,
        fundedAmount: p.fundedAmount || 0,
        image: p.image || '/images/property-placeholder.jpg'
    }));
    res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const property = db.properties.find(p => p.id === id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    // Ensure property has all required fields
    const formattedProperty = {
        ...property,
        totalValue: property.totalValue || property.totalAmount || 1000000,
        fundedAmount: property.fundedAmount || 0,
        image: property.image || '/images/property-placeholder.jpg'
    };
    res.json(formattedProperty);
});

// 2. User Profile
app.get('/api/users/:id', (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const user = db.users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Include recent transactions
    const transactions = db.transactions
        .filter(t => t.userId === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 50); // Limit to recent 50 transactions

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, transactions });
});

// 2b. Update User Profile
app.put('/api/users/:id', (req, res) => {
    const { name, email } = req.body;
    const db = readDb();
    const id = parseInt(req.params.id);
    const userIndex = db.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update fields if provided
    if (name) db.users[userIndex].name = name;
    if (email) {
        // Check if email is already taken by another user
        const emailExists = db.users.some(u => u.email === email && u.id !== id);
        if (emailExists) return res.status(400).json({ error: 'Email already exists' });
        db.users[userIndex].email = email;
    }

    writeDb(db);

    // Return updated user without password
    const { password, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
});

// 3. KYC Submission
app.post('/api/kyc', (req, res) => {
    const { userId } = req.body;
    const db = readDb();

    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    db.users[userIndex].kycStatus = 'VERIFIED';
    writeDb(db);

    res.json({ success: true, message: 'KYC Verified' });
});

// 4. Wallet - Add Funds
app.post('/api/wallet/add-funds', (req, res) => {
    const { userId, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update Balance
    db.users[userIndex].walletBalance += amount;

    // Record Transaction
    const newTransaction = {
        id: Date.now(),
        userId,
        amount,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        date: new Date().toISOString()
    };
    db.transactions.push(newTransaction);

    writeDb(db);
    res.json({ success: true, newBalance: db.users[userIndex].walletBalance });
});

// 4b. Wallet - Withdraw Rent (Simulate Payout)
app.post('/api/wallet/withdraw-rent', (req, res) => {
    const { userId, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update Balance (Rent Income -> Wallet)
    db.users[userIndex].walletBalance += amount;

    // Record Transaction
    const newTransaction = {
        id: Date.now(),
        userId,
        amount,
        type: 'RENT_PAYOUT',
        status: 'COMPLETED',
        date: new Date().toISOString()
    };
    db.transactions.push(newTransaction);

    writeDb(db);
    res.json({ success: true, newBalance: db.users[userIndex].walletBalance });
});

// 5. Invest
app.post('/api/invest', (req, res) => {
    const { userId, propertyId, amount } = req.body;
    const db = readDb();

    // 1. Validate User
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    const user = db.users[userIndex];

    // 2. Validate KYC
    if (user.kycStatus !== 'VERIFIED') {
        return res.status(403).json({ error: 'KYC not verified' });
    }

    // 3. Validate Balance
    if (user.walletBalance < amount) {
        return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // 4. Validate Property
    const propIndex = db.properties.findIndex(p => p.id === propertyId);
    if (propIndex === -1) return res.status(404).json({ error: 'Property not found' });

    // Perform Transaction
    // Deduct Balance
    db.users[userIndex].walletBalance -= amount;

    // Create Investment Record
    const newInvestment = {
        id: Date.now(),
        userId,
        propertyId,
        amount,
        date: new Date().toISOString()
    };
    db.investments.push(newInvestment);

    // Record Transaction
    const newTransaction = {
        id: Date.now() + 1, // Ensure unique ID
        userId,
        amount: -amount,
        type: 'INVESTMENT',
        status: 'COMPLETED',
        date: new Date().toISOString()
    };
    db.transactions.push(newTransaction);

    // Update Property Funded Amount
    db.properties[propIndex].fundedAmount = (db.properties[propIndex].fundedAmount || 0) + amount;

    writeDb(db);

    res.json({ success: true, investment: newInvestment });
});

// 6. User Investments
app.get('/api/investments', (req, res) => {
    const userId = parseInt(req.query.userId);
    if (!userId) return res.status(400).json({ error: 'UserId required' });

    const db = readDb();
    const userInvestments = db.investments.filter(i => i.userId === userId);

    // Enrich with property details
    const enrichedInvestments = userInvestments.map(inv => {
        const property = db.properties.find(p => p.id === inv.propertyId);
        return { ...inv, property };
    });

    res.json(enrichedInvestments);
});

// 7. Payment - Create Order
app.post('/api/payments/create-order', async (req, res) => {
    try {
        const { userId, propertyId, amount, description } = req.body;
        
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid payment details' });
        }

        const db = readDb();
        const user = db.users.find(u => u.id === userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt: `order_${Date.now()}_${userId}`,
            notes: {
                userId: userId.toString(),
                propertyId: propertyId?.toString() || '',
                description: description || 'Property Investment'
            }
        };

        const order = await razorpay.orders.create(options);

        // Store pending payment order in database
        if (!db.payments) db.payments = [];
        db.payments.push({
            orderId: order.id,
            razorpayOrderId: order.id,
            userId,
            propertyId: propertyId || null,
            amount,
            currency: 'INR',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        });
        writeDb(db);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: razorpay.key_id
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({ error: 'Failed to create payment order', details: error.message });
    }
});

// 8. Payment - Verify Payment
app.post('/api/payments/verify', async (req, res) => {
    try {
        const { orderId, paymentId, signature, userId, propertyId, amount } = req.body;

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({ error: 'Missing payment verification data' });
        }

        // Verify signature
        const text = orderId + '|' + paymentId;
        const generatedSignature = crypto
            .createHmac('sha256', razorpay.key_secret)
            .update(text)
            .digest('hex');

        if (generatedSignature !== signature) {
            return res.status(400).json({ error: 'Payment verification failed - Invalid signature' });
        }

        const db = readDb();

        // Update payment status
        if (!db.payments) db.payments = [];
        const paymentIndex = db.payments.findIndex(p => p.orderId === orderId);
        if (paymentIndex !== -1) {
            db.payments[paymentIndex].status = 'COMPLETED';
            db.payments[paymentIndex].paymentId = paymentId;
            db.payments[paymentIndex].verifiedAt = new Date().toISOString();
        } else {
            // Create payment record if not found
            db.payments.push({
                orderId,
                razorpayOrderId: orderId,
                paymentId,
                userId,
                propertyId: propertyId || null,
                amount,
                currency: 'INR',
                status: 'COMPLETED',
                createdAt: new Date().toISOString(),
                verifiedAt: new Date().toISOString()
            });
        }

        // Add amount to wallet
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            db.users[userIndex].walletBalance = (db.users[userIndex].walletBalance || 0) + amount;

            // Record transaction
            const newTransaction = {
                id: Date.now(),
                userId,
                amount,
                type: 'DEPOSIT',
                status: 'COMPLETED',
                paymentId,
                date: new Date().toISOString()
            };
            db.transactions.push(newTransaction);
        }

        writeDb(db);

        // If propertyId is provided, automatically invest after payment
        if (propertyId) {
            setTimeout(() => {
                // This will be handled by a separate investment call after payment success
                // For now, we just add to wallet
            }, 100);
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            amountAdded: amount
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment', details: error.message });
    }
});

// 9. Payment - Get Order Status
app.get('/api/payments/order/:orderId', (req, res) => {
    const { orderId } = req.params;
    const db = readDb();

    if (!db.payments) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = db.payments.find(p => p.orderId === orderId || p.razorpayOrderId === orderId);
    if (!payment) {
        return res.status(404).json({ error: 'Payment order not found' });
    }

    res.json(payment);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Razorpay Key ID: ${razorpay.key_id}`);
});
