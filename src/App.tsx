import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/pages/Login"
import { Alerts } from "@/pages/Alerts"
import { SafetyZones } from "@/pages/SafetyZones"
import { AuditLogs } from "@/pages/AuditLogs"
import { Settings } from "@/pages/Settings"
import Analytics from "@/pages/Analytics"
import Predictions from "@/pages/Predictions"
import SOSBeacon from "@/pages/SOSBeacon"
import { EFIR } from "@/pages/EFIR"
import { PoliceFIRView } from "@/components/EFIR/PoliceFIRView"
import Surveillance from "@/pages/Surveillance"
import { GuardianVoice } from "@/pages/GuardianVoice"
import { Vitals } from "@/pages/Vitals"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* User Portal */}
          <Route path="/user" element={<MainLayout role="user" />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vitals" element={<Vitals />} />
            <Route path="geofence" element={<SafetyZones />} />
            <Route path="sos" element={<SOSBeacon />} />
            <Route path="guardian-voice" element={<GuardianVoice />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="efir" element={<EFIR />} />
          </Route>

          {/* Police Portal */}
          <Route path="/police" element={<MainLayout role="police" />}>
            <Route index element={<Navigate to="/police/alerts" replace />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="efir-registry" element={<PoliceFIRView />} />
            <Route path="geofence-admin" element={<SafetyZones adminMode={true} />} />
            <Route path="surveillance" element={<Surveillance />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Redirect Root to Login or Dashboard */}
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
