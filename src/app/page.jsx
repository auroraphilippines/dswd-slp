"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Compass,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  Code,
  Settings,
  Shield,
  ArrowUpRight,
  Layers,
  LifeBuoy,
  BookOpen,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-700 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center relative"
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                {/* Animated shapes */}
                <motion.div 
                  className="absolute top-[-120px] left-[-120px] w-64 h-64 rounded-full bg-teal-400/10 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div 
                  className="absolute bottom-[-100px] right-[-100px] w-60 h-60 rounded-full bg-emerald-400/10 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -10, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute top-[20px] right-[20px] w-20 h-20 rounded-full bg-teal-300/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute bottom-[30px] left-[20px] w-16 h-16 rounded-full bg-emerald-300/20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                />
              </motion.div>

              {/* Logo container with pulse effect */}
              <motion.div
                className="relative w-44 h-44 mx-auto mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Pulsing rings */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.1, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />

                {/* Logo container with subtle rotation */}
                <motion.div
                  className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-emerald-400/80 to-teal-500/80 p-1 shadow-xl flex items-center justify-center"
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="bg-white rounded-full p-1 w-full h-full flex items-center justify-center">
                    <img
                      src="/images/SLP.png"
                      alt="SLP Logo"
                      className="w-36 h-36 rounded-full object-cover relative z-10"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Text elements with staggered animation */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl font-bold text-white tracking-wide"
              >
                DSWD SLP-PS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-teal-100 mt-2 text-lg"
              >
                Sustainable Livelihood Program - Proposal System
              </motion.p>

              {/* Loading indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-8"
              >
                <div className="relative h-1 w-40 mx-auto bg-emerald-800/30 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-emerald-400 left-0 top-0 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 3.5,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <motion.p
                  className="text-emerald-200 mt-3 text-sm font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5, 1] }}
                  transition={{
                    duration: 2,
                    repeat: 1,
                    repeatType: "reverse",
                  }}
                >
                  Loading system resources...
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-40 border-b border-emerald-100">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 relative">
                    <motion.div 
                      className="relative"
                      whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20 blur-sm" />
                      <img
                        src="/images/SLP.png"
                        alt="SLP Logo"
                        className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200 relative z-10"
                      />
                    </motion.div>
                    <img
                      src="/images/DSWD.png"
                      alt="DSWD Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-emerald-950">
                      DSWD SLP-PS
                    </h1>
                    <p className="text-xs text-emerald-600">
                      Sustainable Livelihood Program
                    </p>
                  </div>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                  <motion.div 
                    className="flex space-x-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
                  >
                    <NavLink href="#platform-users" icon={<Users className="w-4 h-4" />} text="Users" />
                    <NavLink href="#account-creation" icon={<UserPlus className="w-4 h-4" />} text="Accounts" />
                    <NavLink href="#service-access" icon={<Compass className="w-4 h-4" />} text="Services" />
                  </motion.div>
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                  className="md:hidden flex items-center justify-center p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  )}
                </motion.button>
              </div>

              {/* Mobile Navigation Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    className="fixed inset-0 z-30 md:hidden bg-black bg-opacity-25 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 300,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-emerald-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src="/images/SLP.png"
                            alt="SLP Logo"
                            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-200"
                          />
                          <span className="font-bold text-emerald-900">
                            DSWD SLP-PS
                          </span>
                        </div>
                        <motion.button
                          className="p-2 rounded-full bg-emerald-50 text-emerald-500 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={() => setMobileMenuOpen(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </motion.button>
                      </div>
                      <div className="flex-1 overflow-y-auto py-4">
                        <nav className="flex flex-col space-y-2 px-4">
                          <MobileNavLink 
                            href="#platform-users" 
                            icon={<Users className="mr-3 h-5 w-5" />} 
                            text="Platform Users" 
                            onClick={() => handleNavLinkClick("platform-users")}
                          />
                          <MobileNavLink 
                            href="#account-creation" 
                            icon={<UserPlus className="mr-3 h-5 w-5" />} 
                            text="Account Creation" 
                            onClick={() => handleNavLinkClick("account-creation")}
                          />
                          <MobileNavLink 
                            href="#service-access" 
                            icon={<Compass className="mr-3 h-5 w-5" />} 
                            text="Service Access" 
                            onClick={() => handleNavLinkClick("service-access")}
                          />
                        </nav>
                      </div>
                      <div className="p-4 border-t border-emerald-100">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/about");
                          }}
                          className="w-full bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium py-3 px-4 rounded-xl text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                          Learn More
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
              {/* Background elements */}
              <div className="absolute inset-0 bg-[url('/images/DSWD-RO3.png')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-teal-800/90" />
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <motion.div 
                  className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div 
                  className="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-teal-400/5 blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -20, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />
                <motion.div 
                  className="absolute top-[40%] right-[15%] w-40 h-40 rounded-full bg-emerald-300/5 blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 30, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                />
              </motion.div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  {/* Hero content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.7 }}
                      className="flex items-center gap-2 mb-6"
                    >
                      <div className="bg-emerald-300/20 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-100 text-sm font-medium border border-emerald-300/20">
                        Empowering Communities
                      </div>
                      <div className="h-px bg-emerald-500/30 flex-grow max-w-[80px]"></div>
                    </motion.div>
                    
                    <motion.h2
                      className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white leading-tight tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                        DSWD Sustainable
                      </span>{" "}
                      <span className="relative">
                        Livelihood Program
                        <motion.div 
                          className="absolute -bottom-2 left-0 h-1 w-full bg-emerald-400/40 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                        />
                      </span>
                    </motion.h2>
                    
                    <motion.p
                      className="text-xl mb-8 text-emerald-100 max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      Empowering communities through sustainable livelihood initiatives
                      designed to create opportunities for growth and self-reliance.
                    </motion.p>
                    
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <motion.button
                        onClick={() => router.push("/about")}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3.5 px-8 rounded-xl text-base shadow-md transition-all hover:shadow-lg hover:shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex items-center justify-center gap-2 group"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Get Started</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 1.5,
                            repeatDelay: 2
                          }}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => router.push("/about")}
                        className="bg-white/10 backdrop-blur-sm border border-emerald-300/20 hover:bg-white/20 text-white font-medium py-3.5 px-8 rounded-xl text-base shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Learn More</span>
                      </motion.button>
                    </motion.div>
                    
                    <motion.div
                      className="mt-12 flex items-center gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <ChevronDown className="w-8 h-8 text-emerald-400" />
                      </motion.div>
                      <p className="text-emerald-200 mt-2 text-sm">Scroll to explore</p>
                    </motion.div>
                  </motion.div>
                  
                  {/* Hero image/illustration */}
                  <motion.div
                    className="relative max-w-md w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  >
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20"
                      animate={{
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                    <div className="relative bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/50 rounded-2xl overflow-hidden p-4">
                      <div className="mb-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <LifeBuoy className="w-3.5 h-3.5 text-emerald-300" />
                          </div>
                          <span className="text-emerald-100 font-medium text-sm">DSWD SLP Program Highlights</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <motion.div 
                          className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <h3 className="text-emerald-200 font-medium text-xs mb-1 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            Microenterprise Development (MD)
                          </h3>
                          <p className="text-xs text-emerald-100/80 leading-relaxed">
                            Provides access to micro-financing for microenterprise development through the provision of seed capital fund in the amount of P10,000 (individual) or up to P15,000 per participant (group).
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <h3 className="text-emerald-200 font-medium text-xs mb-1 flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-emerald-400" />
                            Employment Facilitation (EF)
                          </h3>
                          <p className="text-xs text-emerald-100/80 leading-relaxed">
                            Facilitates opportunities for wage employment through pre-employment assistance such as skills training, career guidance and coaching, and job referral with TESDA, DOLE, and partners.
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0, duration: 0.5 }}
                        >
                          <h3 className="text-emerald-200 font-medium text-xs mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            SLP Associations & Cooperatives
                          </h3>
                          <p className="text-xs text-emerald-100/80 leading-relaxed">
                            SLP organizes target participants in groups called SLP Associations (SLPAs) to improve program delivery efficiency and facilitate sustainable interventions.
                          </p>
                        </motion.div>
                      </div>
                      
                      <motion.div
                        className="mt-3 bg-gradient-to-r from-emerald-800/40 to-teal-800/40 rounded-lg p-2.5 border border-emerald-700/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-emerald-100 font-medium text-xs">Target: 4Ps/CCT Beneficiaries</h3>
                          <motion.button
                            className="bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push("/about")}
                          >
                            <span>Learn More</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-20 top-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -right-20 bottom-10 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <motion.div 
                  className="max-w-3xl mx-auto text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-block mb-4">
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      SLP Program Tracks
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    Empowering communities through sustainable livelihoods
                  </h2>
                  <p className="text-lg text-gray-600">
                    DSWD SLP offers comprehensive support through modular interventions designed to help participants achieve economic self-sufficiency and resilience
                  </p>
                </motion.div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={<Users />}
                    title="Microenterprise Development"
                    description="Provides seed capital fund of ₱10,000-₱15,000 with business skills training to help participants establish or expand income-generating activities."
                    gradient="from-blue-500 to-indigo-600"
                    delay={0}
                  />
                  
                  <FeatureCard 
                    icon={<BookOpen />}
                    title="Skills Development"
                    description="Partners with TESDA and other agencies to provide vocational and technical training, ensuring participants gain marketable skills for employment."
                    gradient="from-emerald-500 to-teal-600"
                    delay={0.2}
                  />
                  
                  <FeatureCard 
                    icon={<MapPin />}
                    title="Community Engagement"
                    description="Organizes participants into SLP Associations (SLPAs) to foster collaboration, resource-sharing, and long-term community economic development."
                    gradient="from-amber-500 to-orange-600"
                    delay={0.4}
                  />
                </div>
                
                {/* Additional features section */}
                <motion.div
                  className="mt-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 border border-emerald-100 shadow-sm overflow-hidden relative"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="absolute right-0 top-0 w-full h-full">
                    <svg className="absolute right-0 top-0 h-full text-emerald-300/10" viewBox="0 0 136 540" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <path d="M64.0955 0.5L136 540H0.5L64.0955 0.5Z" fill="currentColor"/>
                    </svg>
                    <svg className="absolute -right-20 top-0 h-full text-emerald-400/10" viewBox="0 0 136 540" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <path d="M64.0955 0.5L136 540H0.5L64.0955 0.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-6 text-emerald-800"> Sustainable Livelihood Program Tracks</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Sustainable Income Generation", description: "Develop microenterprises that provide stable income sources for long-term economic self-sufficiency" },
                          { title: "Skills Enhancement & Training", description: "Access to vocational and technical training programs with TESDA certification opportunities" },
                          { title: "Financial & Technical Support", description: "Receive seed capital funding and ongoing mentoring from experienced business development officers" },
                          { title: "Community-Based Approach", description: "Participate in SLP Associations that strengthen local economic development and social capital" }
                        ].map((item, index) => (
                          <motion.div 
                            key={item.title}
                            className="flex gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-emerald-800">{item.title}</h4>
                              <p className="text-emerald-600 text-sm">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 md:flex-shrink-0 max-w-sm">
                      <div className="relative">
                        <motion.div
                          className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        ></motion.div>
                        <motion.div
                          className="relative bg-white rounded-xl p-6 shadow-md"
                          initial={{ y: 20 }}
                          whileInView={{ y: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                        >
                          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-emerald-800 font-medium">SLP Program Impact</div>
                              <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                2023 Data
                              </div>
                            </div>
                            <div className="space-y-3">
                              {[
                                { name: "Participants Served", status: 92, value: "15,840+" },
                                { name: "Microenterprises", status: 85, value: "8,750+" },
                                { name: "Employment Rate", status: 76, value: "76%" },
                                { name: "Income Increase", status: 83, value: "83%" }
                              ].map((service) => (
                                <div key={service.name}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{service.name}</span>
                                    <span className="text-emerald-800 font-medium">{service.value}</span>
                                  </div>
                                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-emerald-500"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${service.status}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1, delay: 0.8 }}
                                    ></motion.div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-500">Source: DSWD Annual Report</div>
                            <a 
                              href="https://www.dswd.gov.ph/sustainable-livelihood-program/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 hover:underline transition-colors"
                            >
                              <span>Program details</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Information Sections */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                {/* Platform Users */}
                <div id="platform-users" className="mb-24 scroll-mt-24">
                  <div className="flex items-center mb-10">
                    <div className="bg-sky-100 p-3 rounded-full mr-4">
                      <Users className="w-7 h-7 text-sky-700" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      DSWD SLP System Users
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <p className="text-slate-700 mb-8 text-lg">
                      The DSWD Sustainable Livelihood Program - Proposal System is exclusively accessible to DSWD SLP employees. 
                      No third parties are permitted to use the system:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          DSWD SLP Administrators
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Manage overall system configuration and access</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Review and approve proposal submissions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Administer budget allocations and disbursements</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Generate system-wide reports and analytics
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Manage user accounts for all DSWD SLP staff
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          DSWD SLP Staff Members
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Input and manage beneficiary information</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Process and track livelihood project proposals</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Document training activities and outcomes</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Monitor project implementation and results
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Generate field reports for assigned projects
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-amber-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-amber-700">
                            <strong>Important:</strong> System access is strictly limited to authorized DSWD SLP employees only. 
                            Training is provided for SLP employee staff who are transitioning to this system. 
                            Only DSWD SLP Admin staff can add new SLP members to grant access to the system. 
                            Third-party access is not permitted under any circumstances.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Creation */}
                <div id="account-creation" className="mb-24 scroll-mt-24">
                  <div className="flex items-center mb-10">
                    <div className="bg-sky-100 p-3 rounded-full mr-4">
                      <UserPlus className="w-7 h-7 text-sky-700" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      Account Creation
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <p className="text-slate-700 mb-8 text-lg">
                      To access the DSWD Sustanable Livelihood Program -
                      Proposal System, you need to have an authorized account:
                    </p>

                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 flex-1 transition-all hover:shadow-md">
                          <h3 className="font-bold text-lg mb-4 text-sky-800">
                            For DSWD SLP Staff
                          </h3>
                          <ol className="space-y-4 text-slate-700 list-decimal pl-5">
                            <li>
                              Submit an account request through your department
                              head
                            </li>
                            <li>
                              Await approval from the system administrator
                            </li>
                            <li>
                              Complete mandatory system training before full
                              access
                            </li>
                          </ol>
                        </div>

                        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 flex-1 transition-all hover:shadow-md">
                          <h3 className="font-bold text-lg mb-4 text-sky-800">
                            Important System Access Notice
                          </h3>
                          <div className="space-y-4 text-slate-700">
                            <p>The DSWD SLP Proposal System is exclusively available to authorized DSWD SLP Staff employees only.</p>
                            
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg
                                    className="h-5 w-5 text-amber-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-amber-700">
                                    <strong>Please Note:</strong> No external partner agencies or third parties are granted access to this system. Only DSWD SLP Admin staff can add new SLP members to grant access to the system.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <p className="italic text-slate-600 text-sm">If you are a DSWD SLP employee and need system access, please contact your department head to initiate the account request process.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-amber-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-amber-700">
                              <strong>Important:</strong> System access is strictly limited to authorized DSWD SLP employees only. 
                              Training is provided for SLP employee staff who are transitioning to this system. 
                              Only DSWD SLP Admin staff can add new SLP members to grant access to the system. 
                              Third-party access is not permitted under any circumstances.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Access Guide */}
                <div id="service-access" className="mb-24 scroll-mt-24">
                  <div className="flex items-center mb-10">
                    <div className="bg-sky-100 p-3 rounded-full mr-4">
                      <Compass className="w-7 h-7 text-sky-700" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      Service Access Guide
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <p className="text-slate-700 mb-8 text-lg">
                      The DSWD Sustainable Livelihood Program - Proposal System
                      provides various services to support social welfare
                      programs:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Inventory Management
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Track and manage relief goods, supplies, and
                              equipment
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Monitor stock levels and receive low stock alerts
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate inventory reports and analytics
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Barcode scanning for efficient inventory tracking
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Batch processing for bulk inventory management
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Disbursement Processing
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Create and approve disbursement requests
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Track disbursement status and delivery</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate disbursement reports for auditing
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Digital signatures for paperless approvals
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Multi-level approval workflow management
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Participants Management
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Register and manage participants information
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Track assistance provided to participants
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate participants reports and statistics
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Biometric verification for secure identification
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Case management and progress tracking</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Program Management
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Set up and configure social welfare programs
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Monitor program implementation and progress
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Generate program performance reports</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Geographic mapping of program coverage</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Impact assessment and outcome tracking</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-8 rounded-xl border border-sky-100">
                      <h3 className="font-bold text-xl mb-6 text-sky-800 text-center">
                        How to Access Services
                      </h3>
                      <ol className="space-y-4 text-slate-700 list-decimal pl-5 max-w-2xl mx-auto">
                        <li>
                          Log in to the DSWD SLP-PS system using your
                          credentials
                        </li>
                        <li>
                          Navigate to the appropriate module from the dashboard
                        </li>
                        <li>
                          Follow the on-screen instructions to access the
                          desired service
                        </li>
                        <li>
                          For assistance, contact the DSWD SLP-PS support team
                        </li>
                      </ol>
                      <div className="mt-8 flex items-center justify-center">
                        <img
                          src="/images/login.png"
                          alt="System Dashboard Preview"
                          className="rounded-xl shadow-lg max-w-full h-auto border-2 border-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Support */}
                <div id="system-support" className="scroll-mt-24">
                  <div className="flex items-center mb-10">
                    <div className="bg-sky-100 p-3 rounded-full mr-4">
                      <LifeBuoy className="w-7 h-7 text-sky-700" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      System Support & Resources
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-sky-600" />
                          Technical Support
                        </h3>
                        <p className="text-slate-700 mb-4">
                          Our dedicated support team is available to assist with any technical issues or questions you may have about the system.
                        </p>
                        <div className="space-y-3 mt-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 flex justify-center">
                              <Mail className="h-5 w-5 text-sky-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sky-800">Email Support</p>
                              <p className="text-slate-600 text-sm">support@dswdslp.gov.ph</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 flex justify-center">
                              <Phone className="h-5 w-5 text-sky-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sky-800">Phone Support</p>
                              <p className="text-slate-600 text-sm">(02) 8931-8101</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 flex justify-center">
                              <Clock className="h-5 w-5 text-sky-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sky-800">Support Hours</p>
                              <p className="text-slate-600 text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-sky-600" />
                          Training Resources
                        </h3>
                        <p className="text-slate-700 mb-4">
                          Access our comprehensive training materials to help you get the most out of the DSWD SLP Proposal System.
                        </p>
                        <div className="mt-4 space-y-3">
                          <div className="bg-white p-4 rounded-lg border border-sky-100 flex items-start space-x-3">
                            <div className="bg-sky-100 p-2 rounded-full">
                              <Download className="h-4 w-4 text-sky-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sky-800">User Manual</h4>
                              <p className="text-sm text-slate-600">Comprehensive guide to all system features and workflows</p>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-sky-100 flex items-start space-x-3">
                            <div className="bg-sky-100 p-2 rounded-full">
                              <Download className="h-4 w-4 text-sky-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sky-800">Video Tutorials</h4>
                              <p className="text-sm text-slate-600">Step-by-step video guides for common system tasks</p>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-sky-100 flex items-start space-x-3">
                            <div className="bg-sky-100 p-2 rounded-full">
                              <Download className="h-4 w-4 text-sky-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sky-800">Quick Reference Cards</h4>
                              <p className="text-sm text-slate-600">Printable guides for essential functions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6 rounded-xl border border-sky-100 mt-8">
                      <h3 className="font-bold text-xl mb-4 text-sky-800 text-center">
                        System Updates & Maintenance
                      </h3>
                      <p className="text-slate-700 text-center max-w-2xl mx-auto mb-6">
                        The DSWD SLP Proposal System is regularly updated to improve functionality and security. 
                        Scheduled maintenance typically occurs on weekends to minimize disruption.
                      </p>
                      <div className="flex justify-center">
                        <div className="bg-white px-6 py-3 rounded-lg border border-sky-100 inline-flex items-center gap-2">
                          <Code className="h-5 w-5 text-sky-600" />
                          <span className="text-sky-800 font-medium">Current System Version: 2.4.1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 relative overflow-hidden">
              {/* Background gradient and decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-teal-900"></div>
              <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10 mix-blend-soft-light"></div>
              
              <div className="absolute inset-0 pointer-events-none">
                {/* Decorative patterns */}
                <motion.div
                  className="absolute right-0 top-1/4 w-2/3 h-1/3 bg-gradient-to-r from-teal-500/20 to-emerald-500/10 blur-3xl rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                ></motion.div>
                <motion.div
                  className="absolute -left-1/4 bottom-0 w-1/2 h-1/2 bg-gradient-to-r from-emerald-500/10 to-teal-500/20 blur-3xl rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                ></motion.div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 mix-blend-overlay"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                      <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                          Ready to transform livelihoods in your community?
                        </h2>
                        <p className="text-lg mb-8 text-emerald-100 max-w-2xl">
                          Access the DSWD Sustainable Livelihood Program - Proposal System to manage inventory, process disbursements, and support participants.
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6">
                          <motion.button
                            onClick={() => router.push("/about")}
                            className="bg-white hover:bg-emerald-50 text-emerald-800 font-medium py-3.5 px-8 rounded-xl text-base shadow-xl transition-all hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2 group"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>Learn More</span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ 
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 1.5,
                                repeatDelay: 2
                              }}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </motion.span>
                          </motion.button>
                          <motion.button
                            onClick={() => router.push("/about/contact")}
                            className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium py-3.5 px-8 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <LifeBuoy className="w-4 h-4" />
                            <span>Contact Support</span>
                          </motion.button>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="hidden lg:block w-64 h-64 relative"
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-70"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 p-1">
                          <div className="bg-emerald-900 h-full w-full rounded-full flex items-center justify-center">
                            <img
                              src="/images/SLP.png"
                              alt="SLP Logo"
                              className="w-44 h-44 rounded-full object-cover relative z-10 p-3"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-20 pb-10 relative overflow-hidden">
              {/* Background patterns */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                <div className="absolute -left-40 -top-40 w-80 h-80 bg-emerald-900/30 rounded-full blur-3xl"></div>
                <div className="absolute -right-40 bottom-0 w-80 h-80 bg-teal-900/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gray-900 p-1 flex items-center justify-center">
                          <img
                            src="/images/SLP.png"
                            alt="SLP Logo"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">DSWD SLP-PS</h3>
                        <p className="text-xs text-gray-400">
                          Sustainable Livelihood Program
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6">
                      The DSWD Sustainable Livelihood Program - Proposal System
                      is designed to efficiently manage inventory, track
                      disbursements, and support participants through integrated
                      digital solutions.
                    </p>
                    <div className="flex gap-4">
                      {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                        <a 
                          key={social}
                          href={`https://${social}.com`} 
                          className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{social}</span>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zm-9 2a1 1 0 100 2 1 1 0 000-2zm0-10a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
                    <ul className="space-y-4 text-gray-400">
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span>
                          DSWD Provincial Extension Office - Aurora, Baler,
                          Aurora
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Phone className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span>(02) 8931-8101 to 07</span>
                      </li>
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span>inquiry@dswd.gov.ph</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span>Monday to Friday: 8:00 AM - 5:00 PM</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
                    <ul className="space-y-3">
                      {[
                        { name: "Platform Users", href: "#platform-users" },
                        { name: "Account Creation", href: "#account-creation" },
                        { name: "Service Access", href: "#service-access" },
                        { name: "System Support", href: "#system-support" },
                        { name: "DSWD Official Website", href: "https://www.dswd.gov.ph" },
                        { name: "Livelihood Program", href: "https://fo3.dswd.gov.ph/slp/" },
                        { name: "Contact Support", href: "/about/contact" }
                      ].map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>{link.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold mb-6 text-white">Newsletter</h3>
                    <p className="text-gray-400 mb-4">
                      Subscribe to our newsletter to get the latest updates and news.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
                      >
                        Subscribe
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      By subscribing, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </motion.div>
                </div>
                
                <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
                  <p>
                    &copy; {new Date().getFullYear()} Department of Social
                    Welfare and Development. All rights reserved.
                  </p>
                  <p className="mt-2 flex justify-center gap-4">
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Accessibility</a>
                  </p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Navigation link component for desktop
function NavLink({ href, icon, text }) {
  return (
    <motion.a
      href={href}
      className="text-emerald-700 hover:text-emerald-500 px-3 py-2 rounded-full hover:bg-emerald-50 font-medium transition-colors text-sm flex items-center gap-1.5 group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span 
        className="text-emerald-600"
        whileHover={{ rotate: [-5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>
      <span>{text}</span>
    </motion.a>
  );
}

// Navigation link component for mobile
function MobileNavLink({ href, icon, text, onClick }) {
  return (
    <motion.a
      href={href}
      className="px-4 py-3 text-base font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-500 rounded-xl transition-colors flex items-center"
      onClick={onClick}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        {icon}
        <span>{text}</span>
      </div>
    </motion.a>
  );
}

// FeatureCard component
function FeatureCard({ icon, title, description, gradient, delay = 0 }) {
  return (
    <motion.div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 p-8 hover:shadow-lg transition-all relative overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-300"></div>
      
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <motion.div
          whileHover={{ rotate: [-10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-6 h-6"
        >
          {icon}
        </motion.div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
        {description}
      </p>
    </motion.div>
  );
}
