import { defineRecipe } from '@pandacss/dev';

export const typography = defineRecipe({
  description: 'Defauly typography container',
  className: 'typography',
  jsx: ['Typography'],
  base: {
    '& h1,h2,h3,h4,h5,h6': {
      lineHeight: 1.25,
      fontWeight: 'bold',
    },
    '& a': {
      color: 'colorPalette.text',
      textDecoration: 'underline',
      fontWeight: 'medium',
    },
    '& a code': {
      color: 'colorPalette.text',
    },
    '& blockquote': {
      ps: '2',
      borderStart: '2px solid token(colors.border.default)',
    },
    '& h1': { fontSize: '2.75rem' },
    '& h2': { fontSize: '2.5rem' },
    '& h3': { fontSize: '2rem' },
    '& h4': { fontSize: '1.75rem' },
    '& h5': { fontSize: '1.5rem' },
    '& h6': { fontSize: '1.25rem' },
    '& code': {
      px: '0.5',
      rounded: 'sm',
      fontSize: '.875em',
      fontFamily: 'mono',
    },
    '& pre': {
      padding: '1.25rem 1.5rem',
      overflowX: 'auto',
      rounded: 'sm',
    },
    '& pre,code': {
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      wordWrap: 'normal',
      tabSize: '4',
      hyphens: 'none',
      border: '1px solid token(colors.border.default)',
      backgroundColor: 'gray.6',
    },
    '& pre code': {
      'font-weight': 'inherit',
    },
    '& ol,ul': {
      'padding-left': '1.25em',
    },
    '& ol': {
      listStyleType: 'decimal',
    },
    '& ol[type="A"]': {
      listStyleType: 'upper-alpha',
    },
    '& ol[type="a"]': {
      listStyleType: 'lower-alpha',
    },
    '& ol[type="A" s]': {
      listStyleType: 'upper-alpha',
    },
    '& ol[type="a" s]': {
      listStyleType: 'lower-alpha',
    },
    '& ol[type="I"]': {
      listStyleType: 'upper-roman',
    },
    '& ol[type="i"]': {
      listStyleType: 'lower-roman',
    },
    '& ol[type="I" s]': {
      listStyleType: 'upper-roman',
    },
    '& ol[type="i" s]': {
      listStyleType: 'lower-roman',
    },
    '& ol[type="1"]': {
      listStyleType: 'decimal',
    },
    '& ul': {
      listStyleType: 'disc',
    },
    '& hr': {
      border: '1px solid token(colors.border.default)',
    },
    '& table': {
      display: 'block',
      margin: '1em 0',
      borderCollapse: 'collapse',
      overflowX: 'auto',
    },
    '& tr:nth-child(2n)': {
      background: 'bg.muted',
    },
    '& td,th': {
      border: '1px solid token(colors.border.default)',
      padding: '.625em 1em',
    },
    '& summary': {
      cursor: 'pointer',
    },
  },
});
