"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import {
  Shield,
  AlertTriangle,
  FileText,
  Map,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Eye,
  UserCheck,
  Clock,
  MapPin,
  Car,
  Activity,
  Download,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  CheckCircle,
  Mail,
  Phone,
  IdCard,
  User2,
  Plus,
  PhoneCall,
} from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockAlerts = [
  {
    id: 1,
    type: "SOS",
    severity: "high",
    location: "123 Main St",
    time: new Date(Date.now() - 300000),
    description: "Emergency assistance requested",
    status: "active",
  },
  {
    id: 2,
    type: "Break-in",
    severity: "medium",
    location: "456 Oak Ave",
    time: new Date(Date.now() - 600000),
    description: "Possible break-in reported",
    status: "active",
  },
  {
    id: 3,
    type: "Traffic",
    severity: "low",
    location: "789 Pine Rd",
    time: new Date(Date.now() - 900000),
    description: "Traffic accident minor",
    status: "resolved",
  },
]

const mockIncidents = [
  {
    id: 1,
    type: "Theft",
    severity: "high",
    status: "investigating",
    location: "123 Main St",
    time: new Date(Date.now() - 3600000),
    officer: "Officer Johnson",
    description: "Store robbery in progress",
  },
  {
    id: 2,
    type: "Assault",
    severity: "medium",
    status: "resolved",
    location: "456 Oak Ave",
    time: new Date(Date.now() - 7200000),
    officer: "Officer Smith",
    description: "Domestic dispute resolved",
  },
  {
    id: 3,
    type: "Vandalism",
    severity: "low",
    status: "pending",
    location: "789 Pine Rd",
    time: new Date(Date.now() - 10800000),
    officer: "Officer Davis",
    description: "Graffiti reported",
  },
]

const mockOfficers = [
  { id: 1, name: "Officer Johnson", status: "on-duty", location: "Patrol Zone A", badge: "001", vehicle: "Unit 12" },
  { id: 2, name: "Officer Smith", status: "on-duty", location: "Patrol Zone B", badge: "002", vehicle: "Unit 15" },
  { id: 3, name: "Officer Davis", status: "off-duty", location: "Station", badge: "003", vehicle: "Unit 18" },
  { id: 4, name: "Officer Wilson", status: "responding", location: "En Route", badge: "004", vehicle: "Unit 21" },
]

const incidentChartData = [
  { name: "Theft", count: 12 },
  { name: "Assault", count: 8 },
  { name: "Vandalism", count: 15 },
  { name: "Traffic", count: 22 },
  { name: "Other", count: 6 },
]

const responseTimeData = [
  { month: "Jan", time: 8.5 },
  { month: "Feb", time: 7.2 },
  { month: "Mar", time: 9.1 },
  { month: "Apr", time: 6.8 },
  { month: "May", time: 7.5 },
  { month: "Jun", time: 8.0 },
]

