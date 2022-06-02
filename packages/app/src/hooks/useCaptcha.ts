import { useMachine, useSelector } from '@xstate/react';
import type { ReCAPTCHAProps } from 'react-google-recaptcha';
import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { RECAPTCHA_KEY } from '~/config';

// Need this because of fast-refresh
let IS_LOADED = false;

type MachineContext = {
  key?: string;
  captcha?: string | null;
};

type MachineEvents = { type: 'LOAD' } | { type: 'SET_CAPTCHA'; value: string };

const captchaMachine = createMachine<MachineContext>({
  schema: {
    context: {} as MachineContext,
    events: {} as MachineEvents,
  },
  id: 'captcha',
  initial: 'checking',
  context: {
    key: RECAPTCHA_KEY,
  },
  states: {
    checking: {
      always: [
        {
          target: 'loaded',
          cond: (_) => Boolean(IS_LOADED),
        },
        {
          target: 'waitingLoad',
          cond: (ctx) => Boolean(ctx.key),
        },
        {
          target: 'hidden',
        },
      ],
    },
    waitingLoad: {
      on: {
        LOAD: {
          target: 'transitioning',
          actions: () => {
            IS_LOADED = true;
          },
        },
      },
      after: {
        60000: {
          target: 'failed',
          cond: () => Boolean(IS_LOADED),
        },
      },
    },
    transitioning: {
      after: {
        500: {
          target: 'loaded',
        },
      },
    },
    loaded: {
      on: {
        SET_CAPTCHA: {
          actions: assign({ captcha: (_, ev) => ev.value }),
          target: 'done',
        },
      },
    },
    failed: {
      type: 'final',
    },
    hidden: {
      type: 'final',
    },
    done: {
      type: 'final',
    },
  },
});

type State = StateFrom<typeof captchaMachine>;

const selectors = {
  key: (state: State) => state.context.key,
  captcha: (state: State) => state.context.captcha,
  needToShow: (state: State) => !state.matches('hidden'),
  isFailed: (state: State) => state.matches('failed'),
  isLoaded: (state: State) => state.matches('loaded') || state.matches('done'),
  isLoading: (state: State) =>
    state.matches('checking') || state.matches('waitingLoad') || state.matches('transitioning'),
};

export function useCaptcha() {
  const [, send, service] = useMachine(captchaMachine);
  const key = useSelector(service, selectors.key);
  const captcha = useSelector(service, selectors.captcha);
  const needToShow = useSelector(service, selectors.needToShow);
  const isFailed = useSelector(service, selectors.isFailed);
  const isLoading = useSelector(service, selectors.isLoading);
  const isLoaded = useSelector(service, selectors.isLoaded);

  function setCaptcha(token: string | null) {
    send('SET_CAPTCHA', { value: token });
  }
  function load() {
    send('LOAD');
  }

  function getProps() {
    return {
      theme: 'dark',
      sitekey: key,
      onChange: setCaptcha,
      asyncScriptOnLoad: load,
    } as ReCAPTCHAProps;
  }

  return {
    needToShow,
    isFailed,
    isLoading,
    isLoaded,
    getProps,
    key,
    value: captcha || null,
  };
}
