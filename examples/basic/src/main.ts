import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router';

import App from './App.vue';
import ConsentView from './components/ConsentView.vue';
import HomeView from './components/HomeView.vue';
import PremiumView from './components/PremiumView.vue';
import ArticleView from './components/ArticleView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/premium', component: PremiumView },
  { path: '/consent', component: ConsentView },
  { path: '/article/:id', component: ArticleView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
