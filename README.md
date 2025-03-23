# ps-inline-asm


## What is this?

A tool for embedding inline javascript into purescript code.

For example:

```purescript
square :: Number -> Number
square x = asm "Math.pow(#{x}, 2)"

map :: forall a b. (a -> b) -> Array a -> Array b
map f arr = asm """
  function() {
    const result = [];
    for (const elem of #{arr}) {
      result.push(#{f}(elem));
    }
    return result;
  }()
"""
```

Anything that can be written as a javascript expression can be inlined with `asm`.


## How do I use it?

When using nix (recommended), do something like

```nix
ps-inline-asm =
  let src = pkgs.fetchFromGitHub {
    owner = "quelklef";
    repo = "ps-inline-asm";
    rev = <insert rev here>;
    sha256 = <insert sha here>;
  };
  in import src { inherit pkgs; };

# elsewhere ...

pkgs.mkDerivation {
  name = "my-purescript-app";
  buildInputs = [ ps-inline-asm ];
  buildPhase = ''
    cp -r $src .
    ps-inline-asm --in=./src --in-place
    # Now compile ./src with usual methods
  '';
}

```

If you're not using nix, I guess you'd do something like this:

```bash
git clone https://github.com/quelklef/ps-inline-asm
cd ps-inline-asm
npm install

node ./ps-inline-asm/main.js --in=<path-to-src-dir> --out=<path-to-out-dir>
```

## CLI

When used via nix, `ps-inline-asm` is a single executable, which can be called like

```bash
ps-inline-asm --in=<src> --out=<out>
```

or like

```bash
ps-inline-asm --in=<src> --in-place
```

Once executed, `ps-inline-asm` will compile the code in `<src>`, replacing calls to `asm` with normal purescript code, and write the results to `<out>` (or, if `--in-place` is specified, back to `<src>`).

When used via `node`, all the same is true, but replace `ps-inline-asm` with `node /path/to/ps-inline-asm/main.js`.


## How does it work?

Essentially, an expression like

```purs
asm "#{a} + #{b}"
```

gets turned into

```purs
asm_0 a b
```

and a corresponding foreign import is emitted:

```purs
foreign import asm_0 :: forall a. a
```

as well as a corresponding foreign module export:

```purs
export const asm_0 = a => b => a + b;
```


## Should I use it?

If you want to!


## Is it production-ready?

Not really

For the sake of simplicity, I implemented `ps-inline-asm` with a naive parsing strategy. As a result, it will not always parse properly. For instance, the following will not do what you want:

```purs
str = asm """  "{" + #{ "}" }  """
```

Additionally, at the moment, `ps-inline-asm` does not preserve code line numbers. For example, say you have a source file like

```
1| f :: Int -> Int
2| f x = asm """
3|   x + 100
4| """
5|
6| g :: Int -> Int
7| g = oops
```

If you compile this with `ps-inline-asm` and feed the output into the purescript compiler, it will (correctly) emit an error complaining that `oops` is not defined. However, the error will be reported for the wrong line number: instead of line `6`, it will show up as line `4`.

This is because the output of `ps-inline-asm` would be something like:

```
1| f :: Int -> Int
2| f x = asm_0 x
3|
4| g :: Int -> Int
5| g = oops
```
