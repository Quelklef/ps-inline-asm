module Main where

-- test: inline asm (single-quoted)
(asm_76)

-- test: inline asm (triple-quoted)
(asm_174)

-- test: line comments
-- asm "

-- test: block comments
{- asm " -}

-- test: nested block comments
{- {- asm " -} -}

-- test: string literal (single-quoted)
"asm \""

-- test: string literal (triple-quoted)
""" asm " """ -- "

-- test: interpolation
let n = 12
in (asm_472 (n) (n))

-- test: interpolation with JS quoting
let n = 12
in (asm_999 (n) (n))

-- test: interpolation of ps expressions
(asm_1100 ( 1 + 1 ) ( (+) ) ( "))


foreign import asm_76 :: forall a. a
foreign import asm_174 :: forall a. a
foreign import asm_472 :: forall a. a
foreign import asm_999 :: forall a. a
foreign import asm_1100 :: forall a. a
