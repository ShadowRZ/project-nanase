// https://spec.matrix.org/latest/client-server-api/#mroommessage-msgtypes
// https://github.com/cinnyapp/cinny/blob/689adde8ae148d2de76bab0d11d7e0e8f35b7439/src/util/sanitize.js
import { getHttpUriForMxc } from 'matrix-js-sdk';
import sanitizeHtml, { type Attributes, type Tag } from 'sanitize-html';

const MAX_NESTING_DEPTH = 100;

const ALLOWED_HTML_TAGS = [
  'font',
  'del',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'sup',
  'sub',
  'li',
  'b',
  'i',
  'u',
  'strong',
  'em',
  'strike',
  's',
  'code',
  'hr',
  'br',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'caption',
  'pre',
  'span',
  'img',
  'details',
  'summary',
];

const URL_SCHEMES = ['https', 'http', 'ftp', 'mailto', 'magnet'];

const TAG_ALLOWED_ATTRS = {
  font: ['style', 'data-mx-bg-color', 'data-mx-color', 'color'],
  span: [
    'style',
    'data-mx-bg-color',
    'data-mx-color',
    'data-mx-spoiler',
    'data-project-nanase-href',
    'data-project-nanase-pill',
    'data-project-nanase-ping',
    'data-project-nanase-reference',
    'data-project-nanase-reference-event',
    'data-project-nanase-reference-vias',
  ],
  a: ['name', 'target', 'href', 'rel'],
  img: ['width', 'height', 'alt', 'title', 'src', 'data-mx-emoticon'],
  ol: ['start'],
  code: ['class'],
};

const TAG_ALLOWED_SCHEMES = {
  img: ['mxc'],
  a: URL_SCHEMES,
};

const TAG_ALLOWED_CLASSES = {
  code: ['language-*'],
};

function transformAnchorTag(tagName: string, attribs: Attributes): Tag {
  const rex =
    /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/gu;
  const newHref = attribs.href.replaceAll(
    rex,
    (match) => `[e-${match.codePointAt(0)?.toString(16)}]`
  );

  return {
    tagName,
    attribs: {
      ...attribs,
      href: newHref,
      rel: 'noopener',
      target: '_blank',
    },
  };
}

function transformImgTag(
  tagName: string,
  attribs: Attributes,
  baseUrl: string
): Tag {
  const { src } = attribs;
  if (!src.startsWith('mxc://')) {
    return {
      tagName: 'a',
      attribs: {
        href: src,
        rel: 'noopener',
        target: '_blank',
      },
      text: attribs.alt || src,
    };
  }

  return {
    tagName,
    attribs: {
      ...attribs,
      src: getHttpUriForMxc(baseUrl, src),
    },
  };
}

export function sanitizeMatrixHtml(
  html: string,
  baseUrl: string,
  ignoreUIReplacement?: boolean
) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_HTML_TAGS,
    allowedAttributes: TAG_ALLOWED_ATTRS,
    disallowedTagsMode: 'discard',
    allowedSchemes: URL_SCHEMES,
    allowedSchemesByTag: TAG_ALLOWED_SCHEMES,
    allowedSchemesAppliedToAttributes: ['href'],
    allowProtocolRelative: false,
    allowedClasses: TAG_ALLOWED_CLASSES,
    allowedStyles: {
      '*': {
        color: [/^#(?:[\dA-Fa-f]{3}){1,2}$/],
        'background-color': [/^#(?:[\dA-Fa-f]{3}){1,2}$/],
      },
    },
    transformTags: ignoreUIReplacement
      ? {}
      : {
          a: transformAnchorTag,
          img(tagName, attribs) {
            return transformImgTag(tagName, attribs, baseUrl);
          },
        },
    nonTextTags: [
      'style',
      'script',
      'textarea',
      'option',
      'noscript',
      'mx-reply', // Rich Reply
    ],
    nestingLimit: MAX_NESTING_DEPTH,
  });
}

export function sanitizeText(body: string) {
  const tagsToReplace: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return body.replaceAll(/["&'<>]/g, (tag) => tagsToReplace[tag] || tag);
}
