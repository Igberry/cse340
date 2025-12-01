// Script to create Admin and Employee accounts
// Run with: node create-admin-accounts.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database');

async function createAdminAccounts() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const employeePassword = await bcrypt.hash('Employee123!', 10);

    // Create Admin account
    const adminSQL = `
      INSERT INTO accounts (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_email) 
      DO UPDATE SET account_type = 'Admin', account_password = $4
      RETURNING account_id, account_email, account_type;
    `;
    
    const adminResult = await db.query(adminSQL, [
      'Admin',
      'User',
      'admin@cse340.com',
      adminPassword,
      'Admin'
    ]);
    
    console.log('✅ Admin account created/updated:');
    console.log('   Email: admin@cse340.com');
    console.log('   Password: Admin123!');
    console.log('   Type:', adminResult.rows[0].account_type);
    console.log('');

    // Create Employee account
    const employeeSQL = `
      INSERT INTO accounts (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_email) 
      DO UPDATE SET account_type = 'Employee', account_password = $4
      RETURNING account_id, account_email, account_type;
    `;
    
    const employeeResult = await db.query(employeeSQL, [
      'Employee',
      'User',
      'employee@cse340.com',
      employeePassword,
      'Employee'
    ]);
    
    console.log('✅ Employee account created/updated:');
    console.log('   Email: employee@cse340.com');
    console.log('   Password: Employee123!');
    console.log('   Type:', employeeResult.rows[0].account_type);
    console.log('');
    
    console.log('✅ Done! You can now login with these accounts.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating accounts:', error);
    process.exit(1);
  }
}

createAdminAccounts();
