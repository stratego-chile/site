import { type FC } from 'react';

export type IsolatedComponent = FC<Record<string, never>>;

export type ResponseBody<T = unknown> = {
  error?: {
    value: boolean;
    message: string;
    timestamp?: number;
  };
} & T extends (unknown | undefined | null)
  ? {
    value?: T | never;
  }
  : {
    value: T;
  };
