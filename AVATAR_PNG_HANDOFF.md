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

今後、新しい目・髪・服などのPNGを追加するときも、画像本体は同じ考え方でバイナリのままGitHubへ置く。
