module Example where

import Prelude
import Effect
import Data.Tuple.Nested (type (/\), (/\))

-- Read and return URL GET parameters
getUrlArgs :: Effect (Array (String /\ String))
getUrlArgs = (asm_448 ((/\)))



foreign import asm_448 :: forall a. a
