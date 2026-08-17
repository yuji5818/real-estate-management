import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import PropertyList from './pages/PropertyList'
import SignUp from './pages/SignUp'

// アプリ全体のルーティング定義
function App() {
  return (
    <Routes>
      {/* ルートパスは物件一覧へ誘導し、未ログインならログイン画面にリダイレクトされる */}
      <Route path="/" element={<Navigate to="/properties" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <PropertyList />
          </ProtectedRoute>
        }
      />
      {/* 未定義パスは物件一覧へ（未ログインならログインへ再リダイレクト） */}
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  )
}

export default App
