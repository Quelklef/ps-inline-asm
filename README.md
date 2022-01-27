# ps-inline-asm

## What is this?

A tool for allowing inline javascript in purescript projects.

For example:

```purescript
add :: Int -> Int -> Int
add a b = asm """ (function() {
  const [a, b] = [ #{a}, #{b} ];
    // ^ Use ${e} to interpolate a purescript expression into javascritp
  console.log('add called with', a, b);
  return a + b;
})() """
```

Also see the `example/` directory.

## How do I use it?

Run

```
node ./src/main.js --in=<src> --out=<out>
```

With `<src>` is a directory contianing `.purs` files, among other files. `<src>` will be cloned into `<out>` and then modified so that all inline ASM is compiled into normal Purescript code.

## How does it work?

In short, an expression like
```
asm "#{a} + #{b}"
```
is turned into
```
asm_0 a b
```
and a corresponding
```
foreign import asm_0 :: forall a. a
```
is emitted in the Purescript source, and its implementation
```
exports.asm_0 = a => b => a + b;
```
is emitted in the foreign module.

## Should I use it?

If you want to!

I wanted inline ASM, so I made this tool. Some people will disagree with the concept. That's fine.

## Is it production-ready?

Not yet!

I don't see any obvious flaws in the general design, but the implementation currently has some issues and is highly untested.
