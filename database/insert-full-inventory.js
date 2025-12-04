const db = require('./index');
const fs = require('fs');
const path = require('path');

async function insertFullInventory() {
  try {
    const sqlPath = path.join(__dirname, 'insert-full-inventory.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Inserting full inventory data...');
    await db.query(sql);
    console.log('✅ Full inventory data inserted successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting inventory:', error);
    process.exit(1);
  }
}

insertFullInventory();
