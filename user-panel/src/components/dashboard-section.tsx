import { motion } from "framer-motion"
import { Map, BarChart3, Activity, Zap, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { db, collection, onSnapshot } from "@/integrations/firebase/client";

const DashboardSection = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const reportsCollection = collection(db, "pothole_reports");
    const unsubscribe = onSnapshot(
      reportsCollection,
      (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        console.error("Failed to fetch reports:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error (dashboard):", error);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  }, []);

  const stats = [
    {
      icon: Map,
      label: "Potholes Detected",
      value: reports ? reports.length : "...",
      color: "primary"
    },
    {
      icon: Activity,
      title: "Smart Detection",
      description: "AI-powered analysis of road images with 94%+ accuracy in pothole identification.",
      gradient: "primary"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Immediate notifications for new potholes and priority routing for repairs.",
      gradient: "secondary"
    }
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-background flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-primary">Loading dashboard data...</p>
      </section>
    );
  }

  const fixedReportsCount = reports?.filter(r => r.status === 'resolved').length || 0;

  const dynamicStats = [
    {
      icon: Map,
      label: "Total Reports",
      value: reports?.length.toLocaleString() || "0",
      color: "primary"
    },
    {
      icon: Zap,
      label: "Resolved Reports",
      value: fixedReportsCount.toLocaleString() || "0",
      color: "secondary"
    },
    {
      icon: Activity,
      label: "Pending Reports",
      value: (reports?.filter(r => r.status === 'pending').length || 0).toLocaleString(),
      color: "warning"
    },
    {
      icon: BarChart3,
      label: "Critical Reports",
      value: (reports?.filter(r => r.severity === 'critical').length || 0).toLocaleString(),
      color: "destructive"
    }
  ];

  const handleViewFullMap = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${userLocation.lat},${userLocation.lng}`;
      window.open(url, "_blank");
      return;
    }

    const reportsWithCoords = reports?.filter((r: any) =>
      typeof r.latitude === "number" && typeof r.longitude === "number"
    );

    if (!reportsWithCoords || reportsWithCoords.length === 0) {
      window.open("https://www.google.com/maps", "_blank");
      return;
    }

    const avgLat =
      reportsWithCoords.reduce((sum: number, r: any) => sum + r.latitude, 0) /
      reportsWithCoords.length;
    const avgLng =
      reportsWithCoords.reduce((sum: number, r: any) => sum + r.longitude, 0) /
      reportsWithCoords.length;

    const url = `https://www.google.com/maps/search/?api=1&query=${avgLat},${avgLng}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-20 bg-background" id="dashboard">
      <div className="container px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Advanced Road
            <span className="text-primary"> Monitoring</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Comprehensive tools for monitoring, analyzing, and managing road infrastructure
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {dynamicStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-${
                      stat.color === 'primary'
                        ? 'primary'
                        : stat.color === 'secondary'
                        ? 'secondary'
                        : stat.color === 'warning'
                        ? 'primary'
                        : 'primary'
                    } bg-opacity-10`}>
                      <stat.icon
                        className={`h-6 w-6 ${
                          stat.color === 'primary'
                            ? 'text-primary-foreground'
                            : stat.color === 'secondary'
                            ? 'text-secondary-foreground'
                            : stat.color === 'warning'
                            ? 'text-warning-foreground'
                            : stat.color === 'destructive'
                            ? 'text-destructive-foreground'
                            : 'text-foreground'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <motion.p
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="text-3xl font-bold text-foreground"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto">
          {/* Interactive Map Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <Map className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span>Interactive Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Map View */}
                <div className="relative h-64 bg-muted rounded-lg overflow-hidden mb-6">
                  {userLocation ? (
                    <iframe
                      title="User location map"
                      src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Map className="h-12 w-12 text-primary mx-auto mb-2" />
                          <p className="text-muted-foreground">Live Map View</p>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground bg-background/70 px-3 py-1 rounded-full shadow-sm">
                    <div>
                      {isLocating
                        ? "Detecting your location..."
                        : userLocation
                        ? `Your location: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`
                        : "Location not available"}
                    </div>
                    <div>{reports?.length.toLocaleString() || 0} detected potholes</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full" />
                      <span className="text-sm text-muted-foreground">High Priority</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded-full" />
                      <span className="text-sm text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-secondary rounded-full" />
                      <span className="text-sm text-muted-foreground">Fixed</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleViewFullMap}>
                    View Full Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {stats.slice(1).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-${feature.gradient} flex-shrink-0`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DashboardSection
