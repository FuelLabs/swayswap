import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type UserInfoState = {
  isNew: boolean;
};

const userInfoAtom = atomWithStorage<UserInfoState>('fuels__userIsNew', {
  isNew: true,
});

export function useUserInfo() {
  return useAtom(userInfoAtom);
}
