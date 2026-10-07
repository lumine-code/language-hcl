# language-hcl

HCL and Terraform language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-hcl](https://github.com/MichaHoffmann/tree-sitter-hcl).
- **Syntax highlighting**: blocks, attributes, template interpolation and the splat operators, for both HCL and its Terraform dialect.
- **Dialects**: separate grammars for `.hcl`/`.nomad` and `.tf`/`.tfvars`/`.tofu`, so Terraform and OpenTofu references are recognised.
- **Folding**: folds blocks, objects and heredocs.
- **Symbol navigation**: block labels, which are what a reference targets.

## Installation

To install `language-hcl` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-hcl`.

## Injections

- Static Tree-sitter injections highlight URLs with `language-hyperlink`.
- Static Tree-sitter injections highlight comment markers with `language-todo`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
