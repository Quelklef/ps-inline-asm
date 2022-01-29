

exports.asm_76 = (
 () => 'const' 
);

exports.asm_174 = (

  (function() {
    one();
    another();
  })()

);

exports.asm_472 = (
arg_14 => arg_21 =>  (0.5) * ((arg_14) + (arg_21)) 
);

exports.asm_999 = (
arg_30 => arg_315 => 
() => {
  console.log(   (arg_30)   );            // should bind

  console.log( ' #{n} ' );            // should not bind
  console.log( " #{n} " );            // should not bind

  console.log(  ` ${   #{n}   } ` );  // should bind
  console.log(  `      #{n}     ` );  // should not bind
  console.log(  ` ${ ` (arg_315) ` } ` );  // should not bind

  /* console.log(   #{n}   ); */      // should not bind
  // console.log(   #{n}   );         // should not bind
}

);

exports.asm_1100 = (
arg_13 => arg_24 => arg_32 => 
  (arg_13)
  (arg_24)
  (arg_32)" }  // jinkies

);
