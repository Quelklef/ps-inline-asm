const fs = require('fs');

function parseAsm(psIn, i) {
  const fail = [null, i];

  const sentinel = 'asm';
  if (psIn.startsWith(sentinel, i))
    i += sentinel.length;
  else
    return fail;

  while (psIn[i] === ' ')
    i++;

  const quots = ['"""', '"'];
  let quot;
  for (const q of quots) {
    if (psIn.startsWith(q, i)) {
      quot = q;
      break;
    }
  }
  if (!quot) return fail;
  i += quot.length;

  const j = psIn.indexOf(quot, i);
  if (j === -1)
    return fail;
  const asm = psIn.slice(i, j);
  i = j + quot.length;
  return [asm, i];
}

function handle(psIn) {

  let gensym = 0;
  const defs = {};

  let psOut = '';
  let jsOut = '';

  let i = 0;
  while (i < psIn.length) {

    let asm;
    [asm, i] = parseAsm(psIn, i);
    if (asm !== null) {
      const sym = 'asm_' + (gensym++);
      defs[sym] = asm;
      psOut += sym;
      jsOut += `\nexports.${sym} = (\n${asm}\n);\n`;
    } else {
      psOut += psIn[i];
      i++;
    }

  }

  for (const sym in defs) {
    const def = defs[sym];
    psOut += `\nforeign import ${sym} :: forall a. a\n`;
  }

  return { ps: psOut, js: jsOut };

}

function main() {

  const fstubs = (
    process.argv
    .slice(2)
    .map(floc => {
      if (floc.endsWith('.purs'))
        return floc.slice(0, -'.purs'.length);
      throw Error(`File ${floc} is not a purescript source file`);
    })
  );

  for (const fstub of fstubs) {
    const fps = fstub + '.purs';
    const fjs = fstub + '.js';

    const source = fs.readFileSync(fps).toString();
    const out = handle(source);

    if (out.ps !== source)
      fs.writeFileSync(fps, out.ps);

    if (out.js !== '') {
      if (fs.existsSync(fjs)) {
        fs.appendFileSync(fjs, out.js);
      } else {
        fs.writeFileSync(fjs, out.js);
      }
    }
  }

  console.log('Done');

}

main();
