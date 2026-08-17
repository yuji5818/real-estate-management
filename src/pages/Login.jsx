import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ログイン画面
export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ログイン後の遷移先（保護ページへのアクセス経由なら元のページに戻す）
  const redirectTo = location.state?.from?.pathname ?? '/properties'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    const { error } = await signIn(email, password)

    setSubmitting(false)

    if (error) {
      setErrorMessage('ログインに失敗しました。メールアドレスとパスワードをご確認ください。')
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>ログイン</h1>

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
            autoComplete="current-password"
            minLength={6}
          />
        </label>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'ログイン中...' : 'ログイン'}
        </button>

        <p className="form-footer">
          アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
        </p>
      </form>
    </div>
  )
}
