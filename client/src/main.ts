import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueCompositionApi from "@vue/composition-api";

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    log(a: any) {
      console.log(a);
    },
  },
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
