svgns = "http://www.w3.org/2000/svg"


create = {
  svg: (name, attrs={}) ->
    $(document.createElementNS(svgns, name)).attr(attrs)
  circle: () ->
    create.svg("circle", {cx: 0, cy: 0, r: 0.5, fill: "#000", stroke: "transparent", 'stroke-width': .01})
  square: () ->
    create.svg("rect", {x: -.5, y: -.5, width: 1, height: 1, fill: "#000"})
  line: () ->
    create.svg("line", {x1: 0, y1: 0, x2: 0.5, y2: 0, stroke: "#000", 'stroke-width': .02})
  arrow: () ->
    arrowSize = 0.07
    arrowPath = "M 0 0 L 0.5 0 M #{0.5-arrowSize} #{arrowSize} L 0.5 0 L #{0.5-arrowSize} #{-arrowSize}"
    g = create.svg("g", {class: "arrow"})
    # g.append create.svg("path", {opacity: 0, "pointer-events": "fill", d: "M 0 #{arrowSize} L 0.5 #{arrowSize}"})
    g.append create.svg("rect", {opacity: 0, fill: "#000", x: 0, y: -arrowSize, width: 1, height: arrowSize*2})
    g.append create.svg("path", {fill: "none", stroke: "white", "stroke-width": .015, d: arrowPath})
    # g.append create.svg("circle", {class: "handle", fill: "none", stroke: "white", "stroke-width": .015, cx: 0.5, cy: 0, r: arrowSize*.75})
    g.append create.svg("path", {class: "colored", fill: "none", "stroke-width": .01, d: arrowPath})
    g.append create.svg("circle", {class: "colored handle", fill: "green", stroke: "green", "stroke-width": .01, cx: 0.5, cy: 0, r: arrowSize*.75})
    g
}



maxDepth = 30



# state of the system

# definitions
#   either a built in (e.g. line, circle) or
#   a list of definition, transform

makeDefinition = () ->
  {id: _.uniqueId("definition")}

makePrimitiveDefinition = (create) ->
  definition = makeDefinition()
  definition.type = "primitive"
  definition.create = create
  definition

makeComponent = (definition, transform) ->
  {
    id: _.uniqueId("component")
    definition: definition
    transform: transform
  }

makeCompoundDefinition = (components=[]) ->
  definition = makeDefinition()
  definition.type = "compound"
  definition.components = components
  definition.addComponent = (component) ->
    components.push(component)
  definition


lineDef = makePrimitiveDefinition(create.line)
circleDef = makePrimitiveDefinition(create.circle)
squareDef = makePrimitiveDefinition(create.square)
arrowDef = makePrimitiveDefinition(create.arrow)

compoundTest1 = makeCompoundDefinition()
compoundTest1.addComponent(makeComponent(circleDef, transform.identity()))

compoundTest2 = makeCompoundDefinition()
compoundTest2.addComponent(makeComponent(circleDef, transform.identity()))
compoundTest2.addComponent(makeComponent(compoundTest2, transform.identity().translate(1,0).scale(0.8).rotate(0.1)))

definitions = [
  lineDef,
  circleDef,
  compoundTest1,
  compoundTest2
]

# ui state

mouseIsDown = false

hoveredComponent = false
selectedComponent = false

selectedOriginalTransform = false
mouseDownOriginalTransform = false

translating = true

# note: there's gotta be a better way to do the prioritizing, etc.
# this is so imperative!
hoverComponent = (component) ->
  if !mouseIsDown
    hoveredComponent = component
    $(".#{hoveredComponent.id}").addClass("hovered")
unhoverComponent = () ->
  $(".#{hoveredComponent.id}").removeClass("hovered")
  hoveredComponent = false
selectComponent = (component) ->
  unselectComponent()
  selectedComponent = component
  selectedOriginalTransform = component.transform
  $(".#{selectedComponent.id}").addClass("selected")
unselectComponent = () ->
  $(".#{selectedComponent.id}").removeClass("selected")
  selectedComponent = false

