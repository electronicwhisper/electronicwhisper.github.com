# Introduction

* Somehow set the tone and context
* My motivation and background, ITP
* Lay out structure of the paper

I intend to take a very broad definition for the words "programming" and "interface" in this paper. To illustrate scope, in the following sections I define what I mean by "alternative programming interfaces" and "alternative programmers".

# What are Alternative Programming Interfaces?

I will divide programming interfaces into three aspects: physical, conceptual, and social.

## Physical Interfaces

Physical interfaces are the interfaces which concern the human body and the computer's "body", its hardware inputs and outputs, and the affordances allowed by each of these bodies.

Traditionally the human communicates to the computer through typing on the keyboard, and computer communicates back through whichever outputs the program addresses: the screen, speakers, or other peripherals. Often, even if a program is intended to create audio or graphical output, through much of the programming process the computer communicates to the programmer through text (through the console).

Communicating text back and forth through these interfaces has proven to be effective because this medium can be made largely unambiguous (through formal languages), it emulates how we communicate intellectually with other humans (talking, writing), and we have evolved conventions (syntax and semantics) for densely packing abstract information in this form.

Alternative physical interface possibilities for programming include:

1. Visual interfaces. These exploit the full graphical features of the screen rather than just text, and often encourage human input through a (singular) pointing device such as a mouse, trackpad, or stylus, in addition to or replacing keyboard input.
2. Touch screen interfaces. Building on visual interfaces, but with the human touching the screen directly. Two potential advantages over mouse-based interfaces are a more direct feeling of manipulation of the screen's output, and the expressive possibilities of multiple points of contact (multitouch).
3. Arbitrary inputs. These include the human communicating to the computer using gestures in space (with the computer "seeing" the gestures using a 2D or 3D camera), sounds, or manipulating peripherals such as accelerometers.

None of these alternative interfaces have produced widely adopted general purpose programming environments. However, they have had significant success in limited domains. Patching environments such as PD, Max/MSP, vvvv, Quartz Composer, and Isadora use visual interfaces with dataflow semantics to program interactive audio and visual works. Rebecca Fiebrink's Wekinator uses arbitrary inputs (such as cameras and accelerometers) and arbitrary outputs (usually sound) to program novel musical instruments using a supervised learning workflow both on the part of the computer (recognizing human gestures) and the human (learning to "play" the instrument). [http://wekinator.cs.princeton.edu/]

I see three reasons to continue pursuing these alternative physical interfaces, in growing order of importance:

1. We have the technology. The programming interfaces today are largely a result of the technological evolution of the computer going all the way back to mainframes. This historical bias suggests that alternative physical interfaces may have dormant potentials.
2. Alternative physical interfaces allow new workflows for programming. Communicating text back and forth is a largely turn-based experience. Each of the alternative interface examples I gave allow a more rapid feedback experience. For example, each of the patch-based visual environments allow the user to adjust parameters, usually with sliders, and see the results in realtime. This "live coding" workflow is possible with text--syntax highlighting is a form of realtime feedback--but the medium does not naturally support it. This is why textual interfaces supporting live coding are often augmented with visual inputs like sliders, as in Bret Victor's "Inventing on Principle" and OpenEnded Group's Field.
3. Alternative physical interfaces engage different parts of the human brain. Textual interfaces engage the "language center" of our brain. We have difficulty expressing concepts to the computer which we cannot translate through this part of our brain. Yet many of our most profound ideas we think of *visually* or *kinesthetically*. Alan Kay relates an anecdote about the mathematician Jacques Hadamard, who polled the great mathematicians and scientists of his day about how they "do their thing." Most replied that they did not use mathematical symbols (the language center of mathematics) but rather imagined figures or even feelings. Einstein replied, "I have sensations of a kinesthetic or muscular type." [Doing with Images Makes Symbols]

## Conceptual Interfaces

