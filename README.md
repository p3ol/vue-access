# Poool Access - Vue SDK

Plugin to easily add Poool access to your Vue app ✨

## Installation

```bash
yarn add @poool/vue-access
```

## Usage

```vue
<script>
  import { ref } from 'vue';
  import {
    AccessProvider,
    Paywall,
    Pixel,
    RestrictedContent,
  } from '@poool/vue-access';

  const contentRef = ref(null);
  const getContentRef = () => contentRef?.value;
</script>

<template>
  <!--
    Wrap everything with our AccessProvider component. Note the withAudit
    prop which saves you from writing AuditProvider inside of AccessProvider
  -->
  <AccessProvider
    appId="insert_your_app_id"
    :config="{ cookies_enabled: true }"
    :withAudit="true"
  >
    <!-- Wrap your content with our RestrictedContent component -->
    <RestrictedContent ref="contentRef">
      <div id="restricted-content">
        <p>Your article content</p>
      </div>
    </RestrictedContent>

    <!--
      Place our Paywall component where you want your paywall to be
      displayed. Give a method to retrieve content's reactive ref
    -->
    <Paywall :contentRef="getContentRef" />

    <!--
      Place our Pixel component anywhere inside an <AuditProvider /> component
      (or <AccessProvider :withAudit="true" />) to track page-view events
      (used for native segmentation)
    -->
    <Pixel type="page-view" :data="{ type: 'premium' }" />
  </AccessProvider>
</template>
```

## Usage with AuditProvider

```vue
<script>
  import { ref } from 'vue';
  import {
    AccessProvider,
    Paywall,
    Pixel,
    RestrictedContent,
  } from '@poool/vue-access';

  const contentRef = ref(null);
  const getContentRef = () => contentRef?.value;
</script>

<template>
  <AuditProvider appId="insert_your_add_id">
    <AccessProvider appId="insert_your_app_id">
      <RestrictedContent ref="contentRef">
        <div id="restricted-content">
          <p>Your article content</p>
        </div>
      </RestrictedContent>
      <Paywall :contentRef="getContentRef" />
      <Pixel type="page-view" :data="{ type: 'premium' }" />
    </AccessProvider>
  </AuditProvider>
</template>
```

## Documentation

### `<AccessProvider />`

#### Props

- `appId` {`String`} Your Poool App ID
- `config` {`Object`} (optional) Default paywall config (see the [configuration](https://poool.dev/docs/javascript/access/configuration) documentation).
- `styles` {`Object`} (optional) Default paywall styles (see the [styles](https://poool.dev//docs/javascript/access/appearances) documentation).
- `texts` {`Object`} (optional) Default paywall texts (see the [texts](https://poool.dev/docs/javascript/access/texts) documentation).
- `events` {`Object`} (optional) Paywall events listeners (see the [events](https://poool.dev/docs/javascript/access/events) documentation).
- `variables` {`Object`} (optional) Paywall variables (see the [variables](https://poool.dev/docs/javascript/access/variables) documentation).
- `scriptUrl` {`String`} (optional, default: `'https://assets.poool.fr/access.min.js'`) Default Poool Access SDK url
- `scriptLoadTimeout` {`Number`} (optional, default: `2000`) Timeout for the script to load
- `withAudit` {`Boolean`} (optional, default: `false`) Whether to include AuditContext in AccessContext or not
- `vueDebug` {`Boolean`} (optional, default: `false`) Whether to enable vue-access debug or not

### `<AuditProvider />`

#### Props

- `appId` {`String`} Your Poool App ID
- `config` {`Object`} (optional) Default audit config (see the [configuration](https://poool.dev/docs/javascript/audit/configuration) documentation).
- `events` {`Object`} (optional) Audit events listeners (see the [events](https://poool.dev/docs/javascript/audit/events) documentation).
- `scriptUrl` {`String`} (optional, default: `'https://assets.poool.fr/audit.min.js'`) Default Poool Audit SDK url
- `scriptLoadTimeout` {`Number`} (optional, default: `2000`) Timeout for the script to load


### Inject providers

To use AccessProvider & AuditProvider values in one of your child component,
use inject method from vue.

#### Composition API

```vue
<script>
  import { inject } from 'vue';
  import { AccessProviderSymbol, AuditProviderSymbol } from '@poool/vue-access';

  const accessProvider = inject(AccessProviderSymbol);
  const auditProvider = inject(AuditProviderSymbol);

  const {
    lib: access, // Access sdk instance
    appId,
    config,
    // every other props like texts, styles and so on..
  } = accessProvider;

  const { lib: audit, /* Audit sdk instance */ } = auditProvider;
</script>
```

#### Options API

```ts
import { defineComponent, inject } from 'vue';
import { AccessProviderSymbol } from '@poool/vue-access';

const MyChildComponent = defineComponent({
  name: 'MyChildComponent',
  inject: {
    accessProvider: { from: AccessProviderSymbol },
  },
  // You can also use watch if you want
  /* Note that deep: true is needed for reactive injected values & objects */
  watch: {
    accessProvider: { handler: 'myMethod', deep: true  },
  },
  methods: {
    myMethod() {
      const { config } = this.accessProvider; // Access provider values
    },
  },
});

export default MyChildComponent;
```

### `<RestrictedContent />`

#### Props

- `mode` {`String` : `'excerpt'` | `'hide'`| `'custom'`} (optional) Way to hide content see [Access configuration](https://poool.dev/docs/javascript/access/configuration#mode) for more informations.
- `percent` {`Number`} (optional) Percentage of content to hide.


### `<Paywall />`

#### Props

- `contentRef` {`Vue.Ref`} Reference to the RestrictedContent component associated to this Paywall 
- `id` {`String`} (optional, default: random id) Custom wrapper component ID
- `pageType` {`String`} (optional, default: `'premium'`) Current page type (supported types: `page`, `premium`, `free`, `subscription`)
- `config` {`Object`} (optional) Paywall config (see the [configuration](https://poool.dev/docs/javascript/access/configuration) documentation).
- `styles` {`Object`} (optional) Paywall styles (see the [styles](https://poool.dev//docs/javascript/access/appearances) documentation).
- `texts` {`Object`} (optional) Paywall texts (see the [texts](https://poool.dev/docs/javascript/access/texts) documentation).
- `variables` {`Object`} (optional) Paywall variables (see the [variables](https://poool.dev/docs/javascript/access/variables) documentation).
- `events` {`Object`} (optional) Paywall events listeners (see the [events](https://poool.dev/docs/javascript/access/events) documentation)


### `<Pixel />`

#### Props

- `type` {`String`} Event type (supported types: `page-view`)
- `data`{`Object`} (optional but mandatory when type is page-view) Data associated to the event (see the [audit](https://poool.dev/docs/javascript/audit/methods#page-view) documentation)
- `config` {`Object`} (optional) Pixel config (see the [configuration](https://poool.dev/docs/javascript/audit/configuration) documentation).
- `options` {`Object`} (optional) Options to pass to the event (see the [audit](https://poool.dev/docs/javascript/audit/methods#options) documentation)
- `onDone` {`Function`} (optional) Callback to execute when the event is done
- `reuse` {`Boolean`} (optional, default: `false`) Whether to reuse the same event or not


### Quickly test localy

Run basic example with Vite

```bash
yarn example:basic
```

Run Nuxt framework example

```bash
yarn example:nuxt
```