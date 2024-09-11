<script setup>
import { computed, onMounted, ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import { AccessProvider } from '@poool/vue-access';

const route = useRoute();
const path = computed(() => route.path);

const cookiesEnabled = ref(false);
const setCookiesEnabled = (value) => {
  cookiesEnabled.value = value;
};

provide('cookiesEnabled', cookiesEnabled);
provide('setCookiesEnabled', setCookiesEnabled);

onMounted(() => {
  setCookiesEnabled(path.value !== '/consent');
});

watch(path, (value) => {
  setCookiesEnabled(value !== '/consent');
});

</script>

<template>
  <AccessProvider
    appId="155PF-L7Q6Q-EB2GG-04TF8"
    :config="{
      cookies_enabled: cookiesEnabled,
      debug: true,
      custom_segment: 'vue',
      cookies_domain: 'localhost',
      audit_load_timeout: 30000,
    }"
    :styles="{}"
    :texts="{}"
    :withAudit="true"
    :vueDebug="true"
  >
    <slot></slot>
  </AccessProvider>
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