Conceptual interfaces concern the the metaphors we use to think about our programs. Examples include objects, actors, structures, and streams. Conceptual interfaces are largely equivalent with the semantics of a programming language. They are the key mental structures that must exist equivalently in the mind of the programmer and the mind of the computer (in its implementation) in order for programmer and computer to collaborate effectively.

There is no shortage of alternative conceptual interfaces, especially at Onward!, so I will cut this section short.

XXX maybe more here

## Social Interfaces

Social interfaces concern programming's relationship to society and how program creation interacts with social systems. It addresses the questions: What is programming and how does it relate to the rest of the world? How should we program together? Who should program?

A traditional, now humorously out-dated view, is that programming is calculating. Computer operators feed problems into a (huge) computer which spits out an answer. We have made inroads towards a new perspective, where programming is a creative, collaborative process between human and machine. This is largely due to pioneering work such as Ivan Sutherland's Sketchpad and Douglas Engelbart's NLS. Yet the traditional view still maintains hold on the collective (un)consciousness. Many people are intimidated by computers, or intimidated by programming. They see the computer as an *other*, whom they cannot engage with.

The next question concerns how we engage with our human collaborators. People have always worked on programming together in teams, but the internet and platforms like Github have made the world of code more like an ecosystem than ever before. The semantics of a language often reflect and reinforce the organizational structures that collaborate using the language. Social interactions are subtle, and I want to avoid making sweeping generalizations, but for the purposes of illustration I will provide a stereotyped example: Java's semantics suggest an insulated hierarchical organization of programmers where one programmer cannot "step on the toes" of another. Contrast this with Ruby, whose semantics encourage substantial monkeying with the language internals. This encourages either more cross-communicative teams, necessarily smaller, or alternatively the top-down institution of conventions like Rails. I see substantial opportunities to research the sociological implications of programming interfaces, but this paper will henceforth leave these implications unaddressed.

Finally, the question of who should program I will address in the next section.

# Who are Alternative Programmers?

Many profound advances in programming occurred when people reconsidered the question, *who are the programmers*? Engelbart's NLS expanded the view of programmers from business analysts and artificial intelligence researchers to any information worker. Smalltalk originally focused on children as programmers. Hypercard was developed and distributed at Bill Atkinson's insistence that "end users" need programming capabilities. [http://www.savetz.com/ku/ku/quick_genius_behind_hypercard_bill_atkinson_the_november_1987.html] Even web programming, at least initially, promoted a culture where anybody could contribute their content or software to the web. [There seems to be a pattern where an environment is developed for alternative programmers, then as a consequence of success is overtaken by "real" programmers. Adobe Flash, originally designed for animators who wanted to work with interaction, also follows this pattern.]

I believe a new generation of programmers is emerging. These "alternative" programmers are anybody who, if you ask them what they do, would not reply "I am a programmer", yet who regularly program computers in order to achieve their other goals. Alternative programmers include for example musicians, performers, writers, visual artists, scientists, architects, and activists.

Evidence of this movement includes:

1. The growth of a DIY hacker culture, with hacker spaces, hackathons, workshops, and meetups. These serve as social support structures for alternative programmers.
2. Platforms and communities built around beginner-friendly, dive-right-in programming, such as Arduino and Processing.
3. The growing use of computers as a means of creative expression, ranging from editing video for YouTube to using Max/MSP for live performances.

The use of computers in general for creative expression prompts the question: Where do we draw the line between *programming* and *authoring*--the use of specialized computer tools to produce specialized results? I don't have a good answer but I encourage the reader to take a broad view of programming. For the purposes of this paper, I will take programming to mean *designing a system*. Bret Victor's distinction between static and dynamic pictures may also be helpful. [Dynamic Pictures Motivation]

Like Smalltalk or Hypercard, I intend to blur the line between *programmer* and *user*, between programming and authoring. Consequently, throughout this paper the reader is encouraged to play with substituting the words "user" and "programmer".