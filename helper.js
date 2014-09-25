Array.prototype.run = function() {
    if (this.length == 0)
        return;

    var newarg = this.slice(1);

    var rv = this[0]();
    if (rv && rv.done)
        rv.done(function() {newarg.run()});
  else
      newarg.run();
}
