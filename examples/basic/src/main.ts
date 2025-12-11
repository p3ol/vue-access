import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import ConsentView from './components/ConsentView.vue';
import HomeView from './components/HomeView.vue';
import ArticleView from './components/ArticleView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/consent', component: ConsentView },
  { path: '/article/:id', component: ArticleView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
