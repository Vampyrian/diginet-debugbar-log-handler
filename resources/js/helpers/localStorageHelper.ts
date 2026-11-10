export const getBooleanFromStorage = (key: string, defaultValue: boolean = false): boolean => {
  const value = localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }
  return value === 'true';
};

export const setBooleanToStorage = (key: string, value: boolean): void => {
  localStorage.setItem(key, value.toString());
};

export const getStringFromStorage = (key: string, defaultValue: string = ''): string => {
  const value = localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }
  return value;
};

export const setStringToStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};
