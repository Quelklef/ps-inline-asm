{ pkgs ? import <nixpkgs> {} }: let


npmlock2nix =
  let fetched = builtins.fetchGit {
        url = "https://github.com/tweag/npmlock2nix.git";
        rev = "8ada8945e05b215f3fffbd10111f266ea70bb502";
      };
  in import fetched { inherit pkgs; };

gitignoreSource =
  let fetched = builtins.fetchGit {
        url = "https://github.com/hercules-ci/gitignore.nix";
        rev = "80463148cd97eebacf80ba68cf0043598f0d7438";
      };
  in (import fetched { inherit (pkgs) lib; }).gitignoreSource;

node_modules = npmlock2nix.node_modules { src = gitignoreSource ./.; };


deriv = pkgs.stdenv.mkDerivation {
  name = "ps-inline-asm";
  src = ./src;
  installPhase = ''
    mkdir $out
    cp -r ${node_modules}/node_modules $out
    cp -r $src/. $out
  '';
};

script = pkgs.writeScriptBin "ps-inline-asm" ''
  #!${pkgs.bash}/bin/bash
  ${pkgs.nodejs}/bin/node ${deriv}/main.js "$@"
'';

in script
