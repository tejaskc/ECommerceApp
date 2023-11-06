<script setup lang="ts">
import { ref, computed } from "vue";

const cartData = ref(JSON.parse(localStorage.getItem("cart") ?? "[]"));
const totalPrice = computed(() => {
  return cartData.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );
});

interface CartItems {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  categories: string;
}
let cartItems = ref<CartItems[]>([]);
let ids: number[] = [];

cartData.value.forEach((cart) => {
  if (ids.includes(cart.id)) {
    let index = cartItems.value.findIndex((c) => c.id === cart.id);
    cartItems.value[index].quantity++;
  } else {
    let item = {
      id: cart.id,
      title: cart.title,
      description: cart.description,
      quantity: 1,
      price: cart.price,
      image: cart.image,
      categories: cart.categories,
    };
    cartItems.value.push(item);
    ids.push(cart.id);
  }
});

const removeItem = (productId) => {
  const products = cartData.value.filter((cart) => cart.id != productId);
  localStorage.setItem("cart", JSON.stringify(products));
  cartData.value = JSON.parse(localStorage.getItem("cart") ?? "[]");

  const cart = cartItems.value.filter((c) => c.id != productId);
  cartItems.value = cart;
};
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between">
      <div>
        <h2>Cart Details</h2>
      </div>
      <div class="ml-auto">
        <a href="/">Back to categories</a>
      </div>
    </div>
    <div
      class="card mb-3 mt-3"
      style="max-width: 100%"
      v-for="cart in cartItems"
      :key="cart.id"
    >
      <div class="row g-0">
        <div class="col-md-2">
          <img :src="cart.image" class="img-fluid rounded-start" alt="..." />
        </div>
        <div class="col-md-10">
          <div class="card-body" style="padding: 30px">
            <h5 class="card-title">{{ cart.title }}</h5>
            <p class="card-text">
              {{ cart.description }}
            </p>
            <h6>Qty: {{ cart.quantity }}</h6>

            <h4 class="mb-2 mt-3">${{ cart.price }}</h4>
            <button class="btn btn-danger btn-sm" @click="removeItem(cart.id)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card w-100 mb-3">
      <div class="card-body">
        <h5 class="card-title">Total</h5>
        <h4>${{ totalPrice.toFixed(2) }}</h4>
        <a href="#" class="btn btn-primary">Proceed To Pay</a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card img {
  height: 200px;
  width: 200px;
  padding: 22px 15px;
}
</style>
