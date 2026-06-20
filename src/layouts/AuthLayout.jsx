import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-iaai">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout