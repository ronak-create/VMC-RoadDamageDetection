import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import DashboardSection from "@/components/dashboard-section";
import ReportSection from "@/components/report-section";

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <HeroSection />
        <DashboardSection />
        <ReportSection />
      </main>
    </div>
  );
};

export default HomePage;
