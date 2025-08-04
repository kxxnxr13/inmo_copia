const { Pool } = require('pg');

async function testSupabaseConnection() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:Keiner%2A13%2A%2A%2A@db.hsgvipzswbanogfnxlyo.supabase.co:5432/postgres",
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Force IPv4
    options: '-c default_transaction_isolation=read_committed',
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 5,
    min: 0
  });

  try {
    console.log('🔌 Testing Supabase connection...');
    const client = await pool.connect();
    console.log('✅ Connected to Supabase successfully!');
    
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('📊 Database info:', result.rows[0]);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Supabase connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', {
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
    await pool.end();
    return false;
  }
}

testSupabaseConnection();
