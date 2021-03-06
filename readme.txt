THE PANEL
by Nicholas Weber
Written for Code Fellows Foundations I course.
v 0.25

UPDATE (7-1):
Added HTML/CSS/jQuery to make the Panel work without the console and without the prompts popping up. Thanks to HTML5 boilerplate: http://html5boilerplate.com/ for the responsive HTML page foundation on which to build the game.

KNOWN ISSUES:
Can't play more than one round, due to the behavior (I think) of the jQuery in the ministerSwitch() function starting on line 252 in the js/main.js stacking up. I couldn't figure out a way to fix it right now, so I disabled the code to play a new round. To experience the strangeness, just uncomment the code in lines 439 ff.




Thanks to Nicholas Zakas at http://www.nczonline.net/blog/2009/04/21/computer-science-in-javascript-doubly-linked-lists/ for ideas on how to implement the doubly-linked list for the ministers.

panel.html is a JavaScript demo for three different data types imagined as a game: a line of reporters asks a panel of three government ministers questions about various issues. You can switch between the ministers in order to attempt to answer the questions successfully.

You'll see three different data types in action in the game:
Queue: The line of reporters is treated as a FIFO queue with the reporter in first position stepping up and asking a question, then returning to the end of the queue.

Stack: The question cards are implemented as a FILO stack. The reporters write a question, then put it on the top of the stack. They then draw questions off the top of the stack and ask them.

Doubly-linked lists: The ministers act like a doubly-linked list: they know who is to their right and left, but cannot pass the microphone more than one person away.

Planned improvements:

- Keep a score of successful and unsuccessfully answered questions and give the player feedback after the questions are done.
- Implement the question difficulty so it influences if ministers can answer the questions successfully.
- Make game mechanics more transparent to the player so they can make better decisions.
- Balance the game and check that the random number generator is producing the expected results.
- Add better commenting to code, esp. the switching section.
- DRY out code so that it is easier to read, edit and debug, especially the minister switching and minister .askedAQuestion method.
- Figure out a way to implement the minister switching as a method on an object or a function.
- Put in actual questions pulled from a list of questions that are relevant to the specialty of the question.