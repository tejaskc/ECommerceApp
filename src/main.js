import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import bootstrap from "bootstrap/dist/js/bootstrap.js";

import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

import vue3StarRatings from "vue3-star-ratings";

const app = createApp(App);
app.use(router);
app.use(bootstrap);
app.use(useToast);
app.component("vue3-star-ratings", vue3StarRatings);

app.mount("#app");
