<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import axios from "axios";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const searchValue = ref("");
const sortByPrice = ref(true);

interface productType {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: {
    rate: number;
  };
}
const products = ref<productType[]>([]);
const localProducts = ref<productType[]>([]);
const localCart = ref<productType[]>([]);

const getProducts = async () => {
  const response = await axios.get(
    `https://fakestoreapi.com/products/category/${route.params.category}`
  );
  if (response.status == 200) {
    products.value = response.data;
    localStorage.setItem("products", JSON.stringify(products.value));
    if (JSON.parse(localStorage.getItem("cart") ?? "[]")?.length == 0)
      localStorage.setItem("cart", "[]");

    localProducts.value = JSON.parse(localStorage.getItem("products") ?? "[]");
    localCart.value = JSON.parse(localStorage.getItem("cart") ?? "[]");

    cartItemsCount.value = localCart.value.length;
  } else {
    alert(response.statusText);
  }
};
getProducts();

onMounted(() => {
  // console.log("CART ITEMS", localStorage.getItem("cartItems"));
  let cartCount: number | undefined = 0;
  if (localStorage.getItem("cartItems") != "")
    cartCount = localStorage.getItem("cartItems")?.split(",").length;
  else cartCount = 0;
  cartItemsCount.value = cartCount ?? 0;
});

const filteredProducts = computed(() => {
  return products.value
    .filter((product) => {
      return (
        product.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchValue.value.toLowerCase())
      );
    })
    .sort((x, y) => {
      if (sortByPrice.value) {
        return x.price - y.price;
      } else {
        return y.price - x.price;
      }
    });
});

const sort = () => {
  sortByPrice.value = !sortByPrice.value;
};

const cartItemsCount = ref(0);
const addToCart = (id) => {
  let product = localProducts.value.find((product) => product.id == id);
  if (product) {
    if (localCart.value.length) {
      localCart.value.push(product);
    } else {
      let res = localCart.value.find((cart) => cart.id == id);
      if (res == undefined) {
        localCart.value.push(product);
      }
    }
  }

  cartItemsCount.value = localCart.value.length ?? 0;
  localStorage.setItem("cart", JSON.stringify(localCart.value));
  $toast.success("Item added to cart!");
};
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <div>
        <h2>{{ route.params.category }}</h2>
      </div>
      <div class="ml-auto">
        <a href="/">Back to categories</a>
      </div>
    </div>
    <div class="cart">
      <button
        type="button"
        class="btn btn-primary position-relative"
        @click="router.push('/cart')"
      >
        View Cart
        <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {{ cartItemsCount }}
          <span class="visually-hidden">cart</span>
        </span>
      </button>
    </div>
    <div class="row mb-2">
      <div class="col-md-3">
        <input
          type="text"
          class="form-control"
          v-model="searchValue"
          placeholder="Search"
        />
      </div>
      <div class="col-md-3">
        <button type="button" class="btn btn-success" @click="sort()">
          Sort by price
        </button>
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-3 mb-5"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <div class="card" style="width: 18rem; height: 32rem">
          <img class="card-img-top" :src="product.image" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">
              {{
                product.title.length > 40
                  ? product.title.slice(0, 40) + "..."
                  : product.title
              }}
            </h5>
            <p class="card-text">
              {{
                product.description.length > 40
                  ? product.description.slice(0, 40) + "..."
                  : product.description
              }}
            </p>
            <h4 class="mb-2">${{ product.price }}</h4>

            <vue3-star-ratings v-model="product.rating.rate" />

            <button
              type="button"
              class="btn btn-success mt-2"
              @click="addToCart(product.id)"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  padding: 30px;
}
.card img {
  height: 200px;
  width: 200px;
}

.cart {
  display: flex;
  align-items: center;
  justify-content: right;
}
</style>
