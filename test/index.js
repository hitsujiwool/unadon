
var assert = require('assert');
var unadon = require('..');

describe('unadon', function() {
  var i;
  var stack;

  function inc() {
    stack(function() {
      return ++i;
    }, function() {
      return --i;
    });
  }

  beforeEach(function() {
    stack = unadon();
    i = 0;
  });

  describe('undo/redo', function() {    
    it('i = 2, after 2 times incrementation', function() {
      inc();
      inc();
      assert.equal(i, 2);
    });

    it('i = 1, after 2 times incrementaion and 1 time undo', function() {
      inc();
      inc();
      stack.undo();
      assert.equal(i, 1);
    });

    it('i = 2, after 2 times incrementaion, 1 time undo and 1 time redo', function() {
      inc();
      inc();
      stack.undo();
      stack.redo();
      assert.equal(i, 2);
    });

    it('new command after undo should clear redo stack', function() {
      inc();
      inc();
      stack.undo();
      stack.undo();
      inc();
      assert.throws(function() { stack.redo(); });
    });

    it('stack.onStack() should receive redo return value', function() {
      stack.onStack = function(val) {
        assert.equal(val, 1);
      };
      inc();
    });

    it('stack.onUndo() should receive undo return value', function() {
      stack.onUndo = function(val) {
        assert.equal(val, 0);
      };
      inc();
      stack.undo();
    });

    it('stack.onRedo() should receive redo return value', function() {
      stack.onRedo = function(val) {
        assert.equal(val, 1);
      };
      inc();
      stack.undo();
      stack.redo();
    });
  });
  
  describe('.undo()', function() {
    it('should throw error if there is nothing to undo', function() {
      assert.throws(function() { stack.undo(); });
    });     
  });
  
  describe('.redo()', function() {
    it('should throw error if there is nothing to redo', function() {
      assert.throws(function() { stack.redo(); });
    });     
  });

  describe('.clear()', function() {
    it('should clear all the undo/redo stack', function() {
      inc();
      inc();
      stack.undo();
      stack.redo();
      stack.clear();
      assert.equal(stack.hasUndo(), false);
      assert.equal(stack.hasRedo(), false);
    });
  });
  
  describe('.hasUndo()', function() {
    it('should return true if something to undo remains', function() {
      inc();
      assert(stack.hasUndo());
    });

    it('should return false if nothing to undo remains', function() {
      assert.equal(stack.hasUndo(), false);
    });
  });

  describe('.hasRedo()', function() {
    it('should return true if something to undo remains', function() {
      inc();
      stack.undo();
      assert(stack.hasRedo());
    });

    it('should return false if nothing to undo remains', function() {      
      assert.equal(stack.hasUndo(), false);
    });
  });
});
