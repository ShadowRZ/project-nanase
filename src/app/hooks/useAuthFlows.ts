// https://github.com/cinnyapp/cinny/blob/44161c4157dccac383025825f5fd4d7f4620ea67/src/app/hooks/useAuthFlows.ts
import {
  type MatrixError,
  type IAuthData,
  type ILoginFlowsResponse,
} from 'matrix-js-sdk';
import { createContext, useContext } from 'solid-js';

export enum RegisterFlowStatus {
  FlowRequired = 401,
  InvalidRequest = 400,
  RegistrationDisabled = 403,
  RateLimited = 429,
}

export const parseRegisterErrResp = (
  matrixError: MatrixError
): RegisterFlowsResponse => {
  switch (matrixError.httpStatus) {
    case RegisterFlowStatus.InvalidRequest: {
      return { status: RegisterFlowStatus.InvalidRequest };
    }

    case RegisterFlowStatus.RateLimited: {
      return { status: RegisterFlowStatus.RateLimited };
    }

    case RegisterFlowStatus.RegistrationDisabled: {
      return { status: RegisterFlowStatus.RegistrationDisabled };
    }

    case RegisterFlowStatus.FlowRequired: {
      return {
        status: RegisterFlowStatus.FlowRequired,
        data: matrixError.data as IAuthData,
      };
    }

    default: {
      return { status: RegisterFlowStatus.InvalidRequest };
    }
  }
};

export type AuthFlows = {
  loginFlows: ILoginFlowsResponse;
  registerFlows: RegisterFlowsResponse;
};

export type RegisterFlowsResponse =
  | {
      status: RegisterFlowStatus.FlowRequired;
      data: IAuthData;
    }
  | {
      status: Exclude<RegisterFlowStatus, RegisterFlowStatus.FlowRequired>;
    };

const AuthFlowsContext = createContext<AuthFlows>();

export const AuthFlowsProvider = AuthFlowsContext.Provider;

export const useAuthFlows = (): AuthFlows => {
  const authFlows = useContext(AuthFlowsContext);
  if (!authFlows) {
    throw new Error('Auth Flow info is not loaded!');
  }

  return authFlows;
};
