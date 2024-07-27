import to from 'await-to-js';
import {
  type MatrixError,
  type MatrixClient,
  type LoginResponse,
} from 'matrix-js-sdk';
import { AutoDiscoveryAction } from '~/app/cs-api';
import { ErrorCode } from '~/app/cs-errorcode';
import { type Session } from '~/types/client';

export function errorForAutoDiscoveryAciton(
  action: AutoDiscoveryAction,
  host: string
) {
  switch (action) {
    case AutoDiscoveryAction.PROMPT: {
      return new Error(
        'Unexpected error occoured, please input another user ID.'
      );
    }

    case AutoDiscoveryAction.IGNORE: {
      return new Error('Unexpected error occoured, please try again.');
    }

    case AutoDiscoveryAction.FAIL_PROMPT: {
      return new Error(
        `The homeserver configuration on ${host} appears unusable.`
      );
    }

    case AutoDiscoveryAction.FAIL_ERROR: {
      return new Error('The homeserver configutaion looks invaild.');
    }
  }
}

export async function loginWithPassword(
  mx: MatrixClient,
  username: string,
  password: string
) {
  const [err, res] = await to<LoginResponse, MatrixError>(
    mx.loginWithPassword(username, password)
  );

  if (err) {
    if (err.httpStatus === 400) {
      throw new Error('Invaild request.');
    }

    if (err.httpStatus === 429) {
      throw new Error('Your login request has been rate limited.');
    }

    if (err.errcode === ErrorCode.M_USER_DEACTIVATED) {
      throw new Error('This user has been deactivated.');
    }

    if (err.httpStatus === 403) {
      throw new Error("You're not allowed to login.");
    }

    throw new Error('Unknown error occoured. Please try again.');
  }

  return res;
}

export function sessionFromLoginResponse(
  baseUrl: string,
  resp: LoginResponse
): Session {
  const {
    user_id: userId,
    access_token: accessToken,
    device_id: deviceId,
  } = resp;

  return {
    baseUrl,
    userId,
    accessToken,
    deviceId,
  };
}
