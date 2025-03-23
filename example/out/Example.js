

export const asm_448 = (
arg_201 => 
  function() {
    const params = new URL(window.location.href).searchParams;
    const result = [];
    for (const key of params.keys()) {
      const val = params.get(key);
      const tup = (arg_201)(key)(val);
    }
    return result;
  }
  
);
