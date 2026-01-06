import { Transform } from 'stream';
import * as sourceMapSupport from 'source-map-support';

/* デバッグ用のsourceMap設定 */
sourceMapSupport.install();

export class CommentTransform extends Transform {
  constructor(commentProc,stringProc) {
    super();
    this.currentQuoteSymbol;
    this.currentCommentSymbol;

    this.state = {
      isComment: false,
      isString: false,
      count: 0
    }

    this.previousChar = " ";

    this.CommentSymbols = [
      { startSymbol: '#', endSymbol: '\n', includeLastChar: false },
      { startSymbol: '//', endSymbol: '\n', includeLastChar: false },
      { startSymbol: '/*', endSymbol: '*/', includeLastChar: true }
    ];

    this.QuoteSymbols = [
      { startSymbol: "'", endSymbol: "'", includeLastChar: true },
      { startSymbol: '"', endSymbol: '"', includeLastChar: true },
      { startSymbol: '`', endSymbol: '`', includeLastChar: true },
      { startSymbol: '(/', endSymbol: '/', includeLastChar: true }, //.replace(/''/g, "'");
      //ex. Lexer.NA = /NOT_APPLICABLE/;
      //ex. "\\"
    ];
    this.commentProc=commentProc;
    this.stringProc=stringProc;
  }

  isStatementStart(state, string, Symbols) {
    if (string[0] == '\\') return null; // isEscape
    for (const iterator of Symbols) {
      if (string.startsWith(iterator.startSymbol, 1)) return iterator;
    }
    return null
  }
  isComment(state, string) {
    return this.isStatementStart(state, string, this.CommentSymbols)
  }

  isQuote(state, string) {
    return this.isStatementStart(state, string, this.QuoteSymbols)
  }

  isStatementEnd(state, string, symbol) {
    if (string[0] == '\\') return false; // isEscape
    const offset = 2;
    //console.log("isStatementEnd:",string,this.state.count , symbol.startSymbol.length)
    if (this.state.count >= symbol.startSymbol.length && string.endsWith(symbol.endSymbol,offset)) return true;
    return false
  }

  _transform(chunk, encoding, callback) {
    
      const proc = (elementList) => {
        const o = elementList.map((element) => (element.isComment) ? this.commentProc(element.text) : (element.isString) ? this.stringProc(element.text) : element.text).join('')
        this.push(o)
      }

    const text = chunk.toString();
    let buf=[]
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      this.state.count++
      const nextChar = (i + 1 < text.length) ? text[i + 1] : '';
      const str = this.previousChar + char + nextChar;

      if (!this.state.isString && !this.state.isComment) {
        const isComment = this.isComment({}, str);
        const isQuote = this.isQuote({}, str);
        if (isComment) {//コメント開始
          //output.push({ isComment: true, isString: false, text: char });
          //proc({ isComment: true, isString: false, text: char });
          buf.push({ isComment: true, isString: false, text: char });
          this.state.isComment = true;
          this.state.count = 0;
          this.currentCommentSymbol = isComment;
        } else if (isQuote) {//文字列開始
          //output.push({ isComment: false, isString: true, text: char });
          //proc({ isComment: false, isString: true, text: char });
          buf.push({ isComment: false, isString: true, text: char });
          this.state.isString = true;
          this.state.count = 0;
          this.currentQuoteSymbol = isQuote;
        }else{//それ以外
          //output.push({ isComment: false, isString: false, text: char });
          //proc({ isComment: false, isString: false, text: char });
          buf.push({ isComment: false, isString: false, text: char });
        }
      } else if (this.state.isComment) { //コメント内
        if (this.isStatementEnd({}, str, this.currentCommentSymbol)) {//コメント終わり
          //proc({ isComment: true, isString: false, text: char });
          buf.push({ isComment: true, isString: false, text: char });
          proc(buf)
          buf = []
          this.currentCommentSymbol = undefined;
          this.state.isComment = false;
          this.state.count = 0;
        } else {//コメント内
          //output.push({ isComment: true, isString: false, text: char });
          //proc({ isComment: true, isString: false, text: char });
          buf.push({ isComment: true, isString: false, text: char });
        }
      } else if (this.state.isString) { //文字列内
        if (this.isStatementEnd({}, str, this.currentQuoteSymbol)) { //文字列終わり
          //output.push({ isComment: false, isString: true, text: char });
          //proc({ isComment: false, isString: true, text: char });
          buf.push({ isComment: false, isString: true, text: char });
          proc(buf)
          buf = []
          this.currentQuoteSymbol = undefined;
          this.state.isString = false;
          this.state.count = 0;
        } else {//文字列内
          //output.push({ isComment: false, isString: true, text: char });
          //proc({ isComment: false, isString: true, text: char });
          buf.push({ isComment: false, isString: true, text: char });
        }
      }
      this.previousChar = char;
    }
    proc(buf)
    buf = []
    callback() 
  }
}


export default CommentTransform;