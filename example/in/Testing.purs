module Main where

-- test: inline asm (single-quoted)
asm " () => 'const' "

-- test: inline asm (triple-quoted)
asm """
  (function() {
    one();
    another();
  })()
"""

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
in asm " (0.5) * (#{n} + #{n}) "

-- test: interpolation with JS quoting
let n = 12
in asm """
() => {
  console.log(   #{n}   );            // should bind

  console.log( ' #{n} ' );            // should not bind
  console.log( " #{n} " );            // should not bind

  console.log(  ` ${   #{n}   } ` );  // should bind
  console.log(  `      #{n}     ` );  // should not bind
  console.log(  ` ${ ` #{n} ` } ` );  // should not bind

  /* console.log(   #{n}   ); */      // should not bind
  // console.log(   #{n}   );         // should not bind
}
"""

-- test: interpolation of ps expressions
asm """
  #{ 1 + 1 }
  #{ (+) }
  #{ "}" }  // jinkies
"""
