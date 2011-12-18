svgns = "http://www.w3.org/2000/svg"


create = {
  svg: (name, attrs={}) ->
    $(document.createElementNS(svgns, name)).attr(attrs)
  circle: () ->
    create.svg("circle", {cx: 0, cy: 0, r: 1, fill: "#000"})
  line: () ->
    create.svg("line", {x1: 0, y1: 0, x2: 1, y2: 0, stroke: "#000", 'stroke-width': .01})
  arrow: () ->
    arrowSize = 0.07
    makeLine = (x1, y1, x2, y2) -> create.svg("line", {x1:x1, y1:y1, x2: x2, y2:y2, stroke: '#888', 'stroke-width': .005})
    
    g = create.svg("g")
    g.append(makeLine(0, 0, 1, 0))
    g.append(makeLine(1, 0, 1-arrowSize, arrowSize))
    g.append(makeLine(1, 0, 1-arrowSize, -arrowSize))
    g
}



maxDepth = 30



# state of the system

# definitions
#   either a built in (e.g. line, circle) or
#   a list of definition, transform

lineDef = {type: "primitive", create: create.line}
circleDef = {type: "primitive", create: create.circle}
arrowDef = {type: "primitive", create: create.arrow}

compoundTest1 = {type: "compound", consists: [
  {definition: circleDef, transform: transform.identity().translate(0, 0)},
  # {definition: lineDef, transform: transform.identity().translate(0, 0)}
]}

compoundTest2 = {type: "compound", consists: [
  {definition: compoundTest1, transform: transform.identity().scale(1)},
  {definition: compoundTest2, transform: transform.identity().translate(0.2,0).scale(0.8)},
  {definition: arrowDef, transform: transform.identity()}
]}
compoundTest2.consists[1].definition = compoundTest2

definitions = [
  lineDef,
  circleDef,
  compoundTest1,
  compoundTest2
]

# render tree
#   starting from a root definition
#   draw a (built in) definition by using draw, transform using the chain of transforms and then finally viewport
#   expand a (compound) definition by listing its components and their transforms
#   things to keep track of:
#     parent (where am I putting new svg elements)
#     svg (the element the node refers to)
#     depth (to stop infinite recursion)


makeRenderTree = (definition, transform, opts={}) ->
  svg = null
  expanded = []
  
  parent = opts.parent || $("#svg")
  depth = opts.depth || 0
  
  {
    setTransform: (t) -> transform = t
    draw: () ->
      if depth > maxDepth then return
      if definition.type == "primitive"
        if !svg
          svg = definition.create()
          parent.append(svg)
        svg.attr("transform", transform.toString)
      else
        # expand the definition
        for branch, i in definition.consists
          branchTransform = transform.compose(branch.transform)
          if expanded[i] # TODO: and check it's the right definition in case of adding/deleting elements
            expanded[i].setTransform(branchTransform)
          else
            expanded[i] = makeRenderTree(branch.definition, branchTransform, {parent: parent, depth: depth+1})
          nextIteration = () ->
            expanded[i].draw()
          # TODO: why doesn't this work?
          # setTimeout(0, nextIteration)
          nextIteration()
  }




viewport = transform.identity()

$ () ->
  width = $(window).width()
  height = $(window).height()
  
  viewport = viewport.translate(width/2, height/2).scale(height/2).scale(0.2)
  
  # drawRenderTree(renderTree, viewport, 0)
  
  # console.log renderTree
  
  global = makeRenderTree(compoundTest2, viewport)
  global.draw()
  
  mouseIsDown = false
  translation = transform.identity()
  $("body").mousedown (e) ->
    mouseIsDown = true
    translation = mouseToTranslate(e.pageX, e.pageY)
    return false # prevent auto-dragging shenanigans in Firefox
  $("body").mouseup (e) ->
    mouseIsDown = false
  
  $("body").mousemove (e) ->
    if !mouseIsDown
      mouseTrans = mouseToTranslate(e.pageX, e.pageY)
      compoundTest2.consists[1].transform = mouseTrans
    else
      mouseTrans = mouseToScaleRotate(translation, e.pageX, e.pageY)
      compoundTest2.consists[1].transform = mouseTrans
    global.draw()
  
  $("body").mousewheel (e, delta, deltaX, deltaY) ->
    [x, y] = idealize(e.pageX, e.pageY)
    myDelta = if delta > 0 then 1.1 else 0.9
    # viewport = viewport.scale(myDelta)
    viewport = viewport.translate(x, y).scale(myDelta).translate(-x, -y)
    global.setTransform(viewport)
    global.draw()
    # console.log(delta, deltaX, deltaY)
  
  # $("body").click (e) ->
  #   compoundTest2.consists[1].transform = transform.identity().translate(0.2,Math.random()*0.3).scale(0.8)
  #   global.draw()
  




# converting mouse coordinates to transforms (given the viewport)
idealize = (x, y) ->
  inv = viewport.inverse()
  inv.p(x, y)
mouseToTranslate = (x, y) ->
  [x1, y1] = idealize(x, y)
  transform.identity().translate(x1, y1)
mouseToScaleRotate = (translation, x, y) ->
  x1 = translation.e
  y1 = translation.f
  [x2, y2] = idealize(x, y)
  
  a = x2 - x1
  b = y2 - y1
  c = -b
  d = a
  e = x1
  f = y1
  transform.custom(a,b,c,d,e,f)