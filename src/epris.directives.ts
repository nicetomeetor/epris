import eText from './directives/e-text';
import eIf from './directives/e-if';
import eFor from './directives/e-for';

import config from './epris.config';
import { Actions, State } from './epris.types';

const addPrefix = (directive: string): string => {
    return config.prefix + directive;
};

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

class DirectivesObject {
    private directives: Array<string>;

    constructor(directives: Array<string>) {
        this.directives = directives;
    }

    check(directive: string) {
        return this.directives.includes(directive);
    }

    make(prop: string,
         value: any,
         state: State,
         methods: Actions,
         node: HTMLElement | Node
    ) {
        return directivesFunc[prop](value, state, methods, node);
    }
}

export default new DirectivesObject(directives);