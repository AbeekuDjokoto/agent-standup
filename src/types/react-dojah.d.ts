declare module 'react-dojah' {
  import type { ComponentType, PropsWithChildren } from 'react';

  interface DojahProps extends Record<string, unknown> {
    appID: string;
    publicKey: string;
    type?: string;
    config?: Record<string, unknown>;
    userData?: Record<string, unknown>;
    govData?: Record<string, unknown>;
    metaData?: Record<string, unknown>;
    response?: (eventType: string, payload: unknown) => void;
  }

  const Dojah: ComponentType<PropsWithChildren<DojahProps>>;

  export default Dojah;
}

