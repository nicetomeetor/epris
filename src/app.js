import {h, patch, mount} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";

export default function Epris() {
    return {
        h,
        patch,
        mount,
        reactive,
        watchEffect
    };
};
