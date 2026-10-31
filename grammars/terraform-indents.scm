; The delimiters carry the indent; every block in this language is braced.
["{" "[" "("] @indent

["}" "]" ")"] @dedent

; Reindent code without rewriting whitespace that belongs to multiline text.
([(heredoc_template) (quoted_template) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))
