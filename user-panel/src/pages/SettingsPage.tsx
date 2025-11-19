import Header from "@/components/header";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-8 text-center md:text-left"
        >
          Settings
        </motion.h1>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* General Settings Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="display-name" className="text-base">
                    Display Name
                  </Label>
                  {/* Placeholder for Input Component */}
                  <span className="text-muted-foreground">Priya Singh</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <span className="text-muted-foreground">priya.singh@example.com</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how and when you receive alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-base">
                    Push Notifications
                  </Label>
                  <Switch id="push-notifications" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Settings Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Select a theme for the application interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
