const db = require('./db');

async function testDatabase() {
  try {
    console.log('\n🔍 Testing Database Connection...\n');

    // Test 1: Basic connection
    console.log('Test 1: Basic Connection');
    const timeResult = await db.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully!');
    console.log('   Current time:', timeResult.rows[0].current_time);

    // Test 2: Check tables exist
    console.log('\nTest 2: Checking Database Tables');
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. You may need to run the database initialization script.');
    } else {
      console.log('✅ Found', tablesResult.rows.length, 'tables:');
      tablesResult.rows.forEach(row => {
        console.log('   -', row.table_name);
      });
    }

    // Test 3: Check record counts
    console.log('\nTest 3: Checking Record Counts');
    
    const productsCount = await db.query('SELECT COUNT(*) as count FROM products');
    const suppliersCount = await db.query('SELECT COUNT(*) as count FROM suppliers');
    const salesCount = await db.query('SELECT COUNT(*) as count FROM sales');
    
    console.log('✅ Products:', productsCount.rows[0].count);
    console.log('✅ Suppliers:', suppliersCount.rows[0].count);
    console.log('✅ Sales:', salesCount.rows[0].count);

    console.log('\n✅ All database tests passed! The database is properly connected.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testDatabase();









