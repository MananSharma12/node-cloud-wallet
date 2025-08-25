const express = require('express');
const app = express();
const apiV1 = express.Router();
const { Wallet, Transaction} = require('ethers');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require("./models/user");
const JWT_SECRET = 'secret_key';

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiV1);

app.get('/', (req, res) => res.send('Hello World!'));

apiV1.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const wallet = Wallet.createRandom();

    const { address, publicKey, privateKey } = wallet;

    const user = new User({
      username,
      password,
      publicKey,
      privateKey,
      address,
    });

    console.log('Attempting to save user:', user);
    await user.save();
    console.log('User saved successfully:', user);

    return res.status(201).json({
      "publicKey": publicKey
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

apiV1.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username,
    password,
  });

  if(user === null) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const payload = {
    id: user._id,
    username: user.username,
    publicKey: user.publicKey,
  }

  const token = jwt.sign(payload, JWT_SECRET);

  return res.status(200).json({
    jwt: token
  });
});

apiV1.post('/txn/sign', async (req, res) => {
  try {
    const unserializedTxn = req.body.message;
    const tx = Transaction.from(unserializedTxn);

    /**
     * * Logic to get pvt key from user
     * * Hardcoding it for now
     */
    const wallet = new Wallet("private_key");

    const signedTxn = await wallet.signTransaction(tx);

    return res.status(200).json({
      signedTxn
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({
      message: "Failed to sign transaction",
      retry: true
    });
  }
});

app.listen(3000, () => console.log('App listening on port 3000!'));
