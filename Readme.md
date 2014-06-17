# unadon

simple stack for undo/redo

## Installaion

```
$ npm install unadon
```

## Usage

```javascript
var stack = require('unadon')();

stack.onStack = function(val) {
  console.log('stacked function which returns ' + val);
};

stack.onUndo = function(val) {
  console.log('undid function which returns ' + val);
};

stack.onRedo = function(val) {
  console.log('redid function which returns ' + val);
};

var i = 0;

// stack and execute
stack(function() {
  // redo function
  return ++i;
}, function() {
  // undo function
  return --i;
})

// undo
stack.undo();

// redo
stack.redo();
```

Here is a little bit more practical example, fetching the new value from remote, keeping it into closure for undo/redo.

```javascript
function update(data) {
  var old = data.sheep;
  fetchSomethingFromRemote(function(newVal) {
    stack(function() {
      // set new value
      data.sheep = newVal;
    }, function() {
      // restore old value
      data.sheep = old;
    });
  });
}

update({ sheep: 'baaa' });
```

## Methods

### stack(redo, undo)

Register a pair of functions consists of function you would like to execute (which is the same as redo function) and it's opposite undo function.

### stack.undo()

Put out and call the function at the top of the undo stack, then move it to the redo stack.

### stack.redo()

Put out and call the function at the top of the redo stack, then move it to the undo stack.

### stack.clear()

Clear all the stacked undo/redo functions. This function will be often called when something is _saved_.

### stack.onStack

function called when a function is stacked (default: noop)

### stack.onUndo

function called when undo function is called (default: noop)

### stack.onRedo

function called when redo function is called (default: noop)

## License

MIT
