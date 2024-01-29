import { Input } from '@mui/material';
import React, { useState } from 'react';

const TextInputWithEnterCallback = ({ id, onEnterPress, hideInput }: any) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      onEnterPress(inputValue);
      setInputValue(''); // Efface le contenu de l'input après avoir appuyé sur Entrée
    }
  };

  return (
    <Input
    id={id}
	  className='custom-input'
      type="text"
      value={inputValue}
      onChange={(e: any) => setInputValue(e.target.value)}
      onKeyDown={handleKeyPress}
	  onClick={(e: any) => e.stopPropagation()}
      placeholder="Username"
	  onBlur={hideInput}
    />
  );
};

export default TextInputWithEnterCallback;