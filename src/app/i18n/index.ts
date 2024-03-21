import { createMemo } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';
import * as en from './en';

const dict: () => i18n.BaseRecordDict = createMemo(() => i18n.flatten(en.dict));
const _tr = i18n.translator(dict);
const t = (key: string): string => _tr(key) as string;
export default t;
