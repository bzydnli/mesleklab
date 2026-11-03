import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page-width not-found">
      <span>404</span>
      <h1>Bu laboratuvar henüz yok.</h1>
      <p>MeslekLab ana sayfasına dönüp mevcut alanlardan birini seçebilirsin.</p>
      <Link className="button primary" to="/">Ana sayfaya dön</Link>
    </div>
  )
}
