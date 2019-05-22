import sleep from './sleep';

export async function waitUntil(
  f: () => Promise<boolean> | boolean,
  duration: number = 1000 / 60
) {
  await new Promise(async (resolve) => {
    while (true) {
      if (await f()) {
        resolve();
        break;
      }
      await sleep(duration);
    }
  });
}
