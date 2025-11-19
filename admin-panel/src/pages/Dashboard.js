import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  AlertTriangle,
  Calendar,
  TrendingUp,
  Eye,
  Activity,
  Settings,
  Users,
  MapPin,
} from "lucide-react";
import Clock from "../components/Clock";

// Fix for default Leaflet markers - only do this once
if (typeof window !== "undefined" && L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const Dashboard = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("map");
  const [damageData, setDamageData] = useState([]);
  const [stats, setStats] = useState({
    totalDamages: 0,
    criticalDamages: 0,
    recentReports: 0,
    resolvedIssues: 0,
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Demo data for fallback when API is not available
  const demoDamages = [
    {
      id: 1,
      type: "Pothole",
      severity: "Critical",
      location: "Main Street",
      coords: [28.6139, 77.209],
      description: "Large pothole causing traffic disruption",
      reportedDate: "2024-01-15",
      status: "Pending",
    },
    {
      id: 2,
      type: "Crack",
      severity: "High",
      location: "Highway 42",
      coords: [19.076, 72.8777],
      description: "Longitudinal crack on highway overpass",
      reportedDate: "2024-01-18",
      status: "In Progress",
    },
    {
      id: 3,
      type: "Blocked Drainage",
      severity: "Medium",
      location: "Chennai Road",
      coords: [13.0827, 80.2707],
      description: "Drainage system blocked after heavy rain",
      reportedDate: "2024-01-20",
      status: "In Progress",
    },
    {
      id: 4,
      type: "Edge Break",
      severity: "Low",
      location: "Kolkata Street",
      coords: [22.5726, 88.3639],
      description: "Minor edge deterioration on residential road",
      reportedDate: "2024-01-22",
      status: "Completed",
    },
  ];

  const menuItems = [
    { id: 1, name: "CCTV Monitoring", icon: "📹", status: "Active" },
    { id: 2, name: "Sensor Feed", icon: "📡", status: "Active" },
    { id: 3, name: "Drone Patrol", icon: "🚁", status: "Maintenance" },
    { id: 4, name: "Emergency Alerts", icon: "🚨", status: "Active" },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New pothole reported near Main Street",
      time: "5 mins ago",
      priority: "High",
    },
    {
      id: 2,
      action: "Maintenance team dispatched to Highway 42",
      time: "20 mins ago",
      priority: "Critical",
    },
    {
      id: 3,
      action: "Sensor data sync completed",
      time: "1 hour ago",
      priority: "Low",
    },
  ];

  //   useEffect(() => {
  //     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //     return () => clearInterval(timer);
  //   }, []);

  useEffect(() => {
    if (!dataLoaded) {
      fetchDamageData();
      fetchStats();
    }
  }, [dataLoaded]);

  const fetchDamageData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/damages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDamageData(data);
      } else {
        // Fallback to demo data if API fails
        setDamageData(demoDamages);
      }
    } catch (error) {
      console.error("Error fetching damage data:", error);
      // Use demo data as fallback
      setDamageData(demoDamages);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Calculate stats from current data
        calculateStatsFromData();
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      calculateStatsFromData();
    }
  }, [damageData]);

  const calculateStatsFromData = useCallback(() => {
    const currentData = damageData.length > 0 ? damageData : demoDamages;
    setStats({
      totalDamages: currentData.length,
      criticalDamages: currentData.filter(
        (d) => d.severity?.toLowerCase() === "critical"
      ).length,
      recentReports: currentData.filter(
        (d) => d.status?.toLowerCase() === "pending"
      ).length,
      resolvedIssues: currentData.filter(
        (d) => d.status?.toLowerCase() === "completed"
      ).length,
    });
  }, [damageData]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    onLogout();
  };

  // Memoized functions to prevent recreation
  const getSeverityColor = useCallback((severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "blue";
    }
  }, []);

  const getSeverityBadgeColor = useCallback((severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const getPriorityClasses = useCallback((priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in progress":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }, []);

  // Memoized custom icon creation
  const createCustomIcon = useCallback(
    (severity) => {
      const color = getSeverityColor(severity);
      return new L.DivIcon({
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        className: "custom-marker",
      });
    },
    [getSeverityColor]
  );

  // Groups damage reports by month (based on reportedDate)
const getMonthlyTrend = useCallback(() => {
  const currentData = damageData.length > 0 ? damageData : demoDamages;

  const monthMap = {}; // { "Jan": 4, "Feb": 2 ... }

  currentData.forEach((d) => {
    if (!d.reportedDate) return;

    const date = new Date(d.reportedDate);
    if (isNaN(date)) return;

    const monthName = date.toLocaleString("default", { month: "short" });

    monthMap[monthName] = (monthMap[monthName] || 0) + 1;
  });

  // Convert into recharts format
  return Object.keys(monthMap).map((month) => ({
    month,
    damages: monthMap[month],
  }));
}, [damageData]);


  const MapView = () => {
    const currentData = useMemo(
      () => (damageData.length > 0 ? damageData : demoDamages),
      [damageData]
    );

    // Memoize the markers to prevent recreation
    const markers = useMemo(() => {
      return currentData.map((damage) => (
        <Marker
          key={`marker-${damage.id}`}
          position={damage.coords}
          icon={createCustomIcon(damage.severity)}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <div className="font-semibold text-lg text-gray-800 mb-2">
                {damage.type}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Location:{" "}
                  </span>
                  <span className="text-sm text-gray-800">
                    {damage.location}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Severity:{" "}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${getSeverityBadgeColor(
                      damage.severity
                    )}`}
                  >
                    {damage.severity}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Status:{" "}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${getStatusColor(
                      damage.status
                    )}`}
                  >
                    {damage.status}
                  </span>
                </div>
                {damage.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Description:{" "}
                    </span>
                    <p className="text-sm text-gray-800 mt-1">
                      {damage.description}
                    </p>
                  </div>
                )}
                {damage.reportedDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Reported:{" "}
                    </span>
                    <span className="text-sm text-gray-800">
                      {damage.reportedDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ));
    }, [currentData, createCustomIcon, getSeverityBadgeColor, getStatusColor]);

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Quick Stats Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Damages
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalDamages}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Issues
                </p>
                <p className="text-xl font-bold text-red-600">
                  {stats.criticalDamages}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Reports
                </p>
                <p className="text-xl font-bold text-orange-600">
                  {stats.recentReports}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.resolvedIssues}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[22.9734, 78.6569]} // center of India
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            key="damage-map" // Fixed key to prevent recreation
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
            <h4 className="font-semibold text-gray-800 mb-3">
              Severity Legend
            </h4>
            <div className="space-y-2">
              {[
                { severity: "Critical", color: "red" },
                { severity: "High", color: "orange" },
                { severity: "Medium", color: "yellow" },
                { severity: "Low", color: "green" },
              ].map(({ severity, color }) => (
                <div key={severity} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm text-gray-700">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsView = () => {
    const currentData = useMemo(
      () => (damageData.length > 0 ? damageData : demoDamages),
      [damageData]
    );

    // Memoize analytics calculations to prevent recalculation on every render
    const analyticsData = useMemo(() => {
      const damageTypeData = currentData.reduce((acc, damage) => {
        const existing = acc.find((item) => item.type === damage.type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: damage.type, count: 1 });
        }
        return acc;
      }, []);

      const severityData = currentData.reduce((acc, damage) => {
        const existing = acc.find((item) => item.severity === damage.severity);
        if (existing) {
          existing.count++;
        } else {
          acc.push({
            severity: damage.severity,
            count: 1,
            color: getSeverityColor(damage.severity),
          });
        }
        return acc;
      }, []);

      const statusData = currentData.reduce((acc, damage) => {
        const existing = acc.find((item) => item.status === damage.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: damage.status, count: 1 });
        }
        return acc;
      }, []);

      return { damageTypeData, severityData, statusData };
    }, [currentData, getSeverityColor]);

    // Static monthly trend data to prevent recreation
const monthlyTrendData = useMemo(() => getMonthlyTrend(), [getMonthlyTrend]);


    return (
      <div className="h-full bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <TrendingUp className="mr-3 text-blue-600" />
          Damage Analytics & Insights
        </h2>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Damage Types Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {/* <BarChart3 className="mr-2 text-blue-600" /> */}
              Damage Types Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.damageTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Severity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ severity, count }) => `${severity}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-600" />
            Monthly Damage Reports Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="damages"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Status Cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all cursor-pointer hover:border-blue-500 hover:transform hover:-translate-y-1 hover:shadow-lg ${
                item.status === "Maintenance"
                  ? "opacity-60 cursor-not-allowed hover:transform-none border-red-200 bg-red-50"
                  : "border-gray-200 bg-white hover:bg-blue-50"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="text-gray-900 text-sm font-medium m-0">
                  {item.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div> */}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="mr-2 text-purple-600" />
            Detailed Damage Reports
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Severity
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Reported
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((damage) => (
                  <tr key={damage.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{damage.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {damage.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {damage.location}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeColor(
                          damage.severity
                        )}`}
                      >
                        {damage.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          damage.status
                        )}`}
                      >
                        {damage.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {damage.reportedDate || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-indigo-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border-l-4 border-blue-200 bg-blue-50 rounded-lg flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-gray-900 text-sm m-0 mb-1">
                    {activity.action}
                  </p>
                  <span className="text-gray-600 text-xs">{activity.time}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium uppercase ml-3 ${getPriorityClasses(
                    activity.priority
                  )}`}
                >
                  {activity.priority}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🛣️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Road Damage Detection System
              </h1>
              <p className="text-sm text-gray-600">
                Infrastructure Monitoring Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium text-slate-700">
                Welcome, {user.name}
              </div>
              <Clock />
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "map"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Damage Map</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "analytics"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "map" ? <MapView /> : <AnalyticsView />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
