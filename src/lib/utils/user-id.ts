const re =
  /@([!-9;-~]+):((?:(?:\d{1,3}.){3}\d{1,3}|\[[\d.:A-Fa-f]{2,45}]|[\d.A-Za-z-]{1,255})(?::\d{1,5})?)/;

type MXIDMatchResult = {
  username: string;
  homeserver: string;
};

export function matchMXID(input: string): MXIDMatchResult | undefined {
  const matches = re.exec(input);
  if (!matches) return undefined;
  const [, username, homeserver] = matches;

  return {
    username,
    homeserver,
  };
}

export const MXIDRegex = re;
