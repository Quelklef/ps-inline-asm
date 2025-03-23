module Testing where

import Prelude
import Effect (Effect)
import Effect.Console (log)


main :: Effect Unit
main = do

  test "invoked as single-quoted"
    100 (asm_173)

  test "invoked as triple-quoted"
    25 (asm_240)

  test "invoked as mult-line"
    25 (asm_319)

  test "invoked as multi-line with IIFE"
    25 (asm_492)

  -- interpolation ignored in ps line comment
  -- asm "

  -- interpolation ignored in ps block comment
  {- asm " -}

  -- broken
  -- interpolation ignored in ps nested block comment
  -- {- {- asm " -} -}

  test "not invoked when in string (single-quoted)"
    ("as" <> "m \"") "asm \""

  test "not invoked when in string (triple-quoted)"
    ("as" <> "m \" ") """asm " """ -- "

  test "interpolation works"
    26 (let n = 10 in (asm_957 (n) (n + 1)))

  -- broken
  -- test "interpolation works when contains an end squiggly"
  --   "}" (asm """ #{ "}" } """)

  test "interpolation is ignored in JS string (single-quoted)"
    "#{n}" (asm_1158)

  test "interpolation is ignored in JS string (double-quoted)"
    "#{n}" (asm_1254)

  test "interpolation is ignored in JS string (backticks)"
    "#{n}" (asm_1340)

  -- broken
  -- test "interpolation works within JS backtick interpolation"
  --   "good" (asm """ `go${ #{"od"} }` """)

  test "interpolation is ignored in JS comment (line)"
    10 (asm_1547)

  test "interpolation is ignored in JS comment (block)"
    10 (asm_1635)


test :: forall a. Eq a => Show a => String -> a -> a -> Effect Unit
test name expected got = do
  let passed = expected == got
  log $
    (if passed then "🟢" else "🔴")
    <> " " <> name
    <> (if passed then "" else ": " <> show expected <> " /= " <> show got)



foreign import asm_173 :: forall a. a
foreign import asm_240 :: forall a. a
foreign import asm_319 :: forall a. a
foreign import asm_492 :: forall a. a
foreign import asm_957 :: forall a. a
foreign import asm_1158 :: forall a. a
foreign import asm_1254 :: forall a. a
foreign import asm_1340 :: forall a. a
foreign import asm_1547 :: forall a. a
foreign import asm_1635 :: forall a. a
