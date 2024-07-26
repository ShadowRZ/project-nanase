export const getAppBaseUrl = () => {
  const origin: string = trimSlash(window.location.origin);
  const baseUrl = trimSlash(import.meta.env.BASE_URL ?? '');

  return `${origin}/${baseUrl}`;
};

const START_SLASHES_REG = /^\/+/g;
const END_SLASHES_REG = /\/+$/g;
export const trimLeadingSlash = (str: string): string =>
  str.replaceAll(START_SLASHES_REG, '');
export const trimTrailingSlash = (str: string): string =>
  str.replaceAll(END_SLASHES_REG, '');
export const trimSlash = (str: string): string =>
  trimLeadingSlash(trimTrailingSlash(str));
