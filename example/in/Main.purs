module Main where

import Prelude
import Effect

-- asm "

{- asm " -}

_a :: String
_a = """ asm " """ -- "

_b :: String
_b = "asm \""

main :: Effect Unit
main = do

  asm """ () => {
    console.log('Look, ma, no foreign module!');
  } """

  asm "() => console.log('single-quoted')"
