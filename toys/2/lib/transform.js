(function() {
  var makeTransform, transform;
  var __slice = Array.prototype.slice;
  makeTransform = function(a, b, c, d, e, f) {
    var mt;
    return mt = {
      x: function(px, py) {
        return a * px + c * py + e;
      },
      y: function(px, py) {
        return b * px + d * py + f;
      },
      p: function(px, py) {
        return [mt.x(px, py), mt.y(px, py)];
      },
      inverse: function() {
        var x;
        x = a * d - b * c;
        return makeTransform(d / x, -b / x, -c / x, a / x, (c * f - d * e) / x, (b * e - a * f) / x);
      },
      compose: function(m) {
        return makeTransform(a * m.a + c * m.b, b * m.a + d * m.b, a * m.c + c * m.d, b * m.c + d * m.d, a * m.e + c * m.f + e, b * m.e + d * m.f + f);
      },
      translate: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return mt.compose(transform.translate.apply(transform, args));
      },
      scale: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return mt.compose(transform.scale.apply(transform, args));
      },
      rotate: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return mt.compose(transform.rotate.apply(transform, args));
      },
      toString: function() {
        return "matrix(" + a + " " + b + " " + c + " " + d + " " + e + " " + f + ")";
      },
      a: a,
      b: b,
      c: c,
      d: d,
      e: e,
      f: f
    };
  };
  transform = {
    identity: function() {
      return makeTransform(1, 0, 0, 1, 0, 0);
    },
    custom: function(a, b, c, d, e, f) {
      return makeTransform(a, b, c, d, e, f);
    },
    translate: function(dx, dy) {
      return makeTransform(1, 0, 0, 1, dx, dy);
    },
    scale: function(sx, sy) {
      if (sy === void 0) {
        sy = sx;
      }
      return makeTransform(sx, 0, 0, sy, 0, 0);
    },
    rotate: function(a) {
      return makeTransform(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0);
    }
  };
  window.transform = transform;
}).call(this);
