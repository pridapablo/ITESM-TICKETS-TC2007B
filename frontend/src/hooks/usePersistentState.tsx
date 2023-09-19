import { useState } from 'react';

function usePersistentState<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue;
  const [state, setState] = useState<T>(initial);

  const setPersistentState = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setState(newValue);
  };

  return [state, setPersistentState] as const;
}

export default usePersistentState;
