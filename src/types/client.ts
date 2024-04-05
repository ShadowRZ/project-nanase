export type SessionData = {
  id: string;
  homeserver: string;
  userId: string;
  accessToken: string;
  deviceId: string;
  refreshToken?: string;
};

export type SessionDatas = SessionData[];
