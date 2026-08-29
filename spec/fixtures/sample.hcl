# Assertions live in the comments: `<- scope` checks the marker's own column
# on the previous non-comment line, `^ scope` checks the caret's. Scopes
# match by prefix, so the trailing `.hcl` segment is left off.

variable "region" {
# <- variable.other
# <- keyword.control
#        ^ string.quoted.double
#                 ^ punctuation.definition.block.begin.bracket.curly

  default = 3
# ^ variable.other.member
#           ^ constant.numeric

  lifecycle {
# ^ support.type
  }

}
# <- punctuation.definition.block.end.bracket.curly

# a comment
# <- comment
