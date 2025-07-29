import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthRedirect from './components/AuthRedirect'
import DashboardPage from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './stores/authStore'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import MySessionsPage from './pages/MySessionsPage';
import EditSessionPage from './pages/EditSessionsPage';

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <>
      <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                duration: 4000,
              }}
            />

      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        <Route path="/my-sessions" element={<ProtectedRoute><MySessionsPage /></ProtectedRoute>} />
        <Route path="/sessions/edit/:id" element={<ProtectedRoute><EditSessionPage /></ProtectedRoute>} />
        <Route path="*" element={<AuthRedirect/>} />
      </Routes>
    </>
  )
}


export default App