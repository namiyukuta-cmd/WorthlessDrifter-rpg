# アバターPNG作業 引き継ぎ

このリポジトリのアバター画像は、完成済みPNGをそのまま使う。

## 絶対に変えないこと

- SVG化しない。
- トレースしない。
- 再描画しない。
- Photonなどで変換・再圧縮しない。
- 素体・目・髪・服は、同じキャンバスサイズ・同じ位置で重ねる。
- PNGの見た目を勝手に加工しない。

## PNGをGitHubへ置くときの成功した方式

PNGはテキストではなくバイナリとして扱う。

1. 完成済みPNGそのものを使う。
2. PNGの完全なバイナリからGitHub blobを作る。base64を使う場合も、画像全体のbase64を渡し、途中で切れた文字列を使わない。
3. 作成したblobがPNGとして妥当か確認する。極端に小さいblobや途中で切れたblobは使わない。
4. Git treeで、そのblobを目的のパスへ配置する。
5. commitを作成してbranchへ反映し、mainへマージする。
6. PNGを置くために、UTF-8テキスト用の create_file / update_file で画像本体を書かない。

## 現在のアバター素体

- 配置先: `assets/avatar/base/base_01.png`
- 表示側: `js/profile-stage1.js`
- 参照: `assets/avatar/base/base_01.png`

## 目パーツ

- 置き場: `assets/avatar/eyes/`
- 命名: `eyes_01.png`, `eyes_02.png`, `eyes_03.png` ...
- すべて素体と同じキャンバスサイズ、同じキャラクター位置で作る。
- 目以外は透明。
- ゲーム側で目ごとの座標や拡大率を変えない。
- 素体と目は同じ表示枠に `inset:0; width:100%; height:100%` で重ねる。
- 表示順: 素体 `z-index:0`、目 `z-index:10`。
- 選択値: `state.avatar.eyes` に `01`, `02` などを保存。未設定は `none`。
- `js/profile-stage1.js` には目専用の独立レイヤー `profileEyesImage` がある。

今後、新しい目・髪・服などのPNGを追加するときも、画像本体は同じ考え方でバイナリのままGitHubへ置く。
