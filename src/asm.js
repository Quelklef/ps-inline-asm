
class ParseError extends Error { }

exports.handle = function(src) {

  let state = {
    src,  // source text
    i: 0,  // source pointer

    defs: {},  // sym -> expression map
    gsym: 0,  // gensym state

    ps: '',  // purescript out
    js: '',  // javascript out
  };

  const parsers = [parseLineComment, parseBlockComment, parseStrLiteral, parseAsm, parseStep];

  while (state.i < state.src.length) {
    for (const parser of parsers) {
      const state_ = clone(state);
      parser(state_);
      if (state_.i > state.i) {
        state = state_
        break;
      }
    }
  }

  state.ps += '\n\n';
  state.js += '\n';
  for (const sym in state.defs) {
    const def = state.defs[sym];
    state.js += `\nexports.${sym} = (\n${def}\n);\n`;
    state.ps += `foreign import ${sym} :: forall a. a\n`;
  }

  return { ps: state.ps, js: state.js };

}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));  // meh
}

function parseLineComment(state) {
  if (state.src.startsWith('--', state.i)) {
    const from = state.i;
    state.i = state.src.indexOf('\n', state.i);
    if (state.i === -1) state.i = state.src.length;
    state.ps += state.src.slice(from, state.i);
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
  state.ps += state.src.slice(from, state.i);
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

  state.ps += state.src.slice(from, state.i);
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
  const asm = state.src.slice(state.i, j);
  state.i = j + quot.length;

  const sym = gensym(state);
  state.defs[sym] = asm;
  state.ps += sym;
}

function gensym(state) {
  return 'asm_' + (state.gsym++);
}

function parseStep(state) {
  state.ps += state.src[state.i];
  state.i++;
}
