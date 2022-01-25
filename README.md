# ps-inline-asm

Allows inline Javascript in Purescript, like this:

```purs
module Main where

import Prelude
import Effect (Effect)

main :: Effect Unit
main = do

  asm "() => console.log('single-quoted')"
  
  asm """ () => {
    console.log('triple-quoted');
  } """
```

## Q&A

### Is this production-ready?

No, not in the slightest.

### How do I use this?

Don't. But if you really want to, take a look at `run-example.sh`.
