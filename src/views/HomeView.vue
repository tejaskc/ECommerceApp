<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { categories, getCategories } from "./categories";

const router = useRouter();

onMounted(() => {
  if (!categories.value.length) getCategories();
});
</script>

<template>
  <div class="container mt-5">
    <h2>Categories</h2>
    <div class="row">
      <div
        class="col-sm-3 p-3 ml-5"
        v-for="category in categories"
        :key="category.category_name"
      >
        <div
          class="card"
          style="width: 18rem; padding: 30px; cursor: pointer"
          @click="router.push(`/products/${category.category_name}`)"
        >
          <img
            :src="category.image"
            class="card-img-top"
            alt="img"
            style="height: 200px; width: 200px"
          />
          <div class="card-body">
            <h5 class="card-title">{{ category.category_name }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
