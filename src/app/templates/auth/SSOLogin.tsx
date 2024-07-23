import { Button } from '@kobalte/core/button';
import { type Component, For, Match, Show, Switch } from 'solid-js';
import { type IIdentityProvider, type MatrixClient } from 'matrix-js-sdk';
import { Flex, styled } from '~styled/jsx';
import ArrowSquareOutDuotone from '~icons/ph/arrow-square-out-duotone';
import LogoApple from '~icons/simple-icons/apple';
import LogoGoogle from '~icons/simple-icons/google';
import LogoGithub from '~icons/simple-icons/github';
import LogoGitlab from '~icons/simple-icons/gitlab';
import LogoFacebook from '~icons/simple-icons/facebook';
import LogoXOrTwitter from '~icons/simple-icons/x';

type SSOOtherIconProps = {
  icon?: string;
  client: MatrixClient;
};

const SSOButton = styled(Button, {
  base: {
    transition: 'common',
    transitionDuration: '200ms',
    position: 'relative',
    gap: '2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    rounded: 'xl',
    p: '2',
    borderWidth: '1',
    borderColor: 'mauve.7',
    borderStyle: 'solid',
    _hover: {
      cursor: 'pointer',
    },
  },
});

const SSOOtherIcon: Component<SSOOtherIconProps> = (props) => {
  return (
    <Show when={props.icon !== undefined} fallback={<ArrowSquareOutDuotone />}>
      {}
      <img
        class='w-6 inline-block'
        src={props.client.mxcUrlToHttp(props.icon!) ?? undefined}
      />
    </Show>
  );
};

export type SSOLoginProps = {
  idps: IIdentityProvider[];
  client: MatrixClient;
  register?: boolean;
};

export const SSOLogin: Component<SSOLoginProps> = (props) => {
  const ssoLoginBegin = (idp?: string): void => {
    const redirect = props.client.getSsoLoginUrl(
      window.location.href,
      'sso',
      idp
    );
    const homeserver = props.client.getHomeserverUrl();
    console.log(homeserver, redirect);
  };

  return (
    <>
      <styled.span
        display='inline-flex'
        flexDirection='row'
        alignItems='center'
        gap='2'
      >
        <ArrowSquareOutDuotone />
        <styled.h2 fontWeight='bold' textStyle='lg'>
          <Switch>
            <Match when={props.register !== true}>Sign in with...</Match>
            <Match when={props.register === true}>Register with...</Match>
          </Switch>
        </styled.h2>
      </styled.span>
      <Flex direction='column' mt='2' gap='2'>
        <For each={props.idps}>
          {(idp) => (
            <SSOButton
              onClick={() => {
                ssoLoginBegin(idp.id);
              }}
            >
              <Switch
                fallback={
                  <SSOOtherIcon icon={idp.icon} client={props.client} />
                }
              >
                <Match when={idp.brand === 'google'}>
                  <LogoGoogle />
                </Match>
                <Match when={idp.brand === 'github'}>
                  <LogoGithub />
                </Match>
                <Match when={idp.brand === 'gitlab'}>
                  <LogoGitlab />
                </Match>
                <Match when={idp.brand === 'apple'}>
                  <LogoApple />
                </Match>
                <Match when={idp.brand === 'facebook'}>
                  <LogoFacebook />
                </Match>
                <Match when={idp.brand === 'twitter'}>
                  <LogoXOrTwitter />
                </Match>
              </Switch>
              <span>{idp.name}</span>
            </SSOButton>
          )}
        </For>
      </Flex>
    </>
  );
};
