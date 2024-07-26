export const promiseFulfilledResult = <T>(
  settledResult: PromiseSettledResult<T>
): T | undefined => {
  if (settledResult.status === 'fulfilled') return settledResult.value;
  return undefined;
};

export const promiseRejectedResult = <T>(
  settledResult: PromiseSettledResult<T>
): any => {
  if (settledResult.status === 'rejected') return settledResult.reason;
  return undefined;
};
