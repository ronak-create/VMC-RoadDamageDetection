import { motion } from "framer-motion";
import { Camera, Upload, MapPin, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import {
  db,
  storage,
  collection,
  addDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/integrations/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ReportSection = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setLocation(
            `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Geolocation failed.", { description: error.message });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleQuickCapture = () => {
    if (!user) {
      toast.error("You must be logged in to report a pothole.");
      return;
    }

    handleGeolocate();

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to report a pothole.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("image", imageFile);
      formData.append("id", Date.now().toString());
      formData.append("type", "Pothole");
      formData.append("severity", "Critical");
      formData.append("location", location);
      
      const lat = coords?.lat ?? 0;
      const lng = coords?.lng ?? 0;
      formData.append("coords", JSON.stringify([lat, lng]));

      formData.append("description", description);
      formData.append("reportedDate", date);
      formData.append("user_id", user.uid);

      const res = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        body: formData, // no headers needed for FormData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully!", {
        description: "AI analysis + report stored in the database.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setImageFile(null);
      setPreviewImage(null);
      setDate("");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to submit report", {
        description: error.message,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-muted/30" id="reports">
      <div className="container px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Report a<span className="text-secondary"> Pothole</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Help improve road safety by reporting potholes in your area. Quick,
            easy, and makes a difference.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 rounded-lg bg-gradient-secondary">
                    <Send className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <span>Submit Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      className="text-sm font-medium mb-2 block"
                      htmlFor="title"
                    >
                      Type
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g., Large pothole on Main Street"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-2 block"
                      htmlFor="date"
                    >
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={date === "" ? undefined : date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium mb-2 block"
                      htmlFor="location"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="Enter street address or use GPS"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <MapPin
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={handleGeolocate}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium mb-2 block"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe the pothole size, location details, and any safety concerns..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Photos
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative"
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Pothole preview"
                          className="mx-auto h-24 w-auto rounded-md object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Click to upload photos
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                        accept="image/*"
                        capture="environment"
                      />
                    </motion.div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-secondary hover:shadow-glow transition-all duration-300"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Quick Camera Capture */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-primary">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Quick Capture</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your camera for instant reporting
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleQuickCapture}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo & Report
                </Button>
              </CardContent>
            </Card>

            {/* Reporting Tips */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reporting Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Include multiple angles in photos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Note nearby landmarks or street signs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Describe depth and width if possible</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
