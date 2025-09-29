import { useState, useEffect } from "react";

export function useStorageState<T>(
  key: string,
  initialState: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}
