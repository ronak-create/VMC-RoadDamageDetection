import { motion } from "framer-motion"
import { MapPin, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_26%,transparent_27%,transparent_74%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05)_76%,transparent_77%,transparent)] bg-[length:60px_60px]" />
      
      <div className="container relative px-6">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6"
          >
            Smart Road
            <br />
            <span className="relative text-primary">
              Monitoring
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-primary rounded-full"
              />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered pothole detection system that helps cities maintain safer roads
            through real-time monitoring and predictive analytics.
          </motion.p>
        </div>

        {/* Hero content only; stats grid removed to avoid dummy metrics */}
      </div>
    </section>
  )
}

export default HeroSection