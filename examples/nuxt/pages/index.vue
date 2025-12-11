<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <h1>Home</h1>

  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>

  <nav>
    <RouterLink class="ml-3" to="/consent">Go to consent</RouterLink>
    <RouterLink class="ml-3" to="/article/1">Go to article 1</RouterLink>
    <RouterLink class="ml-3" to="/article/2">Go to article 2</RouterLink>
  </nav>
</template>
