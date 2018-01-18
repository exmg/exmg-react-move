# exmg-react-move

Animate updates (enter / leave / move) with flip technique.

> exmg-react-move does not support stateless components.  
> All children must have a unique key prop.

## TODO

* Custom transitions for enter/move/leave 

## Demo

> TODO Check out the [demo](http://exmg.github.io/exmg-react-move/demo/).

## Install

```bash
npm install exmg-react-move
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