associateComponent = (el, component, handleEl) ->
  el.mouseover (e) -> hoverComponent(component)
  el.mouseout (e) -> unhoverComponent()
  el.mousedown (e) -> selectComponent(component)
  
  if (handleEl)
    handleEl.mousedown (e) ->
      translating = false
      return true


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
  arrow = null
  
  components = {} # render trees of the components, organized by component.id
  
  parent = opts.parent || $("#svg")
  depth = opts.depth || 0
  definitionAncestry = opts.definitionAncestry || []
  componentAncestry = opts.componentAncestry || []
  
  definitionAncestry = definitionAncestry.concat(definition)
  
  {
    setTransform: (t) -> transform = t
    draw: () ->
      if depth > maxDepth then return
      
      if definition.type == "primitive"
        if !svg
          svg = definition.create()
          
          # annotate its ancestry
          definitionAncestry.forEach (definition) -> svg.addClass(definition.id)
          # componentAncestry.forEach (component) -> svg.addClass(component.id)
          svg.addClass(componentAncestry[0].id)
          
          # add event handlers
          associateComponent(svg, componentAncestry[0])
          
          parent.children(".shapes").append(svg)
        svg.attr("transform", transform.toString())
      else
        # expand the definition
        definition.components.forEach (component) ->
          branchTransform = transform.compose(component.transform)
          if components[component.id]
            components[component.id].setTransform(branchTransform)
          else
            components[component.id] = makeRenderTree(component.definition, branchTransform, {
              parent: parent,
              depth: depth+1,
              definitionAncestry: definitionAncestry,
              componentAncestry: componentAncestry.concat(component)
            })
          nextIteration = () ->
            components[component.id].draw()
          # window.setTimeout(nextIteration, 0)
          nextIteration()
      
      
      # draw arrow
      if !arrow
        arrow = create.arrow()
        parent.children(".arrows").append(arrow)
        if depth == 0
          arrow.addClass("origin")
        else if depth == 1
          arrow.addClass(componentAncestry[0].id)
          associateComponent(arrow, componentAncestry[0], arrow.find(".handle.colored"))
        else
          arrow.addClass(componentAncestry[componentAncestry.length-1].id)
          arrow.addClass("recursed")
      arrow.attr("transform", transform.toString())
  }




viewport = transform.identity()

$ () ->
  width = $(window).width()
  height = $(window).height()
  
  viewport = viewport.translate(width/2, height/2).scale(height/2).scale(0.4)
  
  
  global = makeRenderTree(compoundTest2, viewport)
  
  global.draw()
  
  
  $("body").mousedown (e) ->
    if e.which == 1 # left mouse button
      mouseIsDown = idealize(e.pageX, e.pageY)
      
      # if you click on the canvas, deselect the selected component
      if e.target == $("#svg")[0]
        unselectComponent()
      
      return false # prevent auto-dragging shenanigans in Firefox
  $(window).mouseup (e) ->
    translating = true
    mouseIsDown = false
  
  $(window).mousemove (e) ->
    if mouseIsDown
      if selectedComponent
        if translating
          [x1, y1] = mouseIsDown
          [x2, y2] = idealize(e.pageX, e.pageY)
          translation = transform.identity().translate(x2-x1, y2-y1)
          selectedComponent.transform = translation.compose(selectedOriginalTransform)
          global.draw()
        else
          [x1, y1] = mouseIsDown
          [x2, y2] = idealize(e.pageX, e.pageY)
          minverse = selectedOriginalTransform.inverse()
          [x1, y1] = minverse.p(x1, y1)
          [x2, y2] = minverse.p(x2, y2)
          
          denom = x1*x1 + y1*y1
          a = (x1*x2 + y1*y2)/denom
          b = (x1*y2 - x2*y1)/denom
          
          scalerotate = transform.custom(a, b, -b, a, 0, 0)
          # selectedComponent.transform = scalerotate.compose(selectedOriginalTransform)
          selectedComponent.transform = selectedOriginalTransform.compose(scalerotate)
          global.draw()
      else
        # pan
        [ox, oy] = mouseIsDown
        # move the viewport so that the original coordinates locate to the current mouse position
        # i.e. viewport.p(ox, oy) == [e.pageX, e.pageY]
        viewport = transform.custom(viewport.a, viewport.b, viewport.c, viewport.d, e.pageX - viewport.a*ox - viewport.c*oy, e.pageY - viewport.b*ox - viewport.d*oy)
        global.setTransform(viewport)
        global.draw()
      
  
  
  $("body").mousewheel (e, delta, deltaX, deltaY) ->
    [x, y] = idealize(e.pageX, e.pageY)
    myDelta = if delta > 0 then 1.1 else 0.9
    # viewport = viewport.scale(myDelta)
    viewport = viewport.translate(x, y).scale(myDelta).translate(-x, -y)
    global.setTransform(viewport)
    global.draw()
  




# converting mouse coordinates to transforms (given the viewport)
idealize = (x, y) ->
  inv = viewport.inverse()
  inv.p(x, y)
