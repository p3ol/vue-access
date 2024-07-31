import {
  type PropType,
  computed,
  defineComponent,
  readonly,
  toRaw,
  } from 'vue';
import type { Poool } from 'poool-access';

import type {
  AuditContextValue,
  AuditEvents,
  EventCallback,
  EventCallbackFunction,
  EventCallbackObject,
} from '../utils/types';
import { loadScript } from '../utils';
import { trace } from '../utils/logger';

export declare interface AuditProviderValue extends AuditContextValue {
  vueDebug: boolean;
}

// We use symbols as unique provider identifiers.
export const AuditProviderSymbol = Symbol('AuditProvider');

const AuditProvider = defineComponent({
  name: 'AuditProvider',

  props: {
    appId: String,

    config: {
      type: Object as PropType<AuditContextValue['config']>,
      default() { return {}; },
    },

    events: {
      type: Object as PropType<AuditContextValue['events']>,
      default() { return {}; },
    },

    scriptUrl: {
      type: String,
      default: 'https://assets.poool.fr/audit.min.js',
    },

    scriptLoadTimeout: {
      type: Number,
      default: 2000,
    },

    vueDebug: {
      type: Boolean,
      default: false,
    },
  },

  data: () => {
    return { lib: null as Poool.Audit | null };
  },

  async mounted() {
    if (
      !globalThis.Audit ||
      !globalThis.Audit?.isPoool ||
      !globalThis.PooolAudit ||
      !globalThis.PooolAudit?.isPoool
    ) {
      await loadScript(this.scriptUrl, 'poool-vue-audit-lib', {
        timeout: this.scriptLoadTimeout,
      });
    }

    this.init();
  },

  beforeUnmount() {
    this.deinit();
  },

  watch: {
    "config.cookies_enabled": { handler: 'reinit', deep: true },
  },

  methods: {
    // Method to initialize the Audit SDK, setup the config and events handlers
    async init() {      
      const auditRef = globalThis.PooolAudit || globalThis.Audit;
      const lib = toRaw(auditRef?.noConflict());

      if (!lib) {
        return;
      }

      lib.init(this.appId as string).config(this.config || {});

      Object
        .entries(this.events || {})
        .forEach(([
          event,
          callback,
        ]: [
          string,
          EventCallback<typeof this.events[keyof typeof this.events]>,
        ]) => {
          const eventName = event as Poool.EventsList;
          if ((callback as EventCallbackObject<typeof event>).once) {
            lib.once(eventName,
              (callback as EventCallbackObject<typeof event>).callback);
          } else {
            lib.on(eventName, callback as EventCallbackFunction<typeof event>);
          }
        });

      lib.once('identityAvailable', this.onIdentityAvailable);
      this.lib = lib;

      trace('AuditProvider', this.vueDebug,
        'Audit SDK has been initialized successfuly'
      );
    },

    // Method to unmount properly audit and shutdown all event listeners
    deinit() {
      const audit = toRaw(this.lib);

      Object
        .entries(this.events || {})
        .forEach(([
          event,
          callback,
        ]: [
          string,
          EventCallback<typeof this.events[keyof typeof this.events]>,
        ]) => {
          const eventName = event as Poool.EventsList;
          audit?.off(
            eventName,
            (callback as EventCallbackObject<typeof event>).callback ||
              (callback as EventCallbackFunction<typeof event>)
          );
        });
  
      audit?.off('identityAvailable', this.onIdentityAvailable);      
    },

    // Method to reinit
    reinit() {
      this.deinit();
      this.init();
    },

    // Identity available custom internal event handler
    onIdentityAvailable (
      e: Parameters<
        Extract<
          AuditEvents['identityAvailable'],
          EventCallbackFunction<any>
        >
      >[0]
    ) {
      try {
        globalThis.document.dispatchEvent(new CustomEvent('$_poool.onMessage', {
          detail: {
            type: '$_poool.setUser',
            data: e,
          },
        }));
      // eslint-disable-next-line no-empty
      } catch (_) {}
    },
  },

  provide() {
    return {
      [AuditProviderSymbol]: readonly({
        lib: computed(() => this.lib),
        appId: computed(() => this.appId),
        config: computed(() => this.config),
        events: computed(() => this.events),
        scriptUrl: computed(() => this.scriptUrl),
        vueDebug: computed(() => this.vueDebug),
      }) as AuditProviderValue,
    }
  },

  render() {
    // Our provider component is a renderless component
    // it only has to render his child.
    return this.$slots?.default?.();
  },
});

export default AuditProvider;
