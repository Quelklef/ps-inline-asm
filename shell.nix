{ pkgs ? import <nixpkgs> {}
, system ? builtins.currentSystem
}: let

get-flake =
  import
    (pkgs.fetchFromGitHub
      { owner = "ursi";
        repo = "get-flake";
        rev = "703f15558daa56dfae19d1858bb3046afe68831a";
        sha256 = "1crp9fpvwg53ldkfxnh0wyxx470lm8bs025rck2bn5jn8jqmhj6f";
      });

purs-nix =
  get-flake
    (pkgs.fetchFromGitHub
      { owner = "purs-nix";
        repo = "purs-nix";
        rev = "59cc10deeb6a113243691f242983c0496cbf824c";
        sha256 = "1g1z8cz067hz7din5ggrbfhy3qcl1wvnjz1x4bfwsg8m3lr08bvk";
      }
    ) { inherit pkgs system; };

purs-nixed =
  purs-nix.purs {
    dir = ./.;  # ???
    srcs = [];
    test = "./example/out/";
    test-module = "Testing";
    dependencies = with purs-nix.ps-pkgs; [
      prelude
      effect
      console
      tuples
    ];
  };

in pkgs.mkShell {
  buildInputs = [
    (purs-nixed.command {})
    pkgs.nodejs
    pkgs.entr
    pkgs.bat
  ];

  shellHook = ''
    echo "Run 'asm.test' or 'asm.test.watch'"

    root=$PWD

    function asm.test {(
      set -euo pipefail
      cd "$root"

      nix-build && clear
      ./result/bin/ps-inline-asm --in=./example/in --out=./example/out
      bat -P -- ./example/out/Testing.purs
      bat -P -- ./example/out/Testing.js
      purs-nix test
    )}

    function asm.test.watch {(
      set -euo pipefail
      cd "$root"
      export root; export -f asm.test
      find example/ src/ | entr -cs asm.test
    )}
  '';
}
