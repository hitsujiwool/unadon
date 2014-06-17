
module.exports = function() {
  var undos = [];
  var redos = [];

  f.onStack = f.onUndo = f.onRedo = function() {};

  function f(redo, undo) {
    redos = [];
    undos.push({ redo: redo, undo: undo });
    f.onStack(redo());
  };

  f.hasUndo = function() {
    return undos.length > 0;
  };

  f.undo = function() {
    var command = undos.pop();
    if (!command) throw new Error('Nothing to undo');
    redos.push(command);
    f.onUndo(command.undo());
  };

  f.hasRedo = function() {
    return redos.length > 0;
  };

  f.redo = function() {
    var command = redos.pop();
    if (!command) throw new Error('Nothing to redo');
    undos.push(command);
    f.onRedo(command.redo());
  };

  f.clear = function() {
    undos = [];
    redos = [];
    return f;
  };

  return f;
};
