JSON_text
  = value:grammar { return value; }
zero            =   "0"
nonzero         =   [1-9]
digit           =   zero / nonzero
lowercase       =   [a-z]
uppercase       =   [A-Z]
letter          =   lowercase / uppercase
ifs             =   " " / "\t"
newline         =   "\n" / "\r\n"
LineTerminator  = [\n\r\u2028\u2029]
SourceCharacter = .

identifier      =   letter + (letter / digit / "_")*
number          =   nonzero + digit*

block_comment   = "/*" (!"*/" SourceCharacter)* "*/"
line_comment    = "//" (!LineTerminator SourceCharacter)*

whitespace      =   ifs / newline
comment         =   block_comment / line_comment
brk             =   whitespace

item_end        =   ","
field_end       =   ","
stmt_end        =   ";"

item_decl       =   identifier  (brk)* item_end
array_decl      =  "array"  (brk)+  identifier  (brk)* 
                        "["  (brk)* 
                            identifier  (brk)* ";"  (brk)*  number  (brk)* 
                        "]"  (brk)* stmt_end

decl_stmt       =  array_decl

grammar         =   decl_stmt