<script setup>
import { ref } from "vue";
import { ethers } from "ethers";
import axios from "axios";

const to = ref('');
const amount = ref('');

async function send() {
  const value = ethers.parseEther(amount.value);

  const tx = {
    to: to.value,
    value,
  };

  const serialized = ethers.Transaction.from(tx).unsignedSerialized;

  console.log(serialized);

  await axios.post("http://localhost:3000/api/v1/txn/sign", {
    message: serialized,
    retry: false,
  });
}
</script>

<template>
  <div>
    <input type="text" placeholder="Recipient" v-model="to" />
    <input type="text" placeholder="Amount" v-model="amount" />
    <button @click="send">Send</button>
  </div>
</template>
