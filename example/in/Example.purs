module Example where

import Prelude
import Effect
import Data.Tuple.Nested (type (/\), (/\))

-- Read and return URL GET parameters
getUrlArgs :: Effect (Array (String /\ String))
getUrlArgs = asm """
  function() {
    const params = new URL(window.location.href).searchParams;
    const result = [];
    for (const key of params.keys()) {
      const val = params.get(key);
      const tup = #{(/\)}(key)(val);
    }
    return result;
  }
  """

