import { Transform } from 'stream';
export class CommentTransform extends Transform {
  constructor() { 
    super();
    this.currentQuote; 
    this.isLineComment = false; 
    this.isBlockComment = false; 
    this.isString = false; 
  }

  _transform(chunk, encoding, callback) { 
    const output = []; 
    const text = chunk.toString(); 
    for (let i = 0; i < text.length; i++) {
      const beforeChar = (i-1 >= 0)? text[i - 1] : '';
      const char = text[i];
      const nextChar = (i+1 < text.length)? text[i + 1] : '';
      const isEscape = (beforeChar=='\\')? true : false;
      const isLineCommentSymbol = (!isEscape)? (["#"].includes(char) || ["//"].includes(char+nextChar) ): false;
      const isBlockCommentSymbol = (!isEscape)? (["/*"].includes(char+nextChar) ): false;
      const isQuote = (!isEscape)? (["'", '"', '`'].includes(char)): false;

      const blockCloseCommentSymbol = "*/"

      if (!this.isString && !this.isBlockComment && isLineCommentSymbol) {
        output.push({ isComment: true, isString: false, text: char });
        this.isLineComment = true;
      } else if (!this.isString && !this.isLineComment && isBlockCommentSymbol) {
          output.push({ isComment: true,isString: false, text: char });
          this.isBlockComment = true;
      } else if (!this.isLineComment && !this.isBlockComment && isQuote) {
        if (this.currentQuote === char) {
          output.push({ isComment: false,isString: true, text: char });
          this.currentQuote = undefined;
          this.isString = false;
        } else if (!this.currentQuote) {
          output.push({ isComment: false,isString: true, text: char });
          this.currentQuote = char;
          this.isString = true;
        } else {
          output.push({ isComment: false,isString: true, text: char });
        }
      } else if (this.isLineComment) {
        if(char === "\n"){
            output.push({ isComment: false,isString: false, text: char });
            this.isLineComment = false;
        }else{
            output.push({ isComment: true,isString: false, text: char });
        }
      } else if (this.isBlockComment) {
        if (blockCloseCommentSymbol === (beforeChar+char)) {
            output.push({ isComment: true,isString: false, text: char });
            this.isBlockComment = false;
          } else if(char === "\n"){
            output.push({ isComment: false,isString: false, text: char });
        }else{
            output.push({ isComment: true,isString: false, text: char });
        }
      } else if (this.isString) {
        output.push({ isComment: false,isString: true, text: char });
      } else {
        output.push({ isComment: false,isString: false, text: char });
      }
    }

    const o = output.map((element)=>(element.isComment)? ((element.text.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/))? '□':'*') : element.text).join('')
    callback(null, o);
  }
}


export default CommentTransform;