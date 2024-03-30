const text = `
//Hello, World! 
//Hello, "World"!
#Hello, World! 
Hello, World! (This) \`i's\` an \`examp'le\` of a string.
"Hello, World! (This) \`i's\` an \`examp'le\` of a string.";
Hello, World! This \\"is\\" an example of a string.//hoge
Hello, World! This is an example of a string.#fuga
全角テスト //あいうえお
"かきくけこ"
/* Hello, World! */
/* Hello, World! 
 * This is an example 
 * of a string.
 */
"/* Hello, World! */"
/* Hello, World! "*/
Hello, World! "This is an //example" of a string.
`

const output = [];
let currentQuote;
let isLineComment = false
let isBlockComment = false
let isString = false

for (let i = 0; i < text.length; i++) {
  const beforeChar = (i-1 >= 0)? text[i - 1] : '';
  const char = text[i];
  const nextChar = (i+1 < text.length)? text[i + 1] : '';
  const isEscape = (beforeChar=='\\')? true : false;
  const isLineCommentSymbol = (!isEscape)? (["#"].includes(char) || ["//"].includes(char+nextChar) ): false;
  const isBlockCommentSymbol = (!isEscape)? (["/*"].includes(char+nextChar) ): false;
  const isQuote = (!isEscape)? (["'", '"', '`'].includes(char)): false;

  const blockCloseCommentSymbol = "*/"

  if (!isString && !isBlockComment && isLineCommentSymbol) {
    output.push({ isComment: true, isString: false, text: char });
    isLineComment = true;
  } else if (!isString && !isLineComment && isBlockCommentSymbol) {
      output.push({ isComment: true,isString: false, text: char });
      isBlockComment = true;
  } else if (!isLineComment && !isBlockComment && isQuote) {
    if (currentQuote === char) {
      output.push({ isComment: false,isString: true, text: char });
      currentQuote = undefined;
      isString = false;
    } else if (!currentQuote) {
      output.push({ isComment: false,isString: true, text: char });
      currentQuote = char;
      isString = true;
    } else {
      output.push({ isComment: false,isString: true, text: char });
    }
  } else if (isLineComment) {
    if(char === "\n"){
        output.push({ isComment: false,isString: false, text: char });
        isLineComment = false;
    }else{
        output.push({ isComment: true,isString: false, text: char });
    }
  } else if (isBlockComment) {
    if (blockCloseCommentSymbol === (beforeChar+char)) {
        output.push({ isComment: true,isString: false, text: char });
        isBlockComment = false;
      } else if(char === "\n"){
        output.push({ isComment: false,isString: false, text: char });
    }else{
        output.push({ isComment: true,isString: false, text: char });
    }
  } else if (isString) {
    output.push({ isComment: false,isString: true, text: char });
  } else {
    output.push({ isComment: false,isString: false, text: char });
  }
}

const o = output.map((element)=>(element.isComment)? ((element.text.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/))? '□':'*') : element.text).join('')
console.log(o)