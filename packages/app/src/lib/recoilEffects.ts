import { recoilPersist } from 'recoil-persist';

import { LocalStorageKey } from './constants';

export const persistEffect = recoilPersist({
  key: `${LocalStorageKey}-state`,
  storage: localStorage,
}).persistAtom;
