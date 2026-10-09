{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";

  outputs = { self, nixpkgs }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
    in {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              yarn
            ];
          };
        });

      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in {
          default = pkgs.stdenv.mkDerivation {
            pname = "kcounter";
            version = "0.1.0";
            src = self;

            yarnOfflineCache = pkgs.fetchYarnDeps {
              yarnLock = ./yarn.lock;
              hash = "sha256-fHa67SIGvtfogW8lSXsCj/2FzF3yysENyrWy7vFffao=";
            };

            nativeBuildInputs = with pkgs; [
              nodejs
              yarnConfigHook
              yarnBuildHook
            ];

            installPhase = ''
              cp -r build $out
            '';
          };
        });

      nixosModules.default = { config, lib, pkgs, ... }:
        let
          cfg = config.services.kcounter;
        in {
          options.services.kcounter = {
            enable = lib.mkEnableOption "kcounter";
            domain = lib.mkOption {
              type = lib.types.str;
              example = "kcounter.example.org";
            };
          };

          config = lib.mkIf cfg.enable {
            services.nginx = {
              enable = true;
              virtualHosts.${cfg.domain} = {
                root = self.packages.${pkgs.stdenv.hostPlatform.system}.default;
                locations."/".tryFiles = "$uri /index.html";
              };
            };
          };
        };
    };
}
