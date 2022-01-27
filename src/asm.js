
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

  let state = {
    src,  // source text
    i: 0,  // source pointer

    defs: {},  // sym -> expression map
    gsym: 0,  // gensym state

    ps: new StringBuilder(),  // purescript out
    js: new StringBuilder(),  // javascript out
  };

  const parsers = [parseLineComment, parseBlockComment, parseStrLiteral, parseAsm, parseStep];

  while (state.i < state.src.length) {
    for (const parser of parsers) {
      const state_ = cloneState(state);
      parser(state_);
      if (state_.i > state.i) {
        state = state_
        break;
      }
    }
  }

  state.ps.add('\n\n');
  state.js.add('\n');
  for (const sym in state.defs) {
    const def = state.defs[sym];
    state.js.add(`\nexports.${sym} = (\n${def}\n);\n`);
    state.ps.add(`foreign import ${sym} :: forall a. a\n`);
  }

  return { ps: state.ps.build(), js: state.js.build() };

}

function cloneState(state) {
  const result = { ...state };
  result.ps = new StringBuilder(state.ps.chunks);
  result.js = new StringBuilder(state.js.chunks);
  return result;
}

function parseLineComment(state) {
  if (state.src.startsWith('--', state.i)) {
    const from = state.i;
    state.i = state.src.indexOf('\n', state.i);
    if (state.i === -1) state.i = state.src.length;
    state.ps.add(state.src.slice(from, state.i));
  }
}

function parseBlockComment(state) {
  if (!state.src.startsWith('{-', state.i)) return;
  const from = state.i;
  let depth = 0;
  do {
    if (state.src.startsWith('{-', state.i)) {
      depth += 1;
      state.i += 2;
    } else if (state.src.startsWith('-}', state.i)) {
      depth -= 1;
      state.i += 2;
    } else {
      state.i++;
    }
  } while (depth > 0);
  state.ps.add(state.src.slice(from, state.i));
}

function parseStrLiteral(state) {
  const from = state.i;

  let quot;
  if (state.src.startsWith('"""', state.i))
    quot = '"""';
  else if (state.src.startsWith('"', state.i))
    quot = '"';
  else
    return;

  state.i += quot.length;
  while (state.i < state.src.length) {
    if (state.src.startsWith(quot, state.i)) {
      state.i += quot.length;
      break;
    } else if (state.src[state.i] === '\\') {
      state.i += 2;
    } else {
      state.i++;
    }
  }

  state.ps.add(state.src.slice(from, state.i));
}

function parseAsm(state) {
  if (!(
    state.src.startsWith('asm', state.i)
    && ( state.i + 'asm'.length === state.src.length
         || state.src[state.i + 'asm'.length].match(/"|\s/)
  )))
    return;

  state.i += 'asm'.length;
  while (state.src[state.i].match(/\s/)) state.i++;

  let quot;
  if (state.src.startsWith('"""', state.i))
    quot = '"""';
  else if (state.src.startsWith('"', state.i))
    quot = '"';
  else
    throw ParseError("Expected quotation marks after 'asm'");

  state.i += quot.length;

  const j = state.src.indexOf(quot, state.i);
  if (j === -1) throw ParseError("Asm unended");
  let asm = state.src.slice(state.i, j);
  state.i = j + quot.length;

  let args;
  [asm, args] = unterpolate(asm, state);

  const sym = gensym(state, 'asm');
  state.defs[sym] = asm;

  state.ps.add('(' + [sym, ...args].join(' ') + ')');
}

function unterpolate(asm, state) {
  // TODO: this is naive

  let result = '';
  const bindings = {};

  let i = 0;
  while (i < asm.length) {
    if (asm.startsWith('#{', i)) {
      i += 2;
      const j = asm.indexOf('}', i);
      const expr = asm.slice(i , j);
      i = j + 1;
      const name = gensym(state, 'arg');
      bindings[name] = expr;
      result += name;
    } else {
      result += asm[i];
      i++;
    }
  }

  const params = Object.keys(bindings);
  const args = Object.values(bindings);

  const pre = params.map(a => a + ' => ').join('');
  result = `${pre}(${result})`;

  return [result, args];
}

function gensym(state, prefix) {
  return prefix + '_' + (state.gsym++);
}

function parseStep(state) {
  // TODO: Slow. Most cases will hit parseStep, which means most of
  //       the source file is going into the StringBuidler char-by-char.
  state.ps.add(state.src[state.i]);
  state.i++;
}
