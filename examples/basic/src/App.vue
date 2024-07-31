<script setup>
import { RouterView } from 'vue-router';
import AppProvider from './components/AppProvider.vue';
</script>

<template>
  <main>
    <AppProvider>
      <RouterView />
    </AppProvider>
  </main>
</template>

<style>
nav {
  margin-top: 1rem;
}

.ml-3 {
  margin-left: 1rem;
}

.mt-3 {
  margin-top: 1rem;
}
</style>