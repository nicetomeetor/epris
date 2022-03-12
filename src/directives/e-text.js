export default (value, state) => {
    console.log(state[value])
    return {
        key: 'children',
        value: state[value] !== undefined ? String(state[value]) : value
    }
}