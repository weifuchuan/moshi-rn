import { useObservable } from 'rxjs-hooks';
import immediateInterval from '@/kit/functions/immediateInterval';
import { take } from 'rxjs/operators';
import { useEffect, useState } from 'react';

// export default function useCountdown(duration: number): number {
//   const count = useObservable(() =>
//     immediateInterval(1000).pipe(take(duration + 1))
//   );
//   return count ? duration - count : 0;
// }

// duration: second
export default function useCountdown(duration: number): number {
  const [ count, setCount ] = useState(duration);
  useEffect(() => {
    let i = 1;
    const id = setInterval(() => {
      if (duration - i === 0) {
        clearInterval(id);
      }
      setCount(duration - i);
      i++;
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
