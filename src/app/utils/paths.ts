export const getLoginPath = (server?: string, username?: string) => {
  const encodedServer = server ? encodeURIComponent(server) : undefined;
  const query = username ? `?username=${username}` : undefined;
  const path = encodedServer ? `/${encodedServer}` : undefined;
  const ret = `/login${path}${query}`;
  return ret;
};

export const withSearchParam = <T extends Record<string, string>>(
  path: string,
  searchParam: T
): string => {
  const params = new URLSearchParams(searchParam);

  return `${path}?${params.toString()}`;
};
