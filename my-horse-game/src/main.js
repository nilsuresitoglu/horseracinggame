import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// Import Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
