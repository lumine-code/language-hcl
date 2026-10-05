; Labels identify blocks; the keyword becomes their displayed context.
; A second label is qualified by the first, distinguishing repeated resources.
(block
  (identifier)
  . (string_lit)
  . (string_lit (template_literal) @name)
  . (block_start)
  (#set! symbol.prependTextForNode parent.previousNamedSibling.namedChildren.1)
  (#set! symbol.joiner ".")
  (#set! symbol.contextNode parent.parent.firstNamedChild)) @definition.module

(block
  (identifier)
  . (string_lit (template_literal) @name)
  . (block_start)
  (#set! symbol.contextNode parent.parent.firstNamedChild)) @definition.module

; Unlabelled scopes such as terraform and locals keep their keyword as a name.
(block
  . (identifier) @name
  . (block_start)) @definition.module
