import eText from './directives/e-text';
import eIf from './directives/e-if';
import eFor from './directives/e-for';

import config from './epris.config';

const addPrefix = (directive: string): string => config.prefix + directive;

const directives = [
    'text',
    'if',
    'for',
].map(addPrefix);

const directivesFunc: {[key: string]: Function} = {
    'e-text': eText,
    'e-if': eIf,
    'e-for': eFor,
};

export const isDirective = (directive: string) => directives.includes(directive);

export const useDirective = (prop: string, data: any) => directivesFunc[prop](data)


