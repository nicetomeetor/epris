const prefix = "e-"

import eText from "./directives/e-text"
import eIf from "./directives/e-if"

const addPrefix = (directive) => {
    return prefix + directive
}

 const directives = [
    "text",
    "if"
]

const directivesFunc = {
    "e-text": eText,
    "e-if": eIf
}

class DirectivesObject {
    constructor(directives) {
        this.directives = directives.map(addPrefix);
    }

    check(directive) {
        return this.directives.includes(directive);
    }

    make(prop, value) {
        return directivesFunc[prop](value)
    }
}

export default new DirectivesObject(directives);