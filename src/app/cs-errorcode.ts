// https://github.com/cinnyapp/cinny/blob/44161c4157dccac383025825f5fd4d7f4620ea67/src/app/cs-errorcode.ts
export enum ErrorCode {
  M_FORBIDDEN = 'M_FORBIDDEN',
  M_UNKNOWN_TOKEN = 'M_UNKNOWN_TOKEN',
  M_MISSING_TOKEN = 'M_MISSING_TOKEN',
  M_BAD_JSON = 'M_BAD_JSON',
  M_NOT_JSON = 'M_NOT_JSON',
  M_NOT_FOUND = 'M_NOT_FOUND',
  M_LIMIT_EXCEEDED = 'M_LIMIT_EXCEEDED',
  M_UNRECOGNIZED = 'M_UNRECOGNIZED',
  M_UNKNOWN = 'M_UNKNOWN',

  M_UNAUTHORIZED = 'M_UNAUTHORIZED',
  M_USER_DEACTIVATED = 'M_USER_DEACTIVATED',
  M_USER_IN_USE = 'M_USER_IN_USE',
  M_INVALID_USERNAME = 'M_INVALID_USERNAME',
  M_WEAK_PASSWORD = 'M_WEAK_PASSWORD',
  M_PASSWORD_TOO_SHORT = 'M_PASSWORD_TOO_SHORT',
  M_ROOM_IN_USE = 'M_ROOM_IN_USE',
  M_INVALID_ROOM_STATE = 'M_INVALID_ROOM_STATE',
  M_THREEPID_IN_USE = 'M_THREEPID_IN_USE',
  M_THREEPID_NOT_FOUND = 'M_THREEPID_NOT_FOUND',
  M_THREEPID_AUTH_FAILED = 'M_THREEPID_AUTH_FAILED',
  M_THREEPID_DENIED = 'M_THREEPID_DENIED',
  M_SERVER_NOT_TRUSTED = 'M_SERVER_NOT_TRUSTED',
  M_UNSUPPORTED_ROOM_VERSION = 'M_UNSUPPORTED_ROOM_VERSION',
  M_INCOMPATIBLE_ROOM_VERSION = 'M_INCOMPATIBLE_ROOM_VERSION',
  M_BAD_STATE = 'M_BAD_STATE',
  M_GUEST_ACCESS_FORBIDDEN = 'M_GUEST_ACCESS_FORBIDDEN',
  M_CAPTCHA_NEEDED = 'M_CAPTCHA_NEEDED',
  M_CAPTCHA_INVALID = 'M_CAPTCHA_INVALID',
  M_MISSING_PARAM = 'M_MISSING_PARAM',
  M_INVALID_PARAM = 'M_INVALID_PARAM',
  M_TOO_LARGE = 'M_TOO_LARGE',
  M_EXCLUSIVE = 'M_EXCLUSIVE',
  M_RESOURCE_LIMIT_EXCEEDED = 'M_RESOURCE_LIMIT_EXCEEDED',
  M_CANNOT_LEAVE_SERVER_NOTICE_ROOM = 'M_CANNOT_LEAVE_SERVER_NOTICE_ROOM',
}
