# Tower of Hanoi
Another implementation of the classic mathematic problem of the Tower of Hanoi,
or The problem of Benares Temple or Tower of Brahma or Lucas' Tower and sometimes
pluralized as Towers, or simply pyramid puzzle.

## How to run
```
npm install
npm run dev
```

## Description
This is app for job interview. It is written in React but not like you are used to.
It is totally anti-pattern and the only React thing is the JSX and PureComponent. But it works!

And we have additional features aswell:
- mouse support
- custom disc number (3 - 10)
- auto solving mechanism
- high score
- animations

## Known bugs
Navigation is not the top notch, it has issues with the focus index when elements
from different child navigations are selected by mouse. This is because we can't easily
change focus index in the parent navigation and we do not know exactly when focus
from child navigation moves into another child navigation if it is not done by the keyboard
sequence.

## Improvements for the future
- implement countdown to have more challenging gameplay
- mouse navigation bug
- auto solving could continue
- better styles - these are really poor, quickly made and not responsive
- better dialog handling
- sass integration, stylelint integration
- do it in the React way
