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
] @keyword.operator.hcl

"{" @punctuation.definition.block.begin.bracket.curly.hcl
"}" @punctuation.definition.block.end.bracket.curly.hcl
"[" @punctuation.definition.array.begin.bracket.square.hcl
"]" @punctuation.definition.array.end.bracket.square.hcl
"(" @punctuation.definition.expression.begin.bracket.round.hcl
")" @punctuation.definition.expression.end.bracket.round.hcl

"." @punctuation.separator.property.hcl
"," @punctuation.separator.comma.hcl
[
  ".*"
  "[*]"
] @keyword.operator.splat.hcl

(ellipsis) @keyword.operator.ellipsis.hcl
"\?" @keyword.operator.hcl
"=>" @punctuation.separator.key-value.hcl

[
  ":"
  "="
] @_IGNORE_.none

[
  "for"
  "endfor"
  "in"
] @keyword.control.loop.hcl

[
  "if"
  "else"
  "endif"
] @keyword.control.conditional.hcl

[
  (quoted_template_start) ; "
  (quoted_template_end) ; "
  (template_literal) ; non-interpolation/directive content
] @string.quoted.double.hcl

[
  (heredoc_identifier)
  (heredoc_start)
] @punctuation.definition.string.heredoc.hcl

[
  (template_interpolation_start)
  (template_directive_start)
] @punctuation.definition.template-expression.begin.hcl
[
  (template_interpolation_end)
  (template_directive_end)
] @punctuation.definition.template-expression.end.hcl
(strip_marker) @keyword.operator.strip.hcl

(numeric_lit) @constant.numeric.hcl

(bool_lit) @constant.language.boolean.hcl

(null_lit) @constant.other.hcl

(comment) @comment.line.hcl @_IGNORE_.spell

(identifier) @variable.other.hcl

((identifier) @keyword.control.hcl
  (#is? test.childOfType block))

((identifier) @support.type.hcl
  (#is? test.typeAt "parent.parent.parent block"))

(function_call
  (identifier) @entity.name.function.hcl)

(attribute
  (identifier) @variable.other.member.hcl)

; { key: val }
;
; highlight identifier keys as though they were block attributes
(object_elem
  key: (expression
    (variable_expr
      (identifier) @variable.other.member.hcl)))

; var.foo, data.bar
;
; first element in get_attr is a variable.builtin or a reference to a variable.builtin
(expression
  (variable_expr
    (identifier) @variable.language.hcl)
  (get_attr
    (identifier) @variable.other.member.hcl))
