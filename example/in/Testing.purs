module Testing where

import Prelude
import Effect (Effect)
import Effect.Console (log)


main :: Effect Unit
main = do

  test "invoked as single-quoted"
    100 (asm "100")

  test "invoked as triple-quoted"
    25 (asm """ 1 * 20 + 5 """)

  test "invoked as mult-line"
    25 (asm """
      1 * 20
      + 5
    """)

  test "invoked as multi-line with IIFE"
    25 (asm """
      function() { let result = 20;
                   result += 5;
                   return result; }()
    """)

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
    26 (let n = 10 in asm "#{n} + #{n + 1} + 5")

  -- broken
  -- test "interpolation works when contains an end squiggly"
  --   "}" (asm """ #{ "}" } """)

  test "interpolation is ignored in JS string (single-quoted)"
    "#{n}" (asm " '#{n}' ")

  test "interpolation is ignored in JS string (double-quoted)"
    "#{n}" (asm """ "#{n}" """)

  test "interpolation is ignored in JS string (backticks)"
    "#{n}" (asm "`#{n}`")

  -- broken
  -- test "interpolation works within JS backtick interpolation"
  --   "good" (asm """ `go${ #{"od"} }` """)

  test "interpolation is ignored in JS comment (line)"
    10 (asm " 10 // #{n} ")

  test "interpolation is ignored in JS comment (block)"
    10 (asm " 10 /* #{n} */ ")


test :: forall a. Eq a => Show a => String -> a -> a -> Effect Unit
test name expected got = do
  let passed = expected == got
  log $
    (if passed then "🟢" else "🔴")
    <> " " <> name
    <> (if passed then "" else ": " <> show expected <> " /= " <> show got)

