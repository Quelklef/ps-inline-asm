module Main where

import Prelude
import Effect
import Data.Tuple.Nested (type (/\), (/\))

-- Read and return URL GET parameters
getUrlArgs_impl1 :: Effect (Array (String /\ String))
getUrlArgs_impl1 = impl (/\)
  where

  impl :: (String -> String -> String /\ String) -> Effect (Array (String /\ String))
  impl = (asm_569)

-- Same thing, implemented using interpolation
getUrlArgs_impl2 :: Effect (Array (String /\ String))
getUrlArgs_impl2 = (asm_973 ((/\)))


foreign import asm_569 :: forall a. a
foreign import asm_973 :: forall a. a
