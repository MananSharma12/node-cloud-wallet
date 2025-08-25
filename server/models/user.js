const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://mongoadmin:secret@localhost:27017/wallet?authSource=admin');
  console.log('Connected to MongoDB');
}

main().catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  publicKey: String,
  privateKey: String,
  address: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User