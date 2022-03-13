const prefix = "e-on:";

class EprisEvents {
    check(event) {
        return event.includes(prefix);
    }

    addEvent(node, event, method) {
        node.addEventListener(event, method);
    }
}

export default new EprisEvents();
