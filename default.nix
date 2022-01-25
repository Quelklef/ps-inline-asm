{ pkgs ? import <nixpkgs> {} }:

pkgs.writeScriptBin "ps-inline-asm" ''
  #!${pkgs.bash}/bin/bash
  ${pkgs.nodejs}/bin/node ${./ps-inline-asm.js} "$@"
''
