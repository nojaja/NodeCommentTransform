import {Transform} from 'stream'
import {Readable} from 'stream'
// 何も変形しないTransform
const noop = new Transform({
  transform(chunk,encoding,done) {
    this.push(chunk) // データを下流のパイプに渡す処理
    done() // 変形処理終了を伝えるために呼び出す
  }
})

const stream = Readable.from(['a', 'b', 'c'])
stream.pipe(noop).pipe(process.stdout)