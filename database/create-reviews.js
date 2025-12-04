const db = require('./index');
const fs = require('fs');
const path = require('path');

async function createReviewsTable() {
  try {
    const sqlPath = path.join(__dirname, 'reviews.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Creating reviews table...');
    await db.query(sql);
    console.log('✅ Reviews table created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating reviews table:', error);
    process.exit(1);
  }
}

createReviewsTable();
