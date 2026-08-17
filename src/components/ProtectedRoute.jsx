import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 未ログイン時はログイン画面へリダイレクトするラッパーコンポーネント
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    // セッション確認中は簡易的なローディング表示にする
    return <div className="page-center">読み込み中...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
