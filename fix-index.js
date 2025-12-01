const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Fix the index issue
const fixIndex = async () => {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the username index if it exists
    try {
      await collection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  username_1 index does not exist');
      } else {
        console.log('⚠️  Error dropping username_1 index:', error.message);
      }
    }
    
    // Also try to drop any other username-related indexes
    try {
      await collection.dropIndex('username');
      console.log('✅ Successfully dropped username index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  username index does not exist');
      } else {
        console.log('⚠️  Error dropping username index:', error.message);
      }
    }
    
    console.log('\n✅ Index fix completed!');
    console.log('You can now try signing up again.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    process.exit(1);
  }
};

fixIndex();

