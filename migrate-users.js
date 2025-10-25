// Migration Script: Update existing users with email verification fields
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function migrateUsers() {
  console.log('🔄 Starting user migration...\n');

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('vaaniweb');
  const usersCollection = db.collection('users');

  // Find all users without email verification fields
  const usersToUpdate = await usersCollection.find({
    isEmailVerified: { $exists: false }
  }).toArray();

  console.log(`📊 Found ${usersToUpdate.length} users to migrate\n`);

  for (const user of usersToUpdate) {
    console.log(`Updating user: ${user.email}`);
    
    // Google OAuth users: auto-verify
    // Email users: keep unverified (they need to verify)
    const isGoogleUser = user.authProvider === 'google';
    
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: isGoogleUser, // Google = true, Email = false
          ...(isGoogleUser && { verifiedAt: user.createdAt || new Date() })
        }
      }
    );

    console.log(`  ✅ ${user.email} - ${isGoogleUser ? 'Auto-verified (Google)' : 'Needs verification (Email)'}`);
  }

  console.log(`\n✅ Migration complete! Updated ${usersToUpdate.length} users`);
  
  await client.close();
}

migrateUsers().catch(console.error);
