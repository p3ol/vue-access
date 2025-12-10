import { type PropType, defineComponent, toRaw } from 'vue';
import type { Poool } from 'poool-access';

import { trace, warn } from '../utils/logger';

import { AuditProviderSymbol, type AuditProviderValue } from '../AuditProvider';

export interface PixelProps {
  /**
   * The event type
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/methods
   */
  type: Parameters<Poool.Audit['sendEvent']>[0];
  /**
   * The event data
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/methods
   */
  data?: Parameters<Poool.Audit['sendEvent']>[1];
  /**
   * The audit config options
   *
   * More infos: https://www.poool.dev/docs/audit/javascript/audit/configuration
   */
  config?: Poool.AuditConfigOptions;
  /**
   * the event options
   *
   * more infos: https://www.poool.dev/docs/access/javascript/audit/methods
   */
  options?: Parameters<Poool.Audit['sendEvent']>[2];
  /**
   * Whether to reuse the same event or not
   *
   * More infos: https://www.poool.dev/docs/access/react
   */
  reuse?: boolean;
  /**
   * Callback to execute when the event is done
   *
   * More infos: https://www.poool.dev/docs/access/react
   */
  onDone?: () => void;
}

const Pixel = defineComponent({
  name: "PixelComponent",

  props: {
    type: String as PropType<PixelProps["type"]>,
    data: Object as PropType<PixelProps["data"]>,
    config: Object as PropType<PixelProps["config"]>,
    options: Object as PropType<PixelProps["options"]>,

    reuse: {
      type: Boolean as PropType<PixelProps["reuse"]>,
      default: false,
    },

    onDone: Function as PropType<PixelProps["onDone"]>,
  },

  // Use Audit Provider to get the Audit SDK and its config
  inject: {
    auditProvider: { from: AuditProviderSymbol },
  },

  watch: {
    "auditProvider.lib": {
      handler: 'send',
      deep: true,
    },

    "auditProvider.config.cookies_enabled": {
      handler: 'send',
    },
  },

  data() {
    return { used: false };
  },

  mounted() {
    this.send();
  },

  methods: {
    async send() {
      const {
        lib,
        config: pConfig,
        vueDebug,
      } = this.auditProvider as AuditProviderValue;

      trace('Pixel', vueDebug, 'Trying to send page-view event...');
      const audit = toRaw(lib);

      if (!audit) {
        warn('Pixel', vueDebug, 'Audit SDK is not loaded yet!');

        return
      }

      if (this.used && !this.reuse) {
        warn('Pixel', vueDebug, 'Event already sent & not reusable!');

        return;
      }

      const config = Object.assign({}, pConfig, this.config);
      trace('Pixel', vueDebug, {
        type: this.type,
        data: this.data,
        options: this.options,
        config,
      });
      this.used = true;
      trace('Pixel', vueDebug, 'Sending page-view event to Audit!');

      await audit.config(this.config || {}).sendEvent(
        this.type as Parameters<Poool.Audit['sendEvent']>[0],
        this.data,
        this.options
      );
      this.onDone?.();
    },

    // Method to resend the page-view event when the cookies_enabled config has
    // changed
    resend() {
      this.used = false;
      this.send();
    },
  },

  render() { return this.$slots?.default?.(); },
});

export default Pixel;
