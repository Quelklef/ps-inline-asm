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

  (asm_243)

  (asm_287)

  let n = 100
  (asm_460 n)


foreign import asm_243 :: forall a. a
foreign import asm_287 :: forall a. a
foreign import asm_460 :: forall a. a
