/* eslint-disable no-console */
import { isMobile, isOldIE } from './';

const styles: Record<string, any> = {
  default: {
    access: {
      'background-color': '#807BFC',
      color: '#FFF',
      'font-weight': 'bold',
    },
    audit: {
      'background-color': '#424078',
      color: '#FFF',
      'font-weight': 'bold',
    },
  },
  warn: {
    'background-color': '#B2974B',
  },
  error: {
    'background-color': '#ee7674',
  },
};

const getStyles = (component: string, type?: 'warn' | 'error') => {
  const auditRelated = ['AuditProvider', 'Pixel'].includes(component);
  const section = auditRelated ? 'audit' : 'access';

  let _styles = { ...styles.default[section] };

  if (type) {
    _styles = {
      ..._styles,
      ...styles[type],
    };
  }

  return Object.entries(_styles).map(([k, v]) => `${k}: ${v};`).join(' ');
};

export const trace = (
  component: string = 'AccessProvider',
  debugEnabled: boolean = false,
  ...args: any[]
) => {
  if (!debugEnabled || !console) { return; }

  if (isMobile() || isOldIE()) {
    console.log('[Vue-Access] ' + component + ' :', ...args);
  } else {
    console.log(`[Vue-Access] %c ${component} `, getStyles(component), ...args);
  }
};

export const warn = (
  component: string = 'AccessProvider',
  debugEnabled: boolean = false,
  ...args: any[]
) => {
  if (!debugEnabled || !console) { return; }

  if (isMobile() || isOldIE()) {
    console.warn('[Vue-Access Debug] ' + component + ' :', ...args);
  } else {
    console.warn(`[Vue-Access] %c ${component} `,
      getStyles(component, 'warn'), ...args);
  }
};

export const error = (
  component: string = 'AccessProvider',
  debugEnabled: boolean = false,
  ...args: any[]
) => {
  if (!debugEnabled || !console) { return; }

  if (isMobile() || isOldIE()) {
    console.error('[Vue-Access Debug] ' + component + ' :', ...args);
  } else {
    console.error(`[Vue-Access] %c ${component} `,
      getStyles(component, 'error'), ...args);
  }
};
