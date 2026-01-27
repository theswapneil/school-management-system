/**
 * Database Setup Script
 * =====================
 * 
 * This script initializes the MongoDB database with required collections and indexes.
 * 
 * Purpose:
 * - Creates all 5 collections: users, classes, students, attendances, feetransactions
 * - Establishes unique indexes for data integrity
 * - Handles MongoDB Atlas cloud connections
 * 
 * Collections Created:
 * 1. users - Stores user accounts (admin, teacher, student, parent)
 * 2. classes - Stores class information and academic details
 * 3. students - Stores student records linked to users
 * 4. attendances - Stores daily attendance records
 * 5. feetransactions - Stores fee payment transactions
 * 
 * Indexes Created:
 * - users: unique index on email field
 * - students: unique index on registrationNumber field
 * - attendances: compound unique index on (studentId, attendanceDate)
 * 
 * Usage:
 * Run this script once during initial setup:
 *   npm run setup
 *   or
 *   node src/setup.js
 * 
 * Prerequisites:
 * - MongoDB connection URI in .env file (MONGODB_URI)
 * - MongoDB Atlas account (if using cloud)
 * - Local MongoDB running (if using local database)
 * 
 * Environment Variables Required:
 * - MONGODB_URI: MongoDB connection string
 *   Example (Atlas): mongodb+srv://username:password@cluster.mongodb.net/school_management
 *   Example (Local): mongodb://localhost:27017/school_management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dns = require('dns');
dns.setServers(["1.1.1.1"]); // Use Cloudflare DNS

require('dotenv').config();

/**
 * Initial users to be created
 * These credentials are used for testing and can be changed after setup
 */
const initialUsers = [
  {
    email: 'admin@school.com',
    password: 'password',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    email: 'teacher@school.com',
    password: 'password',
    firstName: 'Teacher',
    lastName: 'User',
    role: 'teacher',
  },
  {
    email: 'parent@school.com',
    password: 'password',
    firstName: 'Parent',
    lastName: 'User',
    role: 'parent',
  },
];

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function insertInitialUsers(usersCollection) {
  console.log('\n--- Inserting Initial Users ---');
  
  for (const user of initialUsers) {
    const existingUser = await usersCollection.findOne({ email: user.email });
    
    if (existingUser) {
      console.log(`✓ User ${user.email} already exists`);
    } else {
      const hashedPassword = await hashPassword(user.password);
      const newUser = {
        ...user,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await usersCollection.insertOne(newUser);
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    }
  }
}

async function setupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    
    // Create collections
    await db.createCollection('users').catch(() => console.log('Users collection exists'));
    await db.createCollection('classes').catch(() => console.log('Classes collection exists'));
    await db.createCollection('students').catch(() => console.log('Students collection exists'));
    await db.createCollection('attendances').catch(() => console.log('Attendances collection exists'));
    await db.createCollection('feetransactions').catch(() => console.log('FeeTransactions collection exists'));
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await db.collection('students').createIndex({ registrationNumber: 1 }, { unique: true }).catch(() => {});
    await db.collection('attendances').createIndex({ studentId: 1, attendanceDate: 1 }, { unique: true }).catch(() => {});
    
    // Insert initial users
    await insertInitialUsers(db.collection('users'));
    
    console.log('\n✓ Database setup completed successfully!');
    console.log('\n--- Test Credentials ---');
    console.log('Admin:   admin@school.com / password');
    console.log('Teacher: teacher@school.com / password');
    console.log('Parent:  parent@school.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();