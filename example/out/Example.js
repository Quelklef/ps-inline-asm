

exports.asm_0 = (
( mkTup => () => {
    const params = new URL(window.location.href).searchParams;
    const result = [];
    for (const key of params.keys()) {
      const val = params.get(key);
      const tup = mkTup(key)(val);
    }
    return result;
  } )
);

exports.asm_2 = (
arg_1 => ( () => {
  const mkTup = arg_1;  // Pull (/\) from PureScript
  const params = new URL(window.location.href).searchParams;
  const result = [];
  for (const key of params.keys()) {
    const val = params.get(key);
    const tup = mkTup(key)(val);
  }
  return result;
} )
);
