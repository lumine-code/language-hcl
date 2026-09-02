; Terraform is a dialect of HCL and its upstream query says `inherits: hcl`.
; Lumine has no inheritance; an array-valued query key concatenates instead,
; so this is the HCL base scoped for Terraform, loaded before the dialect's
; own rules.

; highlights.scm
[
  "!"
  "\*"
  "/"
  "%"
  "\+"
  "-"
  ">"
  ">="
  "<"
  "<="
  "=="
  "!="
  "&&"
  "||"
] @keyword.operator.terraform

"{" @punctuation.definition.block.begin.bracket.curly.terraform
"}" @punctuation.definition.block.end.bracket.curly.terraform
"[" @punctuation.definition.array.begin.bracket.square.terraform
"]" @punctuation.definition.array.end.bracket.square.terraform
"(" @punctuation.definition.expression.begin.bracket.round.terraform
")" @punctuation.definition.expression.end.bracket.round.terraform

"." @punctuation.separator.property.terraform
"," @punctuation.separator.comma.terraform
[
  ".*"
  "[*]"
] @keyword.operator.splat.terraform

(ellipsis) @keyword.operator.ellipsis.terraform
"\?" @keyword.operator.terraform
"=>" @punctuation.separator.key-value.terraform

[
  ":"
  "="
] @_IGNORE_.none

[
  "for"
  "endfor"
  "in"
] @keyword.control.loop.terraform

[
  "if"
  "else"
  "endif"
] @keyword.control.conditional.terraform

[
  (quoted_template_start) ; "
  (quoted_template_end) ; "
  (template_literal) ; non-interpolation/directive content
] @string.quoted.double.terraform

[
  (heredoc_identifier)
  (heredoc_start)
] @punctuation.definition.string.heredoc.terraform

[
  (template_interpolation_start)
  (template_directive_start)
] @punctuation.definition.template-expression.begin.terraform
[
  (template_interpolation_end)
  (template_directive_end)
] @punctuation.definition.template-expression.end.terraform
(strip_marker) @keyword.operator.strip.terraform

(numeric_lit) @constant.numeric.terraform

(bool_lit) @constant.language.boolean.terraform

(null_lit) @constant.other.terraform

(comment) @comment.line.terraform @_IGNORE_.spell

(identifier) @variable.other.terraform

((identifier) @keyword.control.terraform
  (#is? test.childOfType block))

((identifier) @support.type.terraform
  (#is? test.typeAt "parent.parent.parent block"))

(function_call
  (identifier) @entity.name.function.terraform)

(attribute
  (identifier) @variable.other.member.terraform)

; { key: val }
;
; highlight identifier keys as though they were block attributes
(object_elem
  key: (expression
    (variable_expr
      (identifier) @variable.other.member.terraform)))

; var.foo, data.bar
;
; first element in get_attr is a variable.builtin or a reference to a variable.builtin
(expression
  (variable_expr
    (identifier) @variable.language.terraform)
  (get_attr
    (identifier) @variable.other.member.terraform))
