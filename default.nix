let

pkgs-default =
  let fetched = builtins.fetchGit {
        url = "https://github.com/NixOS/nixpkgs";
        rev = "e448c1c1e6d3c3edb58c356469f64c578b12d0ff";
      };
  in import fetched { system = builtins.currentSystem; };

in { pkgs ? pkgs-default }: let

gitignoreSource =
  let fetched = builtins.fetchGit {
        url = "https://github.com/hercules-ci/gitignore.nix";
        rev = "637db329424fd7e46cf4185293b9cc8c88c95394";
      };
  in (import fetched { inherit (pkgs) lib; }).gitignoreSource;

in pkgs.buildNpmPackage {
  name = "ps-inline-asm";
  src = gitignoreSource ./.;
  npmDepsHash = "sha256-vHWUg5dThDiVyTlUZDjau/qQX9SzRaqK1UJlCYIdY6c=";
  dontNpmBuild = true;
}

