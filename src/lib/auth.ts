import {
  type IAuthData,
  type MatrixClient,
  type MatrixError,
  type RegisterResponse,
} from 'matrix-js-sdk';
import cons from './cons';

export type FlowData = {
  [key: string]: any;
  session?: string;
  type?: string;
};

type SuccessResponse = {
  done: true;
  data: RegisterResponse;
};

type FailedResponse = {
  done: false;
  data: IAuthData;
};

export type ClientData = {
  user_id: string;
  access_token: string;
  device_id: string;
  homeserver: string;
};

export async function completeRegisterStage(
  client: MatrixClient,
  username: string,
  password: string,
  auth: FlowData
): Promise<SuccessResponse | FailedResponse> {
  try {
    const result = await client.registerRequest({
      username,
      password,
      auth,
      initial_device_display_name: cons.DEVICE_NAME,
    });
    return {
      done: true,
      data: result,
    };
  } catch (error_) {
    const error = error_ as MatrixError;
    // HTTP Status not 401, which means the UIAA flow breaked.
    if (error.httpStatus !== 401) throw error_;
    const result = error.data as IAuthData;
    return {
      done: false,
      data: result,
    };
  }
}
