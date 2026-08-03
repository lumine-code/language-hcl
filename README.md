# language-hcl

HCL and Terraform language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-hcl](https://github.com/MichaHoffmann/tree-sitter-hcl).
- **Syntax highlighting**: blocks, attributes, template interpolation and the splat operators, for both HCL and its Terraform dialect.
- **Dialects**: separate grammars for `.hcl`/`.nomad` and `.tf`/`.tfvars`, so Terraform's own references are recognised.
- **Folding**: folds blocks, objects and heredocs.
- **Symbol navigation**: block labels, which are what a reference targets.

## Services

- **hyperlink.injection** (`^1.0.0`): consumed to highlight URLs in these files as clickable links.
- **todo.injection** (`^1.0.0`): consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
