import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~/context/AppContext';
import { Pages } from '~/types/pages';

export function useCreateWallet(redirect = true) {
  const { createWallet } = useAppContext();
  const navigate = useNavigate();

  return useMutation(async () => createWallet(), {
    onSuccess: () => {
      toast.success('Wallet created successfully!');
      if (redirect) navigate(Pages.swap);
    },
  });
}
