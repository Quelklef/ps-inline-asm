

exports.asm_569 = (
 mkTup => () => {
    const params = new URL(window.location.href).searchParams;
    const result = [];
    for (const key of params.keys()) {
      const val = params.get(key);
      const tup = mkTup(key)(val);
    }
    return result;
  } 
);

exports.asm_973 = (
arg_32 =>  () => {
  const mkTup = (arg_32);  // Pull (/\) from PureScript
  const params = new URL(window.location.href).searchParams;
  const result = [];
  for (const key of params.keys()) {
    const val = params.get(key);
    const tup = mkTup(key)(val);
  }
  return result;
} 
);
