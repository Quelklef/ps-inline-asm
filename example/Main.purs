module Main where

import Prelude
import Effect (Effect)

main :: Effect Unit
main = do
  asm "() => console.log('single-quoted')"
  asm """ () => {
    console.log('triple-quoted');
  } """
