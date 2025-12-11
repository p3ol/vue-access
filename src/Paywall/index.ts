import {
  type PropType,
  defineComponent,
  ref,
  h,
  toRaw,
  Ref,
  } from 'vue';
import type { Poool } from 'poool-access';
import { classNames } from '@junipero/core';

import type {
  AccessContextValue,
  AccessEvents,
  EventCallbackFunction,
} from '../utils/types';
import { generateId } from '../utils';
import { trace, warn } from '../utils/logger';

import {
  type AccessProviderValue,
  AccessProviderSymbol,
} from '../AccessProvider';
import type { RestrictedContentRef } from '../RestrictedContent';

export declare interface PaywallProps extends Pick<
  AccessContextValue,
  'config' | 'texts' | 'styles' | 'variables' | 'events'
> {
  /**
   * Custom wrapper component ID
   */
  id: string;
  /**
   * Method returning restricted content ref reactive value
   */
  contentRef: () => RestrictedContentRef;
  /**
   * The current page type
   */
  pageType: Parameters<Poool.AccessFactory['createPaywall']>[0]['pageType'];
  /**
   * Custom additional class names
   */
  additionalClasses: string;
}

export declare interface PaywallRef extends PaywallProps {
  containerRef: Ref<RestrictedContentRef>;
  accessProvider: AccessProviderValue;
  accessFactory: Poool.AccessFactory | null;
  componentId: string;
  create: () => void;
  destroy: (container: HTMLElement) => void;
  recreate: () => void;
}

const Paywall = defineComponent({
  name: 'PaywallComponent',

  props: {
    id: String as PropType<PaywallProps['id']>,
    contentRef: Function as PropType<PaywallProps['contentRef']>,
    config: Object as PropType<PaywallProps["config"]>,
    texts: Object as PropType<PaywallProps["texts"]>,
    styles: Object as PropType<PaywallProps["styles"]>,
    variables: Object as PropType<PaywallProps["variables"]>,
    events: Object as PropType<PaywallProps["events"]>,

    pageType: {
      type: String as PropType<PaywallProps['pageType']>,
      default: 'premium',
    },

    additionalClasses: {
      type: String as PropType<PaywallProps['additionalClasses']>,
      default: '',
    },
  },

  inject: {
    // Use Access Provider to get the Access SDK and its config
    accessProvider: { from: AccessProviderSymbol },
  },

  watch: {
    'accessProvider.lib': { handler: 'create', deep: true },
    
    'accessProvider.config.cookies_enabled': {
      handler: 'recreate',
    },
  },

  data() {
    return {
      accessFactory: null as Poool.AccessFactory | null,
    };
  },

  setup(props) {
    const containerRef = ref<HTMLElement>();
    const componentId = props.id || generateId();

    return { containerRef, componentId };
  },

  mounted() {
    this.create();
  },

  beforeUnmount() {
    const container = this.$refs.containerRef as HTMLElement;
    this.destroy(container);
  },

  methods: {
    async create() {
      const {
        createFactory,
        vueDebug,
      } = this.accessProvider as AccessProviderValue;

      trace('Paywall', vueDebug, "Trying to create a paywall..");

      // Create a new AccessFactory instance based on PaywallComponent config
      // props or AccessProvider config props
      this.accessFactory = createFactory?.({
        config: this.config,
        texts: this.texts,
        styles: this.styles,
        variables: this.variables,
        events: this.events,
      });

      const access = toRaw(this.accessFactory);
      if (!access) {
        warn('Paywall', vueDebug,
          'Access SDK is not loaded yet through AccessProvider'
        );
        return;
      }

      const contentRef = this.contentRef?.() as RestrictedContentRef;
      trace('Paywall', vueDebug, 'Restricted content ref: ', contentRef);

      access.once('identityAvailable', this.onIdentityAvailable);
      access.createPaywall({
        pageType: this.pageType as 'premium' | 'free' | 'page',
        target: this.containerRef,
        content: contentRef?.contentRef,
        mode: contentRef?.mode,
        percent: contentRef?.percent,
      });
    },

    async destroy(container: HTMLElement) {      
      if (!this.accessFactory) {
        return;
      }
      const { destroyFactory } = this.accessProvider as {
        destroyFactory: (paywall: Poool.AccessFactory) => void;
      };

      container.innerHTML = '';
      const access = toRaw(this.accessFactory);
      access.off('identityAvailable', this.onIdentityAvailable);
      destroyFactory?.(access);
      this.accessFactory = null;      
    },

    async recreate() {
      await this.destroy(this.$refs.containerRef as HTMLElement);
      this.create();
    },

    onIdentityAvailable(
      e: Parameters<
        Extract<
          AccessEvents['identityAvailable'],
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

  render() {
    // Our provider component is a renderless component
    // it does not render any markup of its own.
    return h(
      'div',
      {
        id: this.componentId,
        class: classNames('poool-widget', this.additionalClasses),
        ref: 'containerRef',
      },
      this.$slots?.default?.()
    );
  },
});

export default Paywall;
