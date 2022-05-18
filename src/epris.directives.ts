import eText from './directives/e-text';
import eIf from './directives/e-if';
import eFor from './directives/e-for';
import eBind from './directives/e-bind';
import eHTML from './directives/e-html';
import config from './epris.config';

import {
    createFuncsObject,
} from './epris.helpers';

const addPrefix = (directiveName: string): string => config.prefix + directiveName;

const directivesNames: string[] = [
    'text',
    'if',
    'for',
    'bind',
    'html',
].map(addPrefix);

const directivesFuncs: Function[] = [
    eText,
    eIf,
    eFor,
    eBind,
    eHTML,
];

const directives: { [key: string]: Function } = createFuncsObject(
    directivesNames,
    directivesFuncs,
);

export const isDirective = (directive: string) => directivesNames.includes(directive);

export const useDirective = (
    prop: string,
    data: any,
) => directives[prop](data);


