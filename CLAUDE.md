# CLAUDE.md

このファイルはClaude Code（claude.ai/code）がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

Supabase認証機能付きの不動産管理Webアプリ。React + Viteで構成し、メール＋パスワードでの会員登録・ログイン、ログイン後の物件一覧表示（ダミーデータ）を提供する。

## 要件

### 機能要件
- メールアドレス＋パスワードで会員登録・ログインできる
- ログイン後は物件一覧画面（ダミーデータでよい）に遷移する
- 未ログインの場合はログイン画面にリダイレクトする
- ログアウトボタンを設ける

### 技術要件
- React + Viteで構成する
- Supabaseと連携する（`@supabase/supabase-js`）
- SupabaseのProject URLとPublishable keyは `.env` で管理し、`.env` は `.gitignore` に追加する
- コメントは日本語で記載する

### UI要件
- ログイン画面と会員登録画面はシンプルなフォーム
- 物件一覧画面は物件名・家賃・エリアを表示するカード形式

## 開発コマンド

```bash
npm install      # 依存パッケージのインストール
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # oxlintによるlintチェック
npm run preview  # ビルド成果物のプレビュー
```

## 環境変数

`.env.example` を `.env` にコピーして値を設定する（`.env` はgit管理対象外）。

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb-publishable-xxxxxxxx
```

Supabase側は Authentication > Providers > Email を有効化しておく。動作確認をしやすくする場合は
「Confirm email」を一時的に無効化すると、会員登録後すぐにログインできる。

## ディレクトリ構成

```
src/
  lib/supabaseClient.js       # Supabaseクライアントの初期化（.envの値を読み込む）
  context/AuthContext.jsx     # 認証状態（session/user）を共有するContext。signUp/signIn/signOutを提供
  components/ProtectedRoute.jsx  # 未ログイン時に/loginへリダイレクトするラッパー
  data/dummyProperties.js     # 物件一覧のダミーデータ（物件名・家賃・エリア）
  pages/Login.jsx             # ログイン画面
  pages/SignUp.jsx            # 会員登録画面
  pages/PropertyList.jsx      # 物件一覧画面（カード形式）＋ログアウトボタン
  App.jsx                     # ルーティング定義（/login, /signup, /properties）
  main.jsx                    # エントリーポイント（BrowserRouter + AuthProviderでラップ）
```

## 実装上の注意点

- 認証状態は `AuthContext` の `useAuth()` フックから取得する。新規に認証絡みの画面を追加する場合もこのフック経由で扱う。
- ルート保護は `ProtectedRoute` コンポーネントで行う。新しいログイン必須ページを追加する際はこれでラップする。
- Supabaseの鍵情報を直接コード中にハードコーディングしない。必ず `import.meta.env.VITE_*` 経由で参照する。
- コメントは日本語で統一する。
