
class ParseError extends Error { }

class StringBuilder {
  constructor(chunks = []) {
    this.chunks = chunks;
  }

  add(s) {
    this.chunks.push(s);
  }

  build() {
    return this.chunks.join('');
  }
}

exports.handle = function(src) {

  // source pointer
  let i = 0;

  // source anchor
  // keeps track of the most recent index at which we emitted text
  let k = 0;

  // symbol -> expression map
  let defs = {};

  // purescript/javascript output
  let ps = new StringBuilder();
  let js = new StringBuilder();


  while (i < src.length) {

    // line comments
    if (src.startsWith('--', i)) {
      i = src.indexOf('\n', i);
      if (i === -1) i = src.length;
    }

    // block comments
    else if (src.startsWith('{-', i)) {
      let depth = 0;
      do {
        if (src.startsWith('{-', i)) {
          depth++;
          i += 2;
        } else if (src.startsWith('-}', i)) {
          depth--;
          i += 2;
        } else {
          i++;
        }
      } while (depth > 0);
    }

    // string literals
    else if (src.startsWith('"', i)) {
      const quot = src.startsWith('"""', i) ? '"""' : '"';
      i += quot.length;
      while (i < src.length) {
        if (src.startsWith(quot, i)) {
          i += quot.length;
          break;
        } else if (src[i] === '\\') {
          i += 2;
        } else {
          i++;
        }
      }
    }

    // ps-inline-asm syntax
    else if (
      src.startsWith('asm', i)
      && [undefined, ' ', '\n', '"'].includes(src[i + 'asm'.length])
    ) {

      const i0 = i;
      i += 'asm'.length;
      while (' \n'.includes(src[i])) i++;

      const quot = src.startsWith('"""', i) ? '"""' : '"';
      i += quot.length;

      const j = src.indexOf(quot, i);
      if (j === -1) throw ParseError("Missing end quote");
      const interpolated = src.slice(i, j);
      i = j + quot.length;

      const [unterpolated, args] = unterpolate(interpolated);

      const sym = 'asm_' + i;
      defs[sym] = unterpolated;

      ps.add(src.slice(k, i0))
      ps.add(args.length === 0 ? sym : '(' + [sym, ...args].join(' ') + ')');
      k = i;

    }

    else {
      i++;
    }

  }

  ps.add(src.slice(k, i));

  ps.add('\n\n');
  js.add('\n');
  for (const sym in defs) {
    const def = defs[sym];
    const defAsAssignmentRhs = (
      def.includes("\n") || def.includes("//")
        ? "(\n" + def + "\n);"
        : def.trim() + ";"
    );
    js.add(`\nexport const ${sym} = ${defAsAssignmentRhs}\n`);
    ps.add(`foreign import ${sym} :: forall a. a\n`);
  }

  return { ps: ps.build(), js: js.build() };

}

function unterpolate(asm) {

  const result = new StringBuilder();
  const bindings = {};

  let i = 0;
  let k = 0;

  while (i < asm.length) {

    // line comments
    if (asm.startsWith('//', i)) {
      i = asm.indexOf('\n', i);
      if (i === -1) i = asm.length;
    }

    // block comments
    else if (asm.startsWith('/*', i)) {
      i = asm.indexOf('*/', i) + '*/'.length;
    }

    // string literals
    else if ('"\'`'.includes(asm[i])) {
      const quot = asm[i];
      i += quot.length;
      while (i < asm.length) {
        if (asm.startsWith(quot, i)) {
          i += quot.length;
          break;
        } else if (asm[i] === '\\') {
          i += 2;
        } else {
          i++;
        }
      }
    }

    // interpolated expression
    else if (asm.startsWith('#{', i)) {
      result.add(asm.slice(k, i));
      i += '#{'.length;
      const j = asm.indexOf('}', i);
      if (j === -1) throw ParseError("Unclosed interpolation");
      const expr = asm.slice(i , j);
      i = j + '}'.length;
      const name = 'arg_' + i;
      result.add('(' + name + ')');
      bindings[name] = '(' + expr + ')';
      k = i;
    }

    else {
      i++;
    }

  }

  result.add(asm.slice(k, i));

  const params = Object.keys(bindings);
  const args = Object.values(bindings);

  const pre = params.map(a => a + ' => ').join('');
  const final = pre + result.build();

  return [final, args];
}
