import eText from "./directives/e-text";
import eIf from "./directives/e-if";
import eFor from "./directives/e-for";

const prefix = "e-";

const addPrefix = (directive) => {
    return prefix + directive
};

 const directives = [
     'text',
     'if',
     'for',
];

const directivesFunc = {
    "e-text": eText,
    "e-if": eIf,
    'e-for': eFor,
};

class DirectivesObject {
    constructor(directives) {
        this.directives = directives.map(addPrefix);
    }

    check(directive) {
        return this.directives.includes(directive);
    }

    make(prop, value, state, methods, node) {
        return directivesFunc[prop](value, state, methods, node);
    }
}

export default new DirectivesObject(directives);