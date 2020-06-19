import { useState } from 'react';

export const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue !== undefined ? initialValue : null);
  const onChange = (val) => {
    if (val.target !== null && val.target !== undefined) {
      setValue(val.target.value);
    } else {
      setValue(val);
    }
  };
  return { value, onChange };
};
