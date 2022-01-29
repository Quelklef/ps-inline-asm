

exports.asm_243 = (
 () => {
    console.log('Look, ma, no foreign module!');
  } 
);

exports.asm_287 = (
() => console.log('single-quoted')
);

exports.asm_460 = (
arg_36 =>  () => {
       console.log(    (arg_36)    );
       console.log(  ' #{n} '  );
       console.log( /* #{n} */ );
    // console.log(    #{n}    );
  } 
);