function PoliceDashboard() {
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [useFirestore, setUseFirestore] = useState(false)
  const [userRole, setUserRole] = useState("officer")
  const [alerts, setAlerts] = useState(mockAlerts)
  const [incidents, setIncidents] = useState(mockIncidents)
  const [officers, setOfficers] = useState(mockOfficers)
  const [auditLogs, setAuditLogs] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const addAuditLog = (action, details) => {
    const log = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date(),
      user: `Current User (${userRole})`,
    }
    setAuditLogs((prev) => [log, ...prev])
  }

  const assignOfficer = (incidentId, officerId) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, officer: officers.find((o) => o.id === officerId)?.name } : inc,
      ),
    )
    addAuditLog("assign", `Assigned officer to incident #${incidentId}`)
  }

  const resolveIncident = (incidentId) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "resolved" } : inc)))
    addAuditLog("resolve", `Resolved incident #${incidentId}`)
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${darkMode ? "dark" : ""}`}>
      <Router>
        <div className="flex">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
            <Header
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              useFirestore={useFirestore}
              onToggleFirestore={() => setUseFirestore(!useFirestore)}
              userRole={userRole}
              onRoleChange={setUserRole}
            />
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={<Dashboard alerts={alerts} incidents={incidents} officers={officers} />}
                />
                <Route
                  path="/alerts"
                  element={<AlertsPage alerts={alerts} setAlerts={setAlerts} userRole={userRole} />}
                />
                <Route
                  path="/incidents"
                  element={
                    <IncidentsPage
                      incidents={incidents}
                      officers={officers}
                      onAssign={assignOfficer}
                      onResolve={resolveIncident}
                      userRole={userRole}
                    />
                  }
                />
                <Route path="/map" element={<MapPage />} />
                <Route path="/tourist" element={<TouristData />} />
                <Route path="/resources" element={<ResourcesPage officers={officers} />} />
                <Route
                  path="/reports"
                  element={<ReportsPage onExport={() => addAuditLog("export", "Exported reports")} />}
                />
                <Route path="/settings" element={<SettingsPage auditLogs={auditLogs} />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </div>
  )
}

export default dynamic(() => Promise.resolve(PoliceDashboard), { ssr: false })

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  const menuItems = [
    { path: "/dashboard", icon: Shield, label: "Dashboard", badge: null },
    { path: "/alerts", icon: AlertTriangle, label: "Live Alerts", badge: 3 },
    { path: "/incidents", icon: FileText, label: "Incidents", badge: null },
    { path: "/map", icon: Map, label: "Map View", badge: null },
    { path: "/tourist", icon: Users, label: "Tourist Data", badge: null },
    { path: "/resources", icon: Users, label: "Resources", badge: null },
    { path: "/reports", icon: BarChart3, label: "Reports", badge: null },
    { path: "/settings", icon: Settings, label: "Settings", badge: null },
  ]

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50"
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shield className="w-8 h-8 text-sidebar-primary" />
              <span className="font-bold text-lg text-sidebar-foreground">Police HQ</span>
            </motion.div>
          )}
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">{item.badge}</span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}

function Header({ darkMode, onToggleDarkMode, useFirestore, onToggleFirestore, userRole, onRoleChange }) {
  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Police Command Center</h1>
          <p className="text-muted-foreground">Real-time operations dashboard</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">Role:</label>
            <select
              value={userRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-input border border-border rounded px-2 py-1 text-sm"
            >
              <option value="officer">Officer</option>
              <option value="senior_officer">Senior Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">Firestore:</label>
            <button
              onClick={onToggleFirestore}
              className={`px-3 py-1 rounded text-sm ${
                useFirestore ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {useFirestore ? "Live" : "Mock"}
            </button>
          </div>

          <button onClick={onToggleDarkMode} className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

function Dashboard({ alerts, incidents, officers }) {
  const activeAlerts = alerts.filter((a) => a.status === "active").length
  const activeIncidents = incidents.filter((i) => i.status !== "resolved").length
  const onDutyOfficers = officers.filter((o) => o.status === "on-duty").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Alerts" value={activeAlerts} icon={AlertTriangle} color="text-destructive" />
        <StatCard title="Open Incidents" value={activeIncidents} icon={FileText} color="text-primary" />
        <StatCard title="Officers On Duty" value={onDutyOfficers} icon={Users} color="text-accent" />
        <StatCard title="Response Time" value="7.2 min" icon={Clock} color="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      alert.severity === "high"
                        ? "bg-destructive"
                        : alert.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-accent"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-card-foreground">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.floor((Date.now() - alert.time) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Officer Status</h3>
          <div className="space-y-3">
            {officers.slice(0, 4).map((officer) => (
              <div key={officer.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      officer.status === "on-duty"
                        ? "bg-accent"
                        : officer.status === "responding"
                          ? "bg-yellow-500"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-card-foreground">{officer.name}</p>
                    <p className="text-sm text-muted-foreground">{officer.location}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground capitalize">{officer.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      className="bg-card rounded-lg border border-border p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </motion.div>
  )
}

function TouristData() {
  const contacts = [
    { id: 1, name: "John Doe", relation: "Brother", phone: "+91 9876543210" },
    { id: 2, name: "Jane Smith", relation: "Friend", phone: "+91 8765432109" },
  ]

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}:</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tourist Data</h2>

      <div className="space-y-3 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <InfoRow icon={User2} label="Name" value="akshat" />
        <InfoRow icon={Mail} label="Email" value="abcd@gmail.com" />
        <InfoRow icon={Phone} label="Mobile" value="0123456789" />
        <InfoRow icon={IdCard} label="ID Number" value="0123456789" />
      </div>

      <div className="space-y-3 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.relation} • {c.phone}</p>
              </div>
              <button className="p-2 rounded hover:bg-sidebar-accent">
                <PhoneCall className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button className="mt-2 px-4 py-2 border rounded-lg text-sm inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Contact
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Location Sharing</p>
            <p className="text-sm text-muted-foreground">Share location with emergency contacts</p>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function AlertsPage({ alerts, setAlerts, userRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [heatmapEnabled, setHeatmapEnabled] = useState(false)

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const handleAssign = (alertId) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "assigned" } : alert)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Alerts</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
            className={`px-4 py-2 rounded-lg ${
              heatmapEnabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Heatmap {heatmapEnabled ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 bg-input border border-border rounded-lg"
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            className="bg-card border border-border rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    alert.severity === "high"
                      ? "bg-destructive"
                      : alert.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-accent"
                  }`}
                />
                <div>
                  <h3 className="font-semibold text-card-foreground">{alert.type}</h3>
                  <p className="text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor((Date.now() - alert.time) / 60000)}m ago</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  View
                </button>
                <button
                  onClick={() => handleAssign(alert.id)}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
                >
                  <UserCheck className="w-4 h-4 mr-2 inline" />
                  Assign
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function IncidentsPage({ incidents, officers, onAssign, onResolve, userRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIncident, setSelectedIncident] = useState(null)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const maskSensitiveData = (data) => {
    if (userRole === "admin") return data
    return data.replace(/\d{3}-\d{3}-\d{4}/, "***-***-****").replace(/[\w.-]+@[\w.-]+\.\w+/, "***@***.***")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Incident Management</h2>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-input border border-border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="investigating">Investigating</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Officer</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="border-t border-border hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            incident.severity === "high"
                              ? "bg-destructive"
                              : incident.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-accent"
                          }`}
                        />
                        <span className="font-medium">{incident.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{incident.location}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          incident.status === "resolved"
                            ? "bg-accent text-accent-foreground"
                            : incident.status === "investigating"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{incident.officer || "Unassigned"}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {incident.status !== "resolved" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onResolve(incident.id)
                            }}
                            className="text-accent hover:text-accent/80"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedIncident && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Incident Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-card-foreground">{selectedIncident.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-card-foreground">{maskSensitiveData(selectedIncident.description)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-card-foreground">{selectedIncident.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned Officer</label>
                <select
                  value={selectedIncident.officer || ""}
                  onChange={(e) => onAssign(selectedIncident.id, Number.parseInt(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-lg"
                >
                  <option value="">Select Officer</option>
                  {officers
                    .filter((o) => o.status === "on-duty")
                    .map((officer) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Evidence Placeholder</h4>
                <div className="bg-muted rounded-lg p-4 text-center text-muted-foreground">No evidence uploaded</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MapPage() {
  const [heatmapEnabled, setHeatmapEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Map View</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
            className={`px-4 py-2 rounded-lg ${
              heatmapEnabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Heatmap {heatmapEnabled ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Map Integration Placeholder</h3>
              <p className="text-muted-foreground">Leaflet/Mapbox integration will be implemented here</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Live Counts</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Alerts</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Officers</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incidents</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Officer Trails</h3>
            <div className="bg-muted rounded-lg p-4 h-32 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Trail visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourcesPage({ officers }) {
  const onDutyCount = officers.filter((o) => o.status === "on-duty").length
  const respondingCount = officers.filter((o) => o.status === "responding").length
  const offDutyCount = officers.filter((o) => o.status === "off-duty").length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resource Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="On Duty" value={onDutyCount} icon={Users} color="text-accent" />
        <StatCard title="Responding" value={respondingCount} icon={Activity} color="text-yellow-500" />
        <StatCard title="Off Duty" value={offDutyCount} icon={Users} color="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Officers</h3>
          <div className="space-y-3">
            {officers.map((officer) => (
              <div key={officer.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      officer.status === "on-duty"
                        ? "bg-accent"
                        : officer.status === "responding"
                          ? "bg-yellow-500"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{officer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Badge #{officer.badge} • {officer.vehicle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground capitalize">{officer.status}</span>
                  {officer.status === "on-duty" && (
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                      Quick Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Assets</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Patrol Units</p>
                  <p className="text-sm text-muted-foreground">Available for deployment</p>
                </div>
              </div>
              <span className="text-lg font-semibold">8/12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Emergency Vehicles</p>
                  <p className="text-sm text-muted-foreground">Specialized units</p>
                </div>
              </div>
              <span className="text-lg font-semibold">3/4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportsPage({ onExport }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Incidents by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SettingsPage({ auditLogs }) {
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 10
  const totalPages = Math.ceil(auditLogs.length / logsPerPage)
  const currentLogs = auditLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings & Audit Logs</h2>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Audit Logs</h3>
        <div className="space-y-3">
          {currentLogs.length > 0 ? (
            currentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium capitalize">{log.action}</p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <p className="text-xs text-muted-foreground">{log.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{log.timestamp.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No audit logs yet</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-muted text-muted-foreground rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-muted text-muted-foreground rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
