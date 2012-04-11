# Programming: Construction or Transformation?

Much of the design process in programming is concerned with how information is represented, the model. The programmer carefully chooses the data structures with which the program is built. The programming language designer carefully chooses the primitive constructs with which programmers will build their programs. Both of these workflows reflect a reductive mindset. Elements are defined by the smaller elements they are made up of. This forms an "abstraction pyramid", with primitives on the bottom and the finished piece of software on top.

The abstraction pyramid has served us well in the past. Reductionism allows us to reason at various levels of the pyramid. It can enable us to build quite complex software (tall pyramids) because we are able to build on previously laid foundations. But a reductive mindset can also reduce our flexibility and produce cognitive dissonance when a piece of software is approached from a different perspective.

For example, users approach software differently than the creators of the software. Discrepancies inevitably arise between the model underlying the program and the model that forms in the user's mind. Many recognize these discrepancies as the root cause of usability issues. [Design of Everyday Things] Often it is argued that the model needs to be simplified--made more elegant and powerful--so that the user can more fully grasp it. This is often true but it misses a subtle issue. A creator of software is concerned with its reductive nature--the pyramid of pieces it's made out of. But the user of software is concerned with what she can *do* with the software. That is, the user is only concerned with the aspects of the software which are *operationally relevant* in the context of a larger system. [The Inmates are Running the Asylum]

The same applies to new programmers approaching existing code. When we choose our representation for the program, we limit the ways in which we can easily modify the program. By "easily modify" I mean transforming the program without choosing new primitives--what programmers appropriately call "refactoring". This is why experienced developers think long and hard about the primitives they will use before they touch the keyboard.

Is there a way make refactoring cheaper? Is there an approach to program design that will not conceptually lock us in to the primitives we initially chose, so that we can better consider the various contexts in which our software might be used?

This is of course a deep challenge, but I believe we can better attack it with a shift in mindset.

I suggest we shift our focus from program construction to program transformation. Instead of concentrating on the primitives and what we can build from them, we concentrate on the transformations we might want to apply to our program in various contexts. In other words, I'm suggesting we think of programs *operationally* rather than *reductively*. We define a program by its relationship to other (potential) programs, not by the atoms which constitute it.

This is analogous to the shift in mind set from set theory to category theory. In set theory, we define a property of a set in terms of its elements. In category theory, we define a property of a set in terms of its relationships to other sets.

I'll provide two examples from Recursive Drawing. In each case, I will show how my initial design reflected a reductionist mindset, then how I rethought the issue from a transformational mindset.

## Fixed Coordinate Systems

The first example relates to how we traditionally use coordinate systems. In Context Free Art, the underlying representation consists of a hierarchy of coordinate systems. The nest-able coordinate system is a key primitive on which Context Free Art programs are built.

Now, recursively nested spatial transformations are intrinsic to the concept of Context Free Art, but their representation as coordinate systems is an implementation detail which is forced on the user. Indeed early versions of Recursive Drawing did the same thing. Every coordinate system was explicitly shown in the user interface.

[pic from 2]

When we force an underlying representation on the user, *transformations can only be performed with respect to that underlying representation*. Indeed this is the only way to tweak a Context Free Art program. The user must tweak a value which makes a change with respect to the coordinate system that the value lives in.

But as Recursive Drawing's interface evolved, I found that it was more intuitive to tweak a shape by transforming it *with respect to the other shapes*. That is, it didn't matter where a shape was or how it was oriented with respect to the underlying coordinate system, it only mattered how it related to the other shapes. Thus Recursive Drawing's canvas--the model it presents to the user--has no center, orientation, or scale. Shapes are positioned, oriented, and sized with respect to each other.

## Ontology

The second example relates to ontology: how we divide a program into separate objects, or equivalently, how we define identity. A reductive mindset implies a fixed ontology. But in life, we can shift between contexts. Each context provides a different way to divide the world. Analogously, we would like our ontology to change depending on the context in which we're working with a program.

A heuristic we can use to produce an ontology in a given context is based on the transformations that the context supports. Given two things, A and B, if in our context every transformation we apply to A also uniformly applies the same transformation to B and vice versa, then A and B can be considered identical in that context.

To illustrate, say we have a rigid body like a coffee cup. It is unclear that this should be a single object if we're looking at it in the context of atoms or quantum clouds. However, in the context of everyday interactions, we can identify the coffee cup as a single entity. We determine this based on the transformations available in our everyday interaction context. If I transform the handle of the cup two feet upwards, then the rest of the cup is also transformed two feet upwards. Its rigidity by definition implies that a transformation on any given point of the object must apply uniformly to every point on the object. In this way, an operational context--a set of allowable transformations--implies an ontology.

This principle was violated in early versions of Recursive Drawing. In an initial design, a primitive shape (circle or square) was always individually highlighted when the user hovered her mouse over it. This made users think they could only manipulate primitive shapes individually, not understanding that they could define compound shapes out of the primitive shapes. An improvement was when highlighting was applied to *any* shape which would transform uniformly if the user started dragging the hovered shape. This more closely mapped a user's intuition about what constituted a singular object.
