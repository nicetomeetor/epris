import eText from './directives/e-text';
import eIf from './directives/e-if';
import eFor from './directives/e-for';
import eBind from './directives/e-bind'

import config from './epris.config';

const addPrefix = (directive: string): string => config.prefix + directive;

const directives = [
    'text',
    'if',
    'for',
    'bind',
].map(addPrefix);

const directivesFunc: {[key: string]: Function} = {
    'e-text': eText,
    'e-if': eIf,
    'e-for': eFor,
    'e-bind': eBind
};

export const isDirective = (directive: string) => directives.includes(directive);

export const useDirective = (prop: string, data: any) => directivesFunc[prop](data)


