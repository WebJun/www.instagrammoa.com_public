export const sleep = async (milliSecond: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSecond);
  });
};
