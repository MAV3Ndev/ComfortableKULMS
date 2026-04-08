# ComfortableKULMS

KULMS を快適にするためのブラウザ拡張機能です。  
対象サイト: `https://lms.gakusei.kyoto-u.ac.jp/portal`

## Readme
[English](https://github.com/MAV3Ndev/ComfortableKULMS/blob/master/README_en.md) | Japanese

## このフォークについて

このリポジトリは [das08/ComfortablePandA](https://github.com/das08/ComfortablePandA) をベースに、京都大学の新しい LMS である KULMS 向けに調整したフォークです。

主な変更点:

- 対象 URL を KULMS に変更
- 新しい KULMS ポータル UI に合わせて miniSakai の挿入位置と講義一覧取得処理を更新
- KULMS のサイドバー構造に合わせて通知バッジと色付け処理を修正

## 使い方

1. 拡張機能をブラウザに読み込みます
2. KULMS にログインします
3. 右上付近に追加されるボタンから miniSakai を開きます

## 機能

### 講義タブの色付け

課題やクイズの締切が近い講義を見つけやすいように、講義一覧を色分けします。

- 赤: 締切がかなり近い
- 黄: 締切が近い
- 緑: まだ余裕がある
- 灰: さらに先

### 未読課題の通知

新しく追加された課題がある講義に通知バッジを表示します。

### miniSakai

miniSakai では以下を確認できます。

- 公開中の課題一覧
- 公開中のクイズ一覧
- 自分用メモ

### キャッシュ

KULMS への負荷を抑えるため、課題とクイズの取得結果を一定時間キャッシュします。  
キャッシュ時間は設定から変更できます。

## インストール

現時点でこのフォークのストア配布はありません。手動で読み込んで使ってください。

### Chrome / Edge

1. このリポジトリを clone するか ZIP で取得します
2. 依存関係をインストールします

```bash
npm install
```

3. ビルドします

```bash
npm run build:chrome
```

4. `chrome://extensions/` または `edge://extensions/` を開きます
5. デベロッパーモードを有効化します
6. `dist/source/chrome` を「パッケージ化されていない拡張機能」として読み込みます

## 開発

### ビルド

```bash
npm run build:chrome
```

```bash
npm run build:firefox
```

```bash
npm run build:all
```

### テスト

```bash
npm run test
```

## AI 支援について

このフォークには、OpenAI Codex を用いた AI 支援によって実装・修正されたコードが含まれます。  
変更内容は人手で確認し、このリポジトリに取り込んでいます。

## License

Apache-2.0 License
