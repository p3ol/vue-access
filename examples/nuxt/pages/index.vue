<script setup>
import { inject } from 'vue';
import { RouterLink } from 'vue-router';
import {
  AccessProviderSymbol,
  AuditProviderSymbol,
  Pixel,
} from '@poool/vue-access';

const accessProvider = inject(AccessProviderSymbol);
const auditProvider = inject(AuditProviderSymbol)

const { lib: access, appId, config, styles, texts } = accessProvider;
const { lib: audit } = auditProvider;
</script>

<template>
  <h1>Home</h1>

  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>

  <nav>
    <RouterLink to="/premium">Go to premium</RouterLink>
    <RouterLink class="ml-3" to="/consent">Go to consent</RouterLink>

    <div class="mt-3"><b>Has Access:</b> {{ typeof access === 'object' }}</div>
    <div><b>Has Audit:</b> {{ typeof audit === 'object' }}</div>
    <div><b>AppId:</b> {{ appId }}</div>
    <div><b>Config:</b> {{ config }}</div>
    <div><b>Texts:</b> {{ texts }}</div>
    <div><b>Styles:</b> {{ styles }}</div>

    <Pixel type="page-view" :data="{ type: 'page' }" />
  </nav>
</template>
