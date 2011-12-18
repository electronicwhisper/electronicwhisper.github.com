(function() {
  var arrowDef, circleDef, compoundTest1, compoundTest2, create, definitions, idealize, lineDef, makeRenderTree, maxDepth, mouseToScaleRotate, mouseToTranslate, svgns, viewport;
  svgns = "http://www.w3.org/2000/svg";
  create = {
    svg: function(name, attrs) {
      if (attrs == null) {
        attrs = {};
      }
      return $(document.createElementNS(svgns, name)).attr(attrs);
    },
    circle: function() {
      return create.svg("circle", {
        cx: 0,
        cy: 0,
        r: 1,
        fill: "#000"
      });
    },
    line: function() {
      return create.svg("line", {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0,
        stroke: "#000",
        'stroke-width': .01
      });
    },
    arrow: function() {
      var arrowSize, g, makeLine;
      arrowSize = 0.07;
      makeLine = function(x1, y1, x2, y2) {
        return create.svg("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: '#888',
          'stroke-width': .005
        });
      };
      g = create.svg("g");
      g.append(makeLine(0, 0, 1, 0));
      g.append(makeLine(1, 0, 1 - arrowSize, arrowSize));
      g.append(makeLine(1, 0, 1 - arrowSize, -arrowSize));
      return g;
    }
  };
  maxDepth = 30;
  lineDef = {
    type: "primitive",
    create: create.line
  };
  circleDef = {
    type: "primitive",
    create: create.circle
  };
  arrowDef = {
    type: "primitive",
    create: create.arrow
  };
  compoundTest1 = {
    type: "compound",
    consists: [
      {
        definition: circleDef,
        transform: transform.identity().translate(0, 0)
      }
    ]
  };
  compoundTest2 = {
    type: "compound",
    consists: [
      {
        definition: compoundTest1,
        transform: transform.identity().scale(1)
      }, {
        definition: compoundTest2,
        transform: transform.identity().translate(0.2, 0).scale(0.8)
      }, {
        definition: arrowDef,
        transform: transform.identity()
      }
    ]
  };
  compoundTest2.consists[1].definition = compoundTest2;
  definitions = [lineDef, circleDef, compoundTest1, compoundTest2];
  makeRenderTree = function(definition, transform, opts) {
    var depth, expanded, parent, svg;
    if (opts == null) {
      opts = {};
    }
    svg = null;
    expanded = [];
    parent = opts.parent || $("#svg");
    depth = opts.depth || 0;
    return {
      setTransform: function(t) {
        return transform = t;
      },
      draw: function() {
        var branch, branchTransform, i, nextIteration, _len, _ref, _results;
        if (depth > maxDepth) {
          return;
        }
        if (definition.type === "primitive") {
          if (!svg) {
            svg = definition.create();
            parent.append(svg);
          }
          return svg.attr("transform", transform.toString);
        } else {
          _ref = definition.consists;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            branch = _ref[i];
            branchTransform = transform.compose(branch.transform);
            if (expanded[i]) {
              expanded[i].setTransform(branchTransform);
            } else {
              expanded[i] = makeRenderTree(branch.definition, branchTransform, {
                parent: parent,
                depth: depth + 1
              });
            }
            nextIteration = function() {
              return expanded[i].draw();
            };
            _results.push(nextIteration());
          }
          return _results;
        }
      }
    };
  };
  viewport = transform.identity();
  $(function() {
    var global, height, mouseIsDown, translation, width;
    width = $(window).width();
    height = $(window).height();
    viewport = viewport.translate(width / 2, height / 2).scale(height / 2).scale(0.2);
    global = makeRenderTree(compoundTest2, viewport);
    global.draw();
    mouseIsDown = false;
    translation = transform.identity();
    $("body").mousedown(function(e) {
      mouseIsDown = true;
      translation = mouseToTranslate(e.pageX, e.pageY);
      return false;
    });
    $("body").mouseup(function(e) {
      return mouseIsDown = false;
    });
    $("body").mousemove(function(e) {
      var mouseTrans;
      if (!mouseIsDown) {
        mouseTrans = mouseToTranslate(e.pageX, e.pageY);
        compoundTest2.consists[1].transform = mouseTrans;
      } else {
        mouseTrans = mouseToScaleRotate(translation, e.pageX, e.pageY);
        compoundTest2.consists[1].transform = mouseTrans;
      }
      return global.draw();
    });
    return $("body").mousewheel(function(e, delta, deltaX, deltaY) {
      var myDelta, x, y, _ref;
      _ref = idealize(e.pageX, e.pageY), x = _ref[0], y = _ref[1];
      myDelta = delta > 0 ? 1.1 : 0.9;
      viewport = viewport.translate(x, y).scale(myDelta).translate(-x, -y);
      global.setTransform(viewport);
      return global.draw();
    });
  });
  idealize = function(x, y) {
    var inv;
    inv = viewport.inverse();
    return inv.p(x, y);
  };
  mouseToTranslate = function(x, y) {
    var x1, y1, _ref;
    _ref = idealize(x, y), x1 = _ref[0], y1 = _ref[1];
    return transform.identity().translate(x1, y1);
  };
  mouseToScaleRotate = function(translation, x, y) {
    var a, b, c, d, e, f, x1, x2, y1, y2, _ref;
    x1 = translation.e;
    y1 = translation.f;
    _ref = idealize(x, y), x2 = _ref[0], y2 = _ref[1];
    a = x2 - x1;
    b = y2 - y1;
    c = -b;
    d = a;
    e = x1;
    f = y1;
    return transform.custom(a, b, c, d, e, f);
  };
}).call(this);
