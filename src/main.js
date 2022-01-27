
const fs = require('fs-extra');
const path = require('path');
const klaw = require('klaw-sync');

const { handle } = require('./asm');

function main() {

  const clargs = getClargs();

  if (clargs.get('help', false)) {
    help();
    process.exit(1);
  }

  const pwd = process.env.PWD;
  const dirIn = path.resolve(pwd, clargs.get('in'));
  const inPlace = clargs.get('in-place', false);
  const dirOut = path.resolve(pwd, clargs.get('out', inPlace ? dirIn : undefined));

  if (!inPlace && dirIn === dirOut)
    fail('Refusing to read and write on the same directory');

  console.log(path.relative(pwd, dirIn), '→', path.relative(pwd, dirOut));

  if (!inPlace) {
    if (fs.existsSync(dirOut)) fs.removeSync(dirOut);
    fs.copySync(dirIn, dirOut);
  }

  for (const elem of klaw(dirOut)) {
    const fpath = elem.path;
    if (!(fpath.endsWith('.purs'))) continue;

    console.log(path.relative(dirOut, fpath));

    const fstub = fpath.slice(0, -'.purs'.length);
    const fps = fstub + '.purs';
    const fjs = fstub + '.js';

    const src = fs.readFileSync(fps).toString();
    const out = handle(src);

    fs.writeFileSync(fps, out.ps);

    if (out.js.trim() !== '') {
      if (fs.existsSync(fjs)) {
        fs.appendFileSync(fjs, out.js);
      } else {
        fs.writeFileSync(fjs, out.js);
      }
    }
  }

  console.log('asm inlining complete');

}

function help() {
  console.log(`
    Usage:
         ps-inline-asm --in=<directory-in> --out=<directory-out>
      OR ps-inline-asm --in=<directory> --in-place
  `);
}

function getClargs() {

  const kargs = {};
  const pargs = [];

  for (const word of process.argv.slice(2)) {
    if (word.startsWith('--') && word.includes('=')) {
      const i = word.indexOf('=');
      const key = word.slice('--'.length, i);
      const val = word.slice(i + 1);
      kargs[key] = val;
    } else if (word.startsWith('--')) {
      kargs[word.slice('--'.length)] = true;
    } else if (word.startsWith('-')) {
      for (const c of word.slice('-'.length))
        kargs[c] = true;
    } else {
      pargs.push(word);
    }
  }

  return {

    kargs,
    pargs,

    get(key, fallback) {
      const from =
          typeof key === 'string' ? kargs
        : typeof key === 'number' ? pargs
        : (() => { throw Error('You have angered me'); })();

      if (key in from)
        return from[key];
      else if (fallback !== undefined)
        return fallback;
      else
        fail(`Missing command-line argument '${key}'`);
    }

  };

}

function fail(msg) {
  process.stderr.write(msg);
  process.exit(1);
}

main();
