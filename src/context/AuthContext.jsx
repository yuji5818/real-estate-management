import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 認証状態（ログインユーザー情報）をアプリ全体で共有するためのContext
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション取得が完了するまでのローディング状態
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に現在のセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの認証状態変化を監視する
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // クリーンアップ時に購読を解除する
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    // 新規会員登録
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    // ログイン
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    // ログアウト
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 各コンポーネントから認証情報・認証操作を利用するためのフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの内部で使用してください')
  }
  return context
}
