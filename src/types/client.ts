export type ClientData = {
  id: string;
  homeserver: string;
  userId: string;
  accessToken: string;
  deviceId: string;
  refreshToken?: string;
};

export type ClientDatas = ClientData[];
