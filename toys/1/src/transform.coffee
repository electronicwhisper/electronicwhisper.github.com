makeTransform = (a,b,c,d,e,f) ->
  mt = {
    x: (px, py) ->
      a*px + c*py + e
    y: (px, py) ->
      b*px + d*py + f
    p: (px, py) ->
      [mt.x(px, py), mt.y(px, py)]
    
    inverse: () ->
      # via https://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.core.js#L1998
      x = a*d - b*c
      makeTransform(  d/x          ,  -b/x          ,
                     -c/x          ,   a/x          ,
                     (c*f - d*e)/x ,  (b*e - a*f)/x )
    
    compose: (m) ->
      makeTransform( a*m.a + c*m.b     ,  b*m.a + d*m.b     ,
                     a*m.c + c*m.d     ,  b*m.c + d*m.d     ,
                     a*m.e + c*m.f + e ,  b*m.e + d*m.f + f )
    
    translate: (args...) -> mt.compose(transform.translate(args...))
    scale: (args...) -> mt.compose(transform.scale(args...))
    rotate: (args...) -> mt.compose(transform.rotate(args...))
    
    toString: () ->
      "matrix(#{a} #{b} #{c} #{d} #{e} #{f})"
    
    a:a, b:b, c:c, d:d, e:e, f:f
  }


transform = {
  identity: () -> makeTransform(1,0,0,1,0,0)
  custom: (a,b,c,d,e,f) -> makeTransform(a,b,c,d,e,f)
  translate: (dx, dy) ->
    makeTransform(1,0,0,1,dx,dy)
  scale: (sx, sy) ->
    if (sy == undefined) then sy = sx
    makeTransform(sx,0,0,sy,0,0)
  rotate: (a) ->
    makeTransform(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0)
}

window.transform = transform


# testTranslate = transform.translate(100, 0)
# testRotate = transform.rotate(1)
# 
# c1 = testTranslate.compose(testRotate)
# # c2 = testRotate.compose(testTranslate)
# c2 = testRotate.translate(100, 0)
# c3 = testTranslate.compose(testTranslate)
# 
# console.log(testTranslate.toString())
# console.log(testRotate.toString())
# 
# console.log(testTranslate.p(20, 20))
# console.log(testRotate.p(20, 20))
# 
# console.log(c1.toString())
# console.log(c2.toString())
# console.log(c3.toString())
# 
# console.log(c1.p(20, 20))
# console.log(c2.p(20, 20))
# console.log(c3.p(20, 20))