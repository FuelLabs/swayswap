import { useEffect, useState } from 'react';

export function useFuel() {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [fuel, setFuel] = useState<Window['fuel']>();

  useEffect(() => {
    // Create a timeout to make sure it fails
    // in case fuel wallet is not install / detected
    const timeoutNotFound = setTimeout(() => {
      setLoading(false);
      clearTimeout(timeoutNotFound);
      setError('fuel not detected on the window!');
    }, 2000);

    const onFuelLoaded = () => {
      setLoading(false);
      clearTimeout(timeoutNotFound);
      setError('');
      setFuel(window.fuel);
    };

    if (window.fuel) {
      onFuelLoaded();
    }

    document.addEventListener('FuelLoaded', onFuelLoaded);

    // On unmount remove the event listener
    return () => {
      document.removeEventListener('FuelLoaded', onFuelLoaded);
    };
  }, []);

  return {
    fuel,
    error,
    isLoading,
  };
}
