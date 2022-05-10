import eText from './directives/e-text';
import eIf from './directives/e-if';
import eFor from './directives/e-for';
import eBind from './directives/e-bind';
import eHTML from './directives/e-html';

import config from './epris.config';

const addPrefix = (directiveName: string): string => config.prefix + directiveName;

const directivesNames: string[] = [
    'text',
    'if',
    'for',
    'bind',
    'html',
].map(addPrefix);

const directives: Function[] = [
    eText,
    eIf,
    eFor,
    eBind,
    eHTML,
];

const createDirectivesObject = (): { [key: string]: Function } => {
    const result: { [key: string]: Function } = {};

    for (let i = 0; i < directivesNames.length; i++) {
        result[directivesNames[i]] = directives[i];
    }

    return result;
};

const directivesFuncs: { [key: string]: Function } = createDirectivesObject();

export const isDirective = (directive: string) => directivesNames.includes(directive);

export const useDirective = (
    prop: string,
    data: any,
) => directivesFuncs[prop](data);


