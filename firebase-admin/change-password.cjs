// change-password.cjs  (keep this in the same folder as service-account.json)
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json'); // keep this file secret!

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function main() {
  const [,, email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error('Usage: node change-password.cjs <email> <newPassword>');
    process.exit(1);
  }
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword });
    console.log(`Password updated for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.errorInfo?.message || err.message);
    process.exit(1);
  }
}

main();