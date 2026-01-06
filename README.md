# NodeCommentTransform

**コメント・文字列を抽出・変換するNode.jsストリーム処理ライブラリ**

## プロジェクト概要

NodeCommentTransformは、プログラムコードやテキストファイルに含まれるコメント（`//`, `#`, `/* */`）と文字列（`"`, `'`, `` ` ``）を自動認識し、カスタム処理関数で変換するNode.jsライブラリです。

Node.jsの**Transform Stream**を活用しており、大規模なファイルも効率的にメモリを使用しながら処理できます。コメント・文字列内のエスケープシーケンス（`\'`, `\"`）も正しく処理します。

**主な用途:**
- コード難読化・マスキング処理
- テキストファイルの自動変換
- ログ・出力の条件付きフィルタリング
- テスト用ダミーデータの生成

## プロジェクト構成

```
NodeCommentTransform/
├── src/
│   ├── index.js                          # CommentTransform クラス定義（メインライブラリ）
│   ├── index copy.js                     # 開発用バックアップ
│   ├── index copy 2.js                   # 開発用バックアップ
│   └── index copy 3.js                   # 開発用バックアップ
├── test/
│   ├── index.js                          # テスト・デモンストレーション実行スクリプト
│   ├── util.js                           # ユーティリティ（ファイルストリーム処理）
│   ├── datas/                            # テスト入力データ
│   │   ├── sample1.txt ~ sample9.txt     # テスト用サンプルファイル
│   │   └── handsontable.full.js          # 大規模JavaScriptファイル
│   ├── expect/                           # 期待出力ファイル
│   │   └── output1.txt ~ output7.txt     # sample1~7の変換結果
│   └── output/                           # 実行結果出力ディレクトリ
├── jest.config.js                        # Jestテスト設定
├── webpack.config.js                     # Webpackバンドル設定
├── package.json                          # プロジェクト依存関係・スクリプト
└── README.md                             # このファイル
```

## 技術スタック

| 分類 | ツール・バージョン | 用途 |
|------|------------|------|
| **言語** | JavaScript (ESM) | メインライブラリ実装 |
| **ランタイム** | Node.js | 実行環境 |
| **バンドラー** | Webpack 5.91.0 | UMDフォーマットへのバンドル |
| **テスト** | Jest 29.7.0 | ユニットテスト実行 |
| **トランスパイラ** | Babel Jest 29.7.0 | ESM/JSファイルの変換 |
| **環境制御** | cross-env 7.0.3 | クロスプラットフォーム環境変数設定 |

## 機能

### ✅ 実装済み機能

1. **複数コメント形式の自動認識**
   - `#` : 行コメント（改行まで）
   - `//` : 行コメント（改行まで）
   - `/* ... */` : ブロックコメント

2. **複数引用符形式の自動認識**
   - `"..."` : ダブルクォート文字列
   - `'...'` : シングルクォート文字列
   - `` `...` `` : バックティック文字列（テンプレートリテラル）
   - `(/.../)` : 正規表現リテラル（Lexer記法）

3. **ストリーム処理による効率的な実装**
   - Transform Streamで大規模ファイルをメモリ効率的に処理
   - チャンク単位での逐次処理

4. **状態管理**
   - コメント状態・文字列状態を正確に追跡
   - エスケープシーケンス（`\'`, `\"`）に対応

5. **カスタム処理関数**
   - コメント専用の変換関数をカスタマイズ可能
   - 文字列専用の変換関数をカスタマイズ可能
   - コールバック型での柔軟な処理

### 📝 テスト・デモ機能

- 複数サンプルファイルでの自動実行テスト（sample1~9）
- 大規模JavaScriptファイル（HandsonTable）での性能テスト
- 実行時の性能統計出力（実行時間・メモリ使用量）

## セットアップ

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/nojaja/NodeCommentTransform.git
cd NodeCommentTransform

# 依存パッケージをインストール
npm install
```

### ビルド

```bash
# Webpackでバンドル（UMD形式で dist/CommentTransform.bundle.js を生成）
npm run build
```

生成ファイル:
- `dist/CommentTransform.bundle.js` : UMDフォーマットのメインバンドル
- `dist/CommentTransform.bundle.js.map` : ソースマップ（デバッグ用）

## 使用方法

### ライブラリ使用（Library API）

#### 基本的な使い方

```javascript
import CommentTransform from 'CommentTransform.bundle.js';
import { createReadStream, createWriteStream } from 'fs';

// 1. コメント変換関数を定義
const commentProcessor = (text) => {
  // コメント部分を '*' に置き換える例
  return (text.match(/\S/)) ? '*' : text;
};

// 2. 文字列変換関数を定義
const stringProcessor = (text) => {
  // 文字列部分を '#' に置き換える例
  return (text.match(/\S/)) ? '#' : text;
};

// 3. Transformストリームを生成
const transformStream = new CommentTransform(commentProcessor, stringProcessor);

// 4. ファイルストリームをパイプ
const readStream = createReadStream('input.js');
const writeStream = createWriteStream('output.js');
readStream.pipe(transformStream).pipe(writeStream);
```

#### 非ASCII文字対応の例

```javascript
const commentProcessor = (text) => {
  // 非ASCII文字は□、ASCIIの空白以外は*に置き換え
  return (text.match(/[^\x01-\x7E\uFF61-\uFF9F]/)) 
    ? '□' 
    : ((text.match(/\S/)) ? '*' : text);
};

const stringProcessor = (text) => {
  // 非ASCII文字は〇、ASCIIの空白以外は#に置き換え
  return (text.match(/[^\x01-\x7E\uFF61-\uFF9F]/)) 
    ? '〇' 
    : ((text.match(/\S/)) ? '#' : text);
};

