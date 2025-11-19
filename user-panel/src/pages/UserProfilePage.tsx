import Header from "@/components/header";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const UserProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen font-sans p-6">
        <Header />
        <main className="container mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          <p>Please log in to view your profile.</p>
        </main>
      </div>
    );
  }

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
          User Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Details of your authenticated account.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p className="text-lg font-semibold">Email</p>
                </div>
                <span className="font-normal text-muted-foreground">{user.email}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Fingerprint className="h-5 w-5 text-muted-foreground" />
                  <p className="text-lg font-semibold">User ID</p>
                </div>
                <span className="font-normal text-muted-foreground break-all">{user.uid}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default UserProfilePage;
