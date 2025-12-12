import type { Poool } from 'poool-access';
import {
  type PropType,
  type VNodeRef,
  defineComponent,
  h,
  ref,
} from 'vue';

export declare interface RestrictedContentProps {
  /**
   * Method used by Poool to lock the restricted content
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/access/configuration#mode
   */
  mode: Poool.AccessConfigOptions['mode'];
  /**
   * Percentage of text you want to be hidden/stripped
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/access/configuration#percent
   */
  percent: Poool.AccessConfigOptions['percent'];
}

// RestrictedContentRef which will embbed the contentRef which need to be
// given to the PaywallComponent. Also bring percent and mode config props.
export declare interface RestrictedContentRef extends RestrictedContentProps {
  contentRef: VNodeRef & HTMLElement;
}

const RestrictedContent =  defineComponent({
  name: 'RestrictedContent',
  props: {
    mode: {
      type: String as PropType<RestrictedContentProps['mode']>,
      default: 'excerpt',
    },
    percent: {
      type: Number as PropType<RestrictedContentProps['percent']>,
      default: 80,
    } ,
  },
  setup () {
    const contentRef = ref<HTMLElement>();

    return { contentRef };
  },
  // Render a div with contentRef and $slots.default default child.
  render () {
    return h('div', { ref: 'contentRef' }, this.$slots?.default?.());
  },
});

export default RestrictedContent;
