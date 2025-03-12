// https://spec.matrix.org/latest/client-server-api/#mroommessage-msgtypes
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
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

const SPAN_ALLOWED_ATTR = [
  'data-mx-bg-color',
  'data-mx-color',
  'data-mx-spoiler',
  'data-mx-maths',
];
const A_ALLOWED_ATTR = ['name', 'target', 'href'];
const IMG_ALLOWED_ATTR = ['width', 'height', 'alt', 'title', 'src'];
const OL_ALLOWED_ATTR = ['start'];
const CODE_ALLOWED_ATTR = ['class'];
const DIV_ALLOWED_ATTR = ['data-mx-maths'];

const ALLOWED_ATTR = [
  ...SPAN_ALLOWED_ATTR,
  ...A_ALLOWED_ATTR,
  ...IMG_ALLOWED_ATTR,
  ...OL_ALLOWED_ATTR,
  ...CODE_ALLOWED_ATTR,
  ...DIV_ALLOWED_ATTR,
];

const ALLOWED_ATTR_MAPS = {
  A: A_ALLOWED_ATTR,
  SPAN: SPAN_ALLOWED_ATTR,
  IMG: IMG_ALLOWED_ATTR,
  OL: OL_ALLOWED_ATTR,
  CODE: CODE_ALLOWED_ATTR,
  DIV: DIV_ALLOWED_ATTR,
};

DOMPurify.addHook('afterSanitizeAttributes', (currentNode) => {
  const tagName = currentNode.tagName;
  const attrNames = currentNode.getAttributeNames();
  attrNames
    .filter(
      (attr) =>
        !(
          ALLOWED_ATTR_MAPS[tagName as keyof typeof ALLOWED_ATTR_MAPS] ?? []
        ).includes(attr)
    )
    .map((attr) => currentNode.removeAttribute(attr));
  if (tagName === 'A') {
    const href = currentNode.getAttribute('href');
    if (href?.startsWith('mxc:')) currentNode.removeAttribute('href');
  }
});

export function sanitizeMatrixHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    RETURN_TRUSTED_TYPE: false,
    FORBID_CONTENTS: ['mx-reply'],
    ALLOWED_URI_REGEXP: /(?:ftp|https?|mailto|magnet|mxc|matrix):/i,
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
