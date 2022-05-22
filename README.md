<p align="center">
    <img alt="logo" width="200" height="200" src="assets/logo.svg">
</p>

# Epris

Epris is a JavaScript library that simplifies interface development.

🚀 Reactive State

🔧 Event Actions

🔮 State Effects

## Installation

Install packages

```
npm install
```

Create library bundle

```
npm run build
```

Use webpack-dev-server

```
npm run serve
```

or

```
npm run start
```

## Documentation

Epris constructor object argument structure.

```js
const el = '#app';
const state = {};
const actions = {};
const effects = {};

const app = new Epris({
   el,
   state,
   actions,
   effects, 
});
```

### el
Expects an argument of a selector string. Element contains the logic for displaying the interface using directives and state.

```html
<div id='app'>...</div>
```

### state
Changes an object to a reactive state.

```js
const state = {
    name: 'Michael',
    hobbies: ['Music', 'Philosophy', 'Programming'],
    status: true,
};
```

### actions
Associates a functions object with an Epris context to access the state and use the properties of the state.

```js
const actions = {
    printName() {
        console.log(this.name);
    },
};
```
### effects
Attaches an object of functions responding to state property changes.

```js
const effects = {
    hobbies() {
        console.log(`Amount of hobbies: ${this.hobbies.length}`);
    },
};
```

### directives

Using directives, you can display the interface in a certain state.

**e-if** and **e-else** show element depending on the state.

```html
<div e-if='status'>200</div>
<div e-else>404</div>
```

**e-for** generates some elements based on array state property.

```html
<div e-for='hobby of hobbies'>...</div>
```

**e-text** updates element content.
```html
<div e-text='name'></div>
```

**e-bind** connects element attribute.

```html
<div e-bind:class='name'>Hobbies:</div>
```

**e-on** attaches an event listener.

```html
<button e-on:click='printName()'>PRINT NAME</button>
```

## Examples

```html
<html>
    <head>
        <meta charset='UTF-8'>
        <title>Epris-Example</title>
    </head>
    <body>
        <h1>Epris</h1>
        <div id='app'>
            <div e-if='status'>200</div>
            <div e-else>404</div>
            <hr>
            <div e-text='name'></div>
            <div e-bind:class='name'>Hobbies:</div>
            <div e-for='hobby of hobbies'>
                <div e-text='hobby'></div>
            </div>
            <hr>
            <button e-on:click='printName()'>PRINT NAME</button>
        </div>
    </body>
</html>

<script src='epris.bundle.js'></script>

<script>
    const app = new Epris({
        el: '#app',
        state: {
            name: 'Michael',
            hobbies: ['Music', 'Philosophy', 'Programming'],
            status: true,
        },
        actions: {
            printName() {
                console.log(this.name);
            },
        },
        effects: {
            hobbies() {
                console.log(`Amount of hobbies: ${this.hobbies.length}`);
            },
        },
    });

    app.hobbies.push('Video gaming');
    app.printName();
</script>
```

You can see more examples at this [link](https://github.com/nicetomeetor/epris/tree/master/examples).
