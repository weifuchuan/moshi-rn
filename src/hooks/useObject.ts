import { useState } from 'react';

export default function useObject<T = { [key: string]: any }>(
  init: T = {} as any 
): T {
  const [ value ] = useState(init);
  return value;
}
