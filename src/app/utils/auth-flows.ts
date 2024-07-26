import { type MatrixClient, type MatrixError } from 'matrix-js-sdk';
import {
  RegisterFlowStatus,
  parseRegisterErrResp,
  type AuthFlows,
  type RegisterFlowsResponse,
} from '../hooks/useAuthFlows';
import { promiseFulfilledResult, promiseRejectedResult } from './promise';

export async function getAuthFlows(mx: MatrixClient) {
  const [login, register] = await Promise.allSettled([
    mx.loginFlows(),
    mx.registerRequest({}),
  ]);
  const loginFlows = promiseFulfilledResult(login);
  const registerResp = promiseRejectedResult(register) as
    | MatrixError
    | undefined;

  let registerFlows: RegisterFlowsResponse = {
    status: RegisterFlowStatus.InvalidRequest,
  };

  if (typeof registerResp === 'object' && registerResp.httpStatus) {
    registerFlows = parseRegisterErrResp(registerResp);
  }

  if (!loginFlows) {
    throw new Error('Missing auth flow!');
  }

  if ('errcode' in loginFlows) {
    throw new Error('Failed to load auth flow!');
  }

  const authFlows: AuthFlows = {
    loginFlows,
    registerFlows,
  };

  return authFlows;
}
