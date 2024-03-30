const fs = require('fs');
const {Transform} = require('stream');
const CommentTransform = require('../dist/CommentTransform.bundle.js');


const exec = (inputFile, outputFile) => {
  // const inputFile = './test/datas/sample1.txt'; // 入力ファイルのパス
  // const outputFile = './test/output/output1.txt'; // 出力ファイルのパス
  
  const readStream = fs.createReadStream(inputFile)
  const writeStream = fs.createWriteStream(outputFile)
  
  // Transformを使用して実装する
  const transformStream = new CommentTransform(
    (text)=>(text.match(/[^\x01-\x7E\uFF61-\uFF9F]/)) ? '□' : ((text.match(/\S/)) ? '*' : text),
    (text)=>text
  );
  const sysout = new Transform({
    transform(chunk,encoding,done) {
      this.push(chunk) // データを下流のパイプに渡す処理
      console.log(chunk.toString())
      done() // 変形処理終了を伝えるために呼び出す
    }
  })
  readStream.pipe(transformStream).pipe(writeStream);
}

module.exports.exec = exec