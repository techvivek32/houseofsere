import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'houseofsere-admin-secret';

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'houseofsere';
let db;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    
    // Initialize admin user
    await initializeAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Initialize admin user
async function initializeAdmin() {
  const admins = db.collection('admins');
  const existingAdmin = await admins.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'houseofsere2024', 10);
    await admins.insertOne({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });
    console.log('Admin user created');
  }
}

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admins = db.collection('admins');
    const admin = await admins.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected admin routes
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token valid' });
});

// Categories routes
app.post('/api/categories/bulk', async (req, res) => {
  try {
    const { categories: categoryNames } = req.body;
    
    if (!categoryNames || !Array.isArray(categoryNames) || categoryNames.length === 0) {
      return res.status(400).json({ message: 'Categories array is required' });
    }
    
    const categories = db.collection('categories');
    const categoriesToInsert = [];
    
    for (const name of categoryNames) {
      const trimmedName = name.trim();
      if (trimmedName) {
        const existing = await categories.findOne({ name: trimmedName });
        if (!existing) {
          categoriesToInsert.push({
            name: trimmedName,
            createdAt: new Date()
          });
        }
      }
    }
    
    if (categoriesToInsert.length > 0) {
      await categories.insertMany(categoriesToInsert);
    }
    
    res.status(201).json({ 
      message: `${categoriesToInsert.length} categories saved successfully`,
      savedCount: categoriesToInsert.length
    });
  } catch (error) {
    console.error('Bulk category creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = db.collection('categories');
    const result = await categories.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');
    const categories = db.collection('categories');
    
    const result = await categories.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});