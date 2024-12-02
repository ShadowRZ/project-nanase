import { createAsync } from '@solidjs/router';
import { MatrixClient } from 'matrix-js-sdk';
import { Component, onCleanup, splitProps, type JSX } from 'solid-js';
import { css } from '@shadowrz/hanekokoro-ui/styled-system/css';
import { splitCssProps } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import {
  Assign,
  HTMLStyledProps,
} from '@shadowrz/hanekokoro-ui/styled-system/types';
import { useMatrixClient } from '../../hooks/useMatrixClient';

type MxcImgProps = {
  src?: string;
  width?: JSX.IntrinsicElements['img']['width'];
  height?: JSX.IntrinsicElements['img']['width'];
  client?: MatrixClient;
  resizeMethod?: string;
  allowDirectLinks?: boolean;
  allowRedirects?: boolean;
  useAuthentication?: boolean;
};

export const MxcImg: Component<Assign<HTMLStyledProps<'img'>, MxcImgProps>> = (
  props
) => {
  const [selfProps, sizeProps, restProps] = splitProps(
    props,
    [
      'src',
      'client',
      'resizeMethod',
      'allowDirectLinks',
      'allowRedirects',
      'useAuthentication',
    ],
    ['width', 'height']
  );

  const [cssProps, rootProps] = splitCssProps(restProps);
  const { css: cssProp, ...styleProps } = cssProps;
  const className = css(styleProps, cssProp);

  const mx = useMatrixClient();
  const src = () => selfProps.src;
  const useAuthentication = () => selfProps.useAuthentication ?? false;
  const resizeMethod = () => selfProps.resizeMethod;
  const allowDirectLinks = () => selfProps.allowDirectLinks;
  const allowRedirects = () => selfProps.allowRedirects;

  const imgSrc = createAsync(async () => {
    const $mx = mx();
    const $src = src();
    const $resizeMethod = resizeMethod();
    const $allowDirectLinks = allowDirectLinks();
    const $allowRedirects = allowRedirects();
    const $useAuthentication = useAuthentication();
    if ($src === undefined) return;
    const url = $mx.mxcUrlToHttp(
      $src,
      undefined,
      undefined,
      $resizeMethod,
      $allowDirectLinks,
      $allowRedirects,
      $useAuthentication
    );
    // TODO: Use a blob cache
    if ($useAuthentication) {
      if (!url) return;
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${$mx.getAccessToken()}`,
        },
      });
      return URL.createObjectURL(await resp.blob());
    } else {
      return url ?? undefined;
    }
  });

  onCleanup(() => {
    // TODO: Schedule release
  });

  return <img {...rootProps} {...sizeProps} src={imgSrc()} class={className} />;
};
