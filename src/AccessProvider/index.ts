import {
  type PropType,
  computed,
  defineComponent,
  h,
  readonly,
  toRaw,
  } from 'vue';
import type { Poool } from 'poool-access';
import { mergeDeep } from '@junipero/core';

import type {
  AccessContextValue,
  EventCallback,
  EventCallbackFunction,
  EventCallbackObject,
} from '../utils/types';
import { loadScript } from '../utils';
import { trace, warn } from '../utils/logger';

import AuditProvider from '../AuditProvider';

export declare interface AccessProviderValue extends AccessContextValue {
  vueDebug: boolean;
}

// We use symbols as unique identifiers.
export const AccessProviderSymbol = Symbol('AccessProvider');

const AccessProvider = defineComponent({
  name: 'AccessProvider',

  props: {
    appId: String,

    config: {
      type: Object as PropType<AccessContextValue['config']>,
      default() { return {}; },
    },

    texts: {
      type: Object as PropType<AccessContextValue['texts']>,
      default() { return {}; },
    },

    styles: {
      type: Object as PropType<AccessContextValue['styles']>,
      default() { return {}; },
    },

    variables: {
      type: Object as PropType<AccessContextValue['variables']>,
      default() { return {}; },
    },

    events: {
      type: Object as PropType<AccessContextValue['events']>,
      default() { return {}; },
    },

    scriptUrl: {
      type: String,
      default: 'https://assets.poool.fr/access.min.js',
    },

    scriptLoadTimeout: {
      type: Number,
      default: 2000,
    },

    withAudit: {
      type: Boolean,
      default: false,
    },

    vueDebug: {
      type: Boolean,
      default: false,
    },
  },

  data: () => {
    return {
      lib: null as Poool.Access | null,
    };
  },

  async mounted() {
    if (
      !globalThis.Access &&
      !globalThis.Access?.isPoool &&
      !globalThis.PooolAccess &&
      !globalThis.PooolAccess?.isPoool
    ) {
      await loadScript(this.scriptUrl, 'poool-vue-access-lib', {
        timeout: this.scriptLoadTimeout,
      });
    }

    this.init();
  },

  methods: {
    // Method to load the Access SDK script into the global scope
    async init() {
      const accessRef = globalThis.PooolAccess || globalThis.Access;
      this.lib = accessRef?.noConflict();
    },

    // Method to create a new AccessFactory instance with every configs &
    // event handlers
    createFactory(
      opts: Pick<
        AccessContextValue,
        'config' | 'texts' | 'styles' | 'variables' | 'events'
      > = {} as AccessContextValue
    ) {
      const lib = toRaw(this.lib);

      if (!lib) {
        warn('AccessProvider', this.vueDebug, 'Access SDK is not loaded yet');

        return;
      }

      const config = mergeDeep({}, this.config, opts.config);
      const texts = mergeDeep({}, this.texts, opts.texts);
      const styles = mergeDeep({}, this.styles, opts.styles);
      const variables = mergeDeep({}, this.variables, opts.variables);
      const events = mergeDeep(
        {}, this.events, opts.events
      ) as AccessProviderValue['events'];

      trace('AccessProvider', this.vueDebug, 'Creating Access instance with :',
        { config, texts, styles, variables, events }
      );

      const factory = lib.init(this.appId as string)
        .config(config)
        .texts(texts)
        .styles(styles)
        .variables(variables);

      Object
        .entries((events || {}))
        .concat(Object.entries((opts.events || {})))
        .forEach(([
          event,
          callback,
        ]: [
          string,
          EventCallback<typeof this.events[keyof typeof this.events]>,
        ]) => {
          const eventName = event as Poool.EventsList;
          if ((callback as EventCallbackObject<typeof event>).once) {
            factory.once(eventName,
              (callback as EventCallbackObject<typeof event>).callback);
          } else {
            factory.on(
              eventName,
              callback as EventCallbackFunction<typeof event>
            );
          }
        });

        trace('AccessProvider', this.vueDebug,
          'Access SDK initialized & setup successfuly'
        );

      return factory;
    },

    // Method to destroy the AccessFactory instance and
    // remove all event listeners
    destroyFactory(factory: Poool.AccessFactory) {
      if (!factory) {
        return;
      }

      Object.keys(this.events || {}).forEach((event: string) => {
        const eventName = event as Poool.EventsList;
        factory?.off(
          eventName,
          this.events?.[eventName].callback || this.events?.[eventName]
        );
      });

      return factory.destroy();
    },
  },

  // Used to provide the AccessProvider values to all child components
  provide() {
    return {
      [AccessProviderSymbol]: readonly({
        lib: computed(() => this.lib),
        appId: computed(() => this.appId),
        config: computed(() => this.config),
        texts: computed(() => this.texts),
        styles: computed(() => this.styles),
        variables: computed(() => this.variables),
        events: computed(() => this.events),
        scriptUrl: computed(() => this.scriptUrl),
        vueDebug: computed(() => this.vueDebug),
        createFactory: this.createFactory,
        destroyFactory: this.destroyFactory,
      }) as AccessProviderValue,
    }
  },

  render() {
    // Our provider component is a renderless component
    // it does not render any markup of its own.    
    return this.withAudit
      ? h(AuditProvider, {
        appId: this.appId,
        config: this.config,
        vueDebug: this.vueDebug,
      }, () => [this.$slots?.default?.()])
      : this.$slots?.default?.();
  },
});

export default AccessProvider;
