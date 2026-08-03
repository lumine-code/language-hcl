
; Terraform specific references
;
;
; local/module/data/var/output
(expression
  (variable_expr
    (identifier) @variable.language.terraform
    (#any-of? @variable.language.terraform "data" "var" "local" "module" "output"))
  (get_attr
    (identifier) @variable.other.member.terraform))

; path.root/cwd/module
(expression
  (variable_expr
    (identifier) @support.type.builtin.terraform
    (#eq? @support.type.builtin.terraform "path"))
  (get_attr
    (identifier) @variable.language.terraform
    (#any-of? @variable.language.terraform "root" "cwd" "module")))

; terraform.workspace
(expression
  (variable_expr
    (identifier) @support.type.builtin.terraform
    (#eq? @support.type.builtin.terraform "terraform"))
  (get_attr
    (identifier) @variable.language.terraform
    (#any-of? @variable.language.terraform "workspace")))

; Terraform specific keywords
; FIXME: ideally only for identifiers under a `variable` block to minimize false positives
((identifier) @support.type.builtin.terraform
  (#any-of? @support.type.builtin.terraform "bool" "string" "number" "object" "tuple" "list" "map" "set" "any"))

(object_elem
  val: (expression
    (variable_expr
      (identifier) @support.type.builtin.terraform
      (#any-of? @support.type.builtin.terraform "bool" "string" "number" "object" "tuple" "list" "map" "set" "any"))))
