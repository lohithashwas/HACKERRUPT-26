import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Add other routes here as placeholders for now */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
