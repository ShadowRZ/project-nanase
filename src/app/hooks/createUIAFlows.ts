// https://github.com/cinnyapp/cinny/blob/a1a822c5b64eb4e31edbf9cbd4bd12f3926f084b/src/app/hooks/useUIAFlows.ts
import { AuthType, type IAuthData, type UIAFlow } from 'matrix-js-sdk';
import { type Accessor, createMemo } from 'solid-js';
import {
  getSupportedUIAFlows,
  getUIACompleted,
  getUIAError,
  getUIAErrorCode,
  getUIAParams,
  getUIASession,
} from '~/app/utils/matrix-uia';

export const createSupportedUIAFlows = (
  uiaFlows: Accessor<UIAFlow[]>,
  supportedStages: Accessor<string[]>
) => {
  const ret = createMemo(() =>
    getSupportedUIAFlows(uiaFlows(), supportedStages())
  );

  return ret;
};

export const createUIACompleted = (authData: Accessor<IAuthData>) => {
  const ret = createMemo(() => getUIACompleted(authData()));
  return ret;
};

export const createUIAParams = (authData: Accessor<IAuthData>) => {
  const ret = createMemo(() => getUIAParams(authData()));
  return ret;
};

export const createUIASession = (authData: Accessor<IAuthData>) => {
  const ret = createMemo(() => getUIASession(authData()));
  return ret;
};

export const createUIAErrorCode = (authData: Accessor<IAuthData>) => {
  const ret = createMemo(() => getUIAErrorCode(authData()));
  return ret;
};

export const createUIAError = (authData: Accessor<IAuthData>) => {
  const ret = createMemo(() => getUIAError(authData()));
  return ret;
};

export type StageInfo = Record<string, unknown>;
export type AuthStageData = {
  type: string;
  info?: StageInfo;
  session?: string;
  errorCode?: string;
  error?: string;
};
export type AuthStageDataGetter = () => AuthStageData | undefined;

export type UIAFlowInterface = {
  stageToComplete: AuthStageDataGetter;
  hasStage: (stageType: string) => boolean;
  getStageInfo: (stageType: string) => StageInfo | undefined;
};
export const createUIAFlow = (
  authData: Accessor<IAuthData>,
  uiaFlow: Accessor<UIAFlow>
): UIAFlowInterface => {
  const completed = createUIACompleted(authData);
  const params = createUIAParams(authData);
  const session = createUIASession(authData);
  const errorCode = createUIAErrorCode(authData);
  const error = createUIAError(authData);

  const stageToComplete: AuthStageDataGetter = () => {
    const { stages } = uiaFlow();
    const nextStage = stages.find((stage) => !completed().includes(stage));

    if (!nextStage) return undefined;

    const thisParams = params();
    const info = thisParams[nextStage];

    return {
      type: nextStage,
      info,
      session: session(),
      errorCode: errorCode(),
      error: error(),
    };
  };

  const hasStage = (stageType: string) => uiaFlow().stages.includes(stageType);

  const getStageInfo = (stageType: string): StageInfo | undefined => {
    if (!hasStage(stageType)) return undefined;

    return params()[stageType];
  };

  return {
    stageToComplete,
    hasStage,
    getStageInfo,
  };
};
