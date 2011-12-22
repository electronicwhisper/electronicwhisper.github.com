(function() {
  var arrowDef, associateComponent, circleDef, compoundTest1, compoundTest2, create, definitions, hoverComponent, hoveredComponent, idealize, lineDef, makeComponent, makeCompoundDefinition, makeDefinition, makePrimitiveDefinition, makeRenderTree, maxDepth, mouseDownOriginalTransform, mouseIsDown, selectComponent, selectedComponent, selectedOriginalTransform, squareDef, svgns, translating, unhoverComponent, unselectComponent, viewport;
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
        r: 0.5,
        fill: "#000",
        stroke: "transparent",
        'stroke-width': .01
      });
    },
    square: function() {
      return create.svg("rect", {
        x: -.5,
        y: -.5,
        width: 1,
        height: 1,
        fill: "#000"
      });
    },
    line: function() {
      return create.svg("line", {
        x1: 0,
        y1: 0,
        x2: 0.5,
        y2: 0,
        stroke: "#000",
        'stroke-width': .02
      });
    },
    arrow: function() {
      var arrowPath, arrowSize, g;
      arrowSize = 0.07;
      arrowPath = "M 0 0 L 0.5 0 M " + (0.5 - arrowSize) + " " + arrowSize + " L 0.5 0 L " + (0.5 - arrowSize) + " " + (-arrowSize);
      g = create.svg("g", {
        "class": "arrow"
      });
      g.append(create.svg("rect", {
        opacity: 0,
        fill: "#000",
        x: 0,
        y: -arrowSize,
        width: 1,
        height: arrowSize * 2
      }));
      g.append(create.svg("path", {
        fill: "none",
        stroke: "white",
        "stroke-width": .015,
        d: arrowPath
      }));
      g.append(create.svg("path", {
        "class": "colored",
        fill: "none",
        "stroke-width": .01,
        d: arrowPath
      }));
      g.append(create.svg("circle", {
        "class": "colored handle",
        fill: "green",
        stroke: "green",
        "stroke-width": .01,
        cx: 0.5,
        cy: 0,
        r: arrowSize * .75
      }));
      return g;
    }
  };
  maxDepth = 30;
  makeDefinition = function() {
    return {
      id: _.uniqueId("definition")
    };
  };
  makePrimitiveDefinition = function(create) {
    var definition;
    definition = makeDefinition();
    definition.type = "primitive";
    definition.create = create;
    return definition;
  };
  makeComponent = function(definition, transform) {
    return {
      id: _.uniqueId("component"),
      definition: definition,
      transform: transform
    };
  };
  makeCompoundDefinition = function(components) {
    var definition;
    if (components == null) {
      components = [];
    }
    definition = makeDefinition();
    definition.type = "compound";
    definition.components = components;
    definition.addComponent = function(component) {
      return components.push(component);
    };
    return definition;
  };
  lineDef = makePrimitiveDefinition(create.line);
  circleDef = makePrimitiveDefinition(create.circle);
  squareDef = makePrimitiveDefinition(create.square);
  arrowDef = makePrimitiveDefinition(create.arrow);
  compoundTest1 = makeCompoundDefinition();
  compoundTest1.addComponent(makeComponent(circleDef, transform.identity()));
  compoundTest2 = makeCompoundDefinition();
  compoundTest2.addComponent(makeComponent(circleDef, transform.identity()));
  compoundTest2.addComponent(makeComponent(compoundTest2, transform.identity().translate(1, 0).scale(0.8).rotate(0.1)));
  definitions = [lineDef, circleDef, compoundTest1, compoundTest2];
  mouseIsDown = false;
  hoveredComponent = false;
  selectedComponent = false;
  selectedOriginalTransform = false;
  mouseDownOriginalTransform = false;
  translating = true;
  hoverComponent = function(component) {
    if (!mouseIsDown) {
      hoveredComponent = component;
      return $("." + hoveredComponent.id).addClass("hovered");
    }
  };
  unhoverComponent = function() {
    $("." + hoveredComponent.id).removeClass("hovered");
    return hoveredComponent = false;
  };
  selectComponent = function(component) {
    unselectComponent();
    selectedComponent = component;
    selectedOriginalTransform = component.transform;
    return $("." + selectedComponent.id).addClass("selected");
  };
  unselectComponent = function() {
    $("." + selectedComponent.id).removeClass("selected");
    return selectedComponent = false;
  };
  associateComponent = function(el, component, handleEl) {
    el.mouseover(function(e) {
      return hoverComponent(component);
    });
    el.mouseout(function(e) {
      return unhoverComponent();
    });
    el.mousedown(function(e) {
      return selectComponent(component);
    });
    if (handleEl) {
      return handleEl.mousedown(function(e) {
        translating = false;
        return true;
      });
    }
  };
  makeRenderTree = function(definition, transform, opts) {
    var arrow, componentAncestry, components, definitionAncestry, depth, parent, svg;
    if (opts == null) {
      opts = {};
    }
    svg = null;
    arrow = null;
    components = {};
    parent = opts.parent || $("#svg");
    depth = opts.depth || 0;
    definitionAncestry = opts.definitionAncestry || [];
    componentAncestry = opts.componentAncestry || [];
    definitionAncestry = definitionAncestry.concat(definition);
    return {
      setTransform: function(t) {
        return transform = t;
      },
      draw: function() {
        if (depth > maxDepth) {
          return;
        }
        if (definition.type === "primitive") {
          if (!svg) {
            svg = definition.create();
            definitionAncestry.forEach(function(definition) {
              return svg.addClass(definition.id);
            });
            svg.addClass(componentAncestry[0].id);
            associateComponent(svg, componentAncestry[0]);
            parent.children(".shapes").append(svg);
          }
          svg.attr("transform", transform.toString());
        } else {
          definition.components.forEach(function(component) {
            var branchTransform, nextIteration;
            branchTransform = transform.compose(component.transform);
            if (components[component.id]) {
              components[component.id].setTransform(branchTransform);
            } else {
              components[component.id] = makeRenderTree(component.definition, branchTransform, {
                parent: parent,
                depth: depth + 1,
                definitionAncestry: definitionAncestry,
                componentAncestry: componentAncestry.concat(component)
              });
            }
            nextIteration = function() {
              return components[component.id].draw();
            };
            return nextIteration();
          });
        }
        if (!arrow) {
          arrow = create.arrow();
          parent.children(".arrows").append(arrow);
          if (depth === 0) {
            arrow.addClass("origin");
          } else if (depth === 1) {
            arrow.addClass(componentAncestry[0].id);
            associateComponent(arrow, componentAncestry[0], arrow.find(".handle.colored"));
          } else {
            arrow.addClass(componentAncestry[componentAncestry.length - 1].id);
            arrow.addClass("recursed");
          }
        }
        return arrow.attr("transform", transform.toString());
      }
    };
  };
  viewport = transform.identity();
  $(function() {
    var global, height, width;
    width = $(window).width();
    height = $(window).height();
    viewport = viewport.translate(width / 2, height / 2).scale(height / 2).scale(0.4);
    global = makeRenderTree(compoundTest2, viewport);
    global.draw();
    $("body").mousedown(function(e) {
      if (e.which === 1) {
        mouseIsDown = idealize(e.pageX, e.pageY);
        if (e.target === $("#svg")[0]) {
          unselectComponent();
        }
        return false;
      }
    });
    $(window).mouseup(function(e) {
      translating = true;
      return mouseIsDown = false;
    });
    $(window).mousemove(function(e) {
      var a, b, denom, minverse, ox, oy, scalerotate, translation, x1, x2, y1, y2, _ref, _ref2, _ref3, _ref4;
      if (mouseIsDown) {
        if (selectedComponent) {
          if (translating) {
            x1 = mouseIsDown[0], y1 = mouseIsDown[1];
            _ref = idealize(e.pageX, e.pageY), x2 = _ref[0], y2 = _ref[1];
            translation = transform.identity().translate(x2 - x1, y2 - y1);
            selectedComponent.transform = translation.compose(selectedOriginalTransform);
            return global.draw();
          } else {
            x1 = mouseIsDown[0], y1 = mouseIsDown[1];
            _ref2 = idealize(e.pageX, e.pageY), x2 = _ref2[0], y2 = _ref2[1];
            minverse = selectedOriginalTransform.inverse();
            _ref3 = minverse.p(x1, y1), x1 = _ref3[0], y1 = _ref3[1];
            _ref4 = minverse.p(x2, y2), x2 = _ref4[0], y2 = _ref4[1];
            denom = x1 * x1 + y1 * y1;
            a = (x1 * x2 + y1 * y2) / denom;
            b = (x1 * y2 - x2 * y1) / denom;
            scalerotate = transform.custom(a, b, -b, a, 0, 0);
            selectedComponent.transform = selectedOriginalTransform.compose(scalerotate);
            return global.draw();
          }
        } else {
          ox = mouseIsDown[0], oy = mouseIsDown[1];
          viewport = transform.custom(viewport.a, viewport.b, viewport.c, viewport.d, e.pageX - viewport.a * ox - viewport.c * oy, e.pageY - viewport.b * ox - viewport.d * oy);
          global.setTransform(viewport);
          return global.draw();
        }
      }
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
}).call(this);
