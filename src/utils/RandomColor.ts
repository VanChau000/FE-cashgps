import { useState } from 'react';

const RandomColor = () => {
  const [color, setColor] = useState<any>('');
  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
  };
  return { color, generateColor };
};
export default RandomColor;
