

exports.asm_0 = (
( () => {
    console.log('Look, ma, no foreign module!');
  } )
);

exports.asm_1 = (
(() => console.log('single-quoted'))
);

exports.asm_6 = (
arg_2 => arg_3 => arg_4 => arg_5 => ( () => {
       console.log(    arg_2    );
       console.log(  ' arg_3 '  );
       console.log( /* arg_4 */ );
    // console.log(    arg_5    );
  } )
);
