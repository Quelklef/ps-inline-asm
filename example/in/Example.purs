module Main where

import Prelude
import Effect
import Data.Tuple.Nested (type (/\), (/\))

-- Read and return URL GET parameters
getUrlArgs_impl1 :: Effect (Array (String /\ String))
getUrlArgs_impl1 = impl (/\)
  where

  impl :: (String -> String -> String /\ String) -> Effect (Array (String /\ String))
  impl = asm """ mkTup => () => {
    const params = new URL(window.location.href).searchParams;
    const result = [];
    for (const key of params.keys()) {
      const val = params.get(key);
      const tup = mkTup(key)(val);
    }
    return result;
  } """

-- Same thing, implemented using interpolation
getUrlArgs_impl2 :: Effect (Array (String /\ String))
getUrlArgs_impl2 = asm """ () => {
  const mkTup = #{(/\)};  // Pull (/\) from PureScript
  const params = new URL(window.location.href).searchParams;
  const result = [];
  for (const key of params.keys()) {
    const val = params.get(key);
    const tup = mkTup(key)(val);
  }
  return result;
} """
