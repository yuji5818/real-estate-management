import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 会員登録画面
export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)

    setSubmitting(false)

    if (error) {
      setErrorMessage('会員登録に失敗しました。入力内容をご確認ください。')
      return
    }

    // Supabaseの設定でメール確認が有効な場合はセッションが発行されない
    if (!data.session) {
      setInfoMessage('確認メールを送信しました。メール内のリンクから登録を完了してください。')
      return
    }

    navigate('/properties', { replace: true })
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label className="form-field">
          <span>メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="form-field">
          <span>パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </label>

        {errorMessage && <p className="form-error">{errorMessage}</p>}
        {infoMessage && <p className="form-info">{infoMessage}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '会員登録'}
        </button>

        <p className="form-footer">
          既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
