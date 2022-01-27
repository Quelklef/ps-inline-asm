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

  (asm_0)

  (asm_1)

  let n = 100
  (asm_6 n n n n)


foreign import asm_0 :: forall a. a
foreign import asm_1 :: forall a. a
foreign import asm_6 :: forall a. a