const transformStream = new CommentTransform(commentProcessor, stringProcessor);
```

### CLI 使用（テスト・デモ実行）

#### テストスクリプトの実行

```bash
# ビルド + サンプルファイル処理実行
npm run build

# テストユーティリティで複数ファイルを処理
node ./test/index.js
```

**出力:**
- 各サンプルファイルの変換結果が `test/output/` 配下に生成
- コンソールに変換内容がリアルタイム表示
- 実行終了時に実行時間・メモリ使用量の統計を表示

```
例：
process statistice - Execution time: 0s 42.123456ms, memoryUsage: {"rss":"45.23MB","heapTotal":"15.25MB","heapUsed":"8.45MB","external":"0.15MB","arrayBuffers":"0MB"}
```

#### 特定ファイルのみ処理

`test/index.js` を編集して、以下のように処理対象を指定:

```javascript
// サンプル1のみ処理
util.exec('./test/datas/sample1.txt', './test/output/output1.txt');

// 大規模ファイル処理
util.exec('./test/datas/handsontable.full.js', './test/output/handsontable.full.js');
```

### API リファレンス

#### `CommentTransform` クラス

**コンストラクタ**
```javascript
new CommentTransform(commentProc, stringProc)
```

| パラメータ | 型 | 説明 |
|-----------|------|------|
| `commentProc` | `Function: (text: string) => string` | コメント部分を処理するコールバック関数 |
| `stringProc` | `Function: (text: string) => string` | 文字列部分を処理するコールバック関数 |

**インスタンスプロパティ**

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `CommentSymbols` | `Array` | 認識されるコメント形式の定義 |
| `QuoteSymbols` | `Array` | 認識される引用符形式の定義 |
| `state` | `Object` | 現在の処理状態（`isComment`, `isString`, `count`） |

**メソッド（Transform Stream の継承）**

| メソッド | 説明 |
|---------|------|
| `_transform(chunk, encoding, callback)` | ストリームデータを変換処理（内部使用） |
| `pipe(destination)` | 下流のストリームにデータをパイプ |

**使用例（Transform Streamとして）**
```javascript
const fs = require('fs');
const CommentTransform = require('./dist/CommentTransform.bundle.js');

const transformer = new CommentTransform(
  (text) => '*',  // コメント→*に置き換え
  (text) => '#'   // 文字列→#に置き換え
);

fs.createReadStream('input.js')
  .pipe(transformer)
  .pipe(fs.createWriteStream('output.js'));
```

## 技術詳細

### 内部動作

1. **ストリームチャンク処理**
   - ファイルを一度に全読み込みせず、チャンク単位で逐次処理
   - メモリ効率が高く、大規模ファイル対応可能

2. **状態管理マシン**
   - `isComment`, `isString` フラグで現在の文脈を追跡
   - 前の文字を保存して、2文字記号（`//`, `/*` など）の正確な認識

3. **エスケープ処理**
   ```javascript
   if (string[0] == '\\') return null; // バックスラッシュの次は開始記号と判定しない
   ```
   - エスケープされた引用符（`\"`, `\'`）はコメント・文字列の終端として判定されない

4. **シンボル定義**
   ```javascript
   CommentSymbols = [
     { startSymbol: '#', endSymbol: '\n', includeLastChar: false },
     { startSymbol: '//', endSymbol: '\n', includeLastChar: false },
     { startSymbol: '/*', endSymbol: '*/', includeLastChar: true }
   ];
   ```
   - `startSymbol` : 開始記号
   - `endSymbol` : 終了記号
   - `includeLastChar` : 終了記号を結果に含めるかどうか

### 処理フロー

```
入力ファイル
    ↓
readStream（ファイル読み込み）
    ↓
CommentTransform（コメント・文字列検出 + カスタム変換）
    ↓
writeStream（ファイル出力）
    ↓
出力ファイル
```

### サンプル実行結果

**入力（sample1.txt）:**
```
//1Hello, World! 
#2Hello, World!
4Hello, World! (This) `i's` an `examp'le` of a string.
```

**出力（commentProcessor / stringProcessor の処理後）:**
```
***** ****** 
******* *** 
4Hello, World! (This) `i's` an `examp'le` of a string.
```

## 開発について

### 開発環境セットアップ

```bash
# 依存パッケージのインストール
npm install

# ソースコードの変更後、バンドル
npm run build

# テスト実行
npm run test
```

### テスト実行

Jest による単位テスト実行（現在テストスイートは定義なし）:
```bash
npm run test
```

手動テスト（全サンプルファイル処理）:
```bash
node ./test/index.js
```

### 開発時の注意点

- `src/index.js` がメインの実装
- バックアップファイル（`index copy*.js`）は開発過程の産物
- ビルド後は必ず `test/index.js` で動作確認を実施

## 現在のステータス

| 機能 | ステータス |
|-----|----------|
| コメント認識（`#`, `//`, `/* */`） | ✅ 完成 |
| 文字列認識（`"`, `'`, `` ` ``, 正規表現） | ✅ 完成 |
| エスケープ処理 | ✅ 完成 |
| ストリーム処理 | ✅ 完成 |
| 非ASCII文字対応 | ✅ 完成 |
| Jest ユニットテスト | ⚠️ テストスイート未定義 |
| TypeScript 型定義 | ❌ 未実装 |
| npm パッケージ公開 | ❌ 未実装 |

## ライセンス・作者

- **ライセンス**: MIT
- **作者**: nojaja <free.riccia@gmail.com>
- **リポジトリ**: https://github.com/nojaja/NodeCommentTransform.git
