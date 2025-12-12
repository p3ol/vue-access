import type { Poool } from 'poool-access';

export interface AccessContextValue {
  /**
   * Your poool app ID
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/access/installation
   */
  appId?: string;
  /**
   * Your poool access config options
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/access/configuration
   */
  config?: Poool.AccessConfigOptions;
  /**
   * Your poool access texts ati_tag_options
   *
   * More infos: https://www.poool.dev/docs/access/javascript/access/texts
   */
  texts?: { [key: string]: string };
  /**
   * Your poool access styles
   *
   * More infos: https://www.poool.dev/docs/access/javascript/access/styles
   */
  styles?: Poool.styles;
  /**
   * Your poool access events
   *
   * More infos: https://www.poool.dev/docs/access/javascript/access/events
   */
  events?: { [key in Poool.EventsList]?: AccessEvents[key] };
  /**
   * Your pool access variables
   *
   * More infos: https://www.poool.dev/docs/access/javascript/access/variables
   */
  variables?: { [key: string]: any };
  /**
   * The poool access script url
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/access/installation
   */
  scriptUrl?: string;
  /**
   * The poool access sdk
   *
   * More infos: https://www.poool.dev/docs/access/vue
   */
  lib?: Poool.Access;
  /**
   * Function to trigger a new access init, returns the created access instance,
   * with passed options
   *
   * More infos: https://www.poool.dev/docs/access/vue
   */
  createFactory: (
    opts?: Pick<
      AccessContextValue,
      'config' | 'texts' | 'styles' | 'variables' | 'events'
    >
  ) => Poool.AccessFactory;
  /**
   * Function to delete a factory
   *
   * More infos: https://www.poool.dev/docs/access/vue
   */
  destroyFactory: (factory: Poool.AccessFactory) => void;
}

export interface AuditContextValue {
  /**
   * Your Poool App ID
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/installation
   */
  appId?: string;
  /**
   * Your pool Audit configuration object
   *
   * More infos:
   * https://www.poool.dev/docs/access/javascript/audit/configuration
   */
  config?: Poool.AuditConfigOptions;
  /**
   * Your pool Audit events
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/events
   */
  events?: { [key in Poool.EventsList]: AuditEvents[key] };
  /**
   * The poool audit script url
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/installation
   */
  scriptUrl?: string;
  /**
   * The poool audit sdk
   *
   * More infos: https://www.poool.dev/docs/access/vue
   */
  lib?: Poool.Audit;
}

export declare type EventCallbackFunction<Props> = (props: Props) => any;
export declare type EventCallbackObject<Props> = {
  once: true;
  callback: EventCallbackFunction<Props>;
};

export declare type EventCallback<Props> =
  | EventCallbackFunction<Props>
  | EventCallbackObject<Props>;

export declare type BaseEvents = {
  [key in Poool.EventsList]?: any
};

export declare interface AccessEvents extends BaseEvents {
  /**
   * Triggered after the first tracking request, when the user ID is available.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  identityAvailable?: EventCallback<{
    userId: string,
    contextName: string
    contextType: string,
    contextValue: string,
    groupSlug: string,
    scenarioName: string,
    widget: string,
    actionName: string,
    trigger: string,
    triggerType: string,
    triggerValue: string
  }>;
  /**
   * Triggered when the paywall locks the current article.
   */
  lock?: EventCallback<undefined>;
  /**
   * Triggered when the paywall is fully loaded and displayed inside the page.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  ready?: EventCallback<{
    widget: string,
    actionName: string,
    trigger: string,
    triggerType: string,
    triggerValue: string
  }>;
  /**
   * Triggered when the paywall has been seen by the user
   * (when it has entered the browser's viewport).
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  paywallSeen?: EventCallback<{
    widget: string,
    actionName: string,
    trigger: string,
    triggerType: string,
    triggerValue: string
  }>;
  /**
   * Triggered when the paywall unlocks the current article.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  release?: EventCallback<{
    widget: string,
    actionName: string,
    trigger: string,
    triggerType: string,
    triggerValue: string
  }>
  /**
   * Triggered when a user registers to your newsletter using
   * the newsletter widget or the pass widget.
   *
   * For example, thanks to this event, you'll be able
   * to save a user's email address using tools such as Mailchimp and Sendgrid.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  register?: EventCallback<{
    email: string,
    newsletterId: string,
    passId: string
  }>;
  /**
   * Triggered when a user has
   * clicked a subscribe button/link inside the paywall.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  subscribeClick?: EventCallback<{
    widget: string,
    actionName: string,
    button: string,
    originalEvent: MouseEvent,
    url: string
  }>;
  /**
   * Triggered when a user has clicked a signin button/link inside the paywall.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  loginClick?: EventCallback<{
    widget: string,
    actionName: string,
    button: string,
    originalEvent: MouseEvent,
    url: string
  }>;
  /**
   * Triggered when a user has clicked the Link Discovery widget's button
   * inside the paywall.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  discoveryLinkClick?: EventCallback<{
    widget: string,
    actionName: string,
    button: string,
    originalEvent: MouseEvent,
    url: string
  }>;
  /**
   * Triggered when a user has clicked the 'No thanks' link in the widget.
   * Initialy loaded action will be replaced by an alternative one,
   * set up in the dashboard in journey / actions configurations.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  alternativeClick?: EventCallback<{
    widget: string,
    actionName: string,
    button: string,
    originalEvent: MouseEvent,
  }>;
  /**
   * Triggered if an unknown/unexpected error
   * has appeared when loading the paywall.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  error?: (err: Error, event?: { forceRelease?: () => void }) => any |
    { once: boolean, callback: (err: Error, event?: {
      forceRelease?: () => any;
    }) => any };
  /**
   * Triggered if the browser is detected
   * to be too old to run Poool's paywall correctly.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  outdatedBrowser: EventCallback<undefined>;
  /**
   * Triggered when a user has clicked a data information
   * button/link inside the paywall.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  dataPolicyClick?: EventCallback<{
    widget: string,
    actionName: string,
    button: string,
    originalEvent: MouseEvent,
    url: string
  }>;
  /**
   * Triggered when a user registers through a form using the Form widget.
   *
   * For example, thanks to this event, you'll be able to save a user's provided
   * informations using tools such as a DMP.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  formSubmit?: EventCallback<{
    name: string,
    fields: { [fieldKey: string]: any },
    valid: { [fieldKey: string]: boolean}
  }>;
  /**
   * Triggered when a user clicks on Sign-in with Facebook inside the paywall,
   * enabled using `facebook_login_enabled` option.
   *
   * Use this event to place your calls to Facebook's login SDK.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  facebookLoginClick?: EventCallback<{
    widget: string,
    actionName: string,
    originalEvent: MouseEvent,
  }>;
  /**
   * Triggered when a user clicks on Sign-in with Google inside the paywall,
   * enabled using `google_login_enabled` option.
   *
   * Use this event to place your calls to Google's login SDK.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  googleLoginClick?: EventCallback<{
    widget: string,
    actionName: string,
    originalEvent: MouseEvent,
  }>;
  /**
   * Triggered after an answer is chosen in the question widget.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  answer?: EventCallback<{
    questionId: string;
    answer: string;
  }>;
  /**
   * Triggered after a click on the consent button.
   * It is then possible to set up your own consent logic.
   *
   * You can check our
   * [cookie-wall with Didomi](https://www.poool.dev/guides/cookie-wall)
   * guide for more information.
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  consent?: EventCallback<any>;
  /**
   * Triggered after a click on a button component,
   * used in an advanced appearance or a form.
   *
   * Event Button
   * Arguments: { event: { name: string, buttonId: string } }
   *
   * Link Button
   * Arguments: { event: { url: string, buttonId: string } }
   *
   * more infos:https://www.poool.dev/docs/access/javascript/access/events
   */
  customButtonClick?: EventCallback<{
    name?: string;
    url?: string;
    buttonId: string;
  }>
}

export declare interface AuditEvents extends BaseEvents {
  /**
   * Triggered after the first tracking request, when the user ID is available.
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/events
   */
  identityAvailable?: EventCallback<{
    userId: string,
    contextName: string,
    contextType: string,
    contextValue: string,
    groupSlug: string,
    journeyName: string
  }>;
  /**
   * Triggered when the user ID isnt available (ex: disabled cookies).
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/events
   */
  identityUnknown?: EventCallback<undefined>;
  /**
   * Triggered on error while sending tracking event.
   *
   * More infos: https://www.poool.dev/docs/access/javascript/audit/events
   */
  trackError?: EventCallback<{ error: Error }>;
}
