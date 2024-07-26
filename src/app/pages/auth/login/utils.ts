import { AutoDiscoveryAction } from '~/app/cs-api';

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
