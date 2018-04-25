# exmg-react-move

Animate updates (enter / leave / move) with flip technique.

> exmg-react-move does not support stateless components.  
> All children must have a unique key prop.

## TODO

* Custom transitions for enter/move/leave 
* [DEMO](http://exmg.github.io/exmg-react-move/demo/).

## Install

```bash
yarn add exmg-react-move
```

## Usage

### Example

```js
import React, { Component } from 'react';
import Move from 'exmg-react-move';

class MoveExample extends Component {
    state = {
        list: ['a', 'b', 'c'],
    };

    render() {
        return (
            <Move>
                { this.state.list.map(id =>
					<div key={ id }>{ id }</div>) }
            </Move>
        )
    }
}
```

### Example with custom transition

```js
import React, { Component } from 'react';
import Move from 'exmg-react-move';

class MoveExample extends Component {
    state = {
        list: ['a', 'b', 'c'],
    };

    render() {
        return (
            <Move duration={ 500 } timingFunction="cubic-bezier(0.1, 0.7, 1.0, 0.1)">
                { this.state.list.map(id =>
					<div key={ id }>{ id }</div>) }
            </Move>
        )
    }
}
```

## Props

* `children: ?JSX.Element[]` default `null`
* `duration: ?number` default `220`
    * Duration in milliseconds
* `timingFunction: ?string` default `cubic-bezier(0.4, 0.0, 0.2, 1)`
    * https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function