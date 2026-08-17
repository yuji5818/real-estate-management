# 不動産管理Webアプリ（Supabase認証）

React + Vite + Supabaseで構成された、メール＋パスワード認証付きの不動産管理アプリです。

## 機能

- メールアドレス＋パスワードでの会員登録・ログイン
- 未ログイン時はログイン画面へ自動リダイレクト
- ログイン後は物件一覧画面（ダミーデータ）を表示
- ログアウト機能

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーし、SupabaseのProject URLとPublishable keyを設定してください。
（`.env` はgit管理対象外です）

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb-publishable-xxxxxxxx
```

Supabaseダッシュボードの `Project Settings > API` から値を取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

## Supabase側の準備

- Authentication機能でメール＋パスワード認証（Email provider）を有効にしてください。
- 「メール確認を必須にする」設定が有効な場合、会員登録後は確認メール内のリンクを踏むまでログインできません。
  動作確認をしやすくしたい場合は、Supabaseダッシュボードの
  `Authentication > Providers > Email > Confirm email` を一時的に無効化してください。

## ディレクトリ構成

```
src/
  components/
    ProtectedRoute.jsx   # 未ログイン時にログイン画面へリダイレクトするラッパー
  context/
    AuthContext.jsx       # Supabaseの認証状態を管理するContext
  data/
    dummyProperties.js    # 物件一覧のダミーデータ
  lib/
    supabaseClient.js     # Supabaseクライアントの初期化
  pages/
    Login.jsx              # ログイン画面
    SignUp.jsx              # 会員登録画面
    PropertyList.jsx        # 物件一覧画面
```
