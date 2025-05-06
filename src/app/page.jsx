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
                    <NavLink href="#faqs" icon={<HelpCircle className="w-4 h-4" />} text="FAQs" />
                  </motion.div>
                  
                  <motion.div
                    className="ml-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <button
                      onClick={() => router.push("/login")}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full py-2 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1 group"
                    >
                      <span>Login</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
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
                          <MobileNavLink 
                            href="#faqs" 
                            icon={<HelpCircle className="mr-3 h-5 w-5" />} 
                            text="FAQs" 
                            onClick={() => handleNavLinkClick("faqs")}
                          />
                        </nav>
                      </div>
                      <div className="p-4 border-t border-emerald-100">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/login");
                          }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl text-base shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                        >
                          <span>Login to System</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/about");
                          }}
                          className="w-full mt-3 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium py-3 px-4 rounded-xl text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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
                        onClick={() => router.push("/login")}
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
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(num => (
                          <div 
                            key={num} 
                            className="w-10 h-10 rounded-full border-2 border-emerald-800 overflow-hidden"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                          </div>
                        ))}
                      </div>
                      <div className="text-emerald-100 text-sm">
                        <span className="font-semibold text-white">1,000+</span> communities
                        <br/>empowered nationwide
                      </div>
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
                    <div className="relative bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/50 rounded-2xl overflow-hidden p-6">
                      <div className="mb-6 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-emerald-300" />
                          </div>
                          <span className="text-emerald-100 font-medium">Program Statistics</span>
                        </div>
                        <div className="text-xs text-emerald-300 bg-emerald-900/50 py-1 px-2 rounded-md">
                          Live Data
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          { label: "Communities Served", value: "1,248", icon: <Users className="w-4 h-4" /> },
                          { label: "Programs Active", value: "36", icon: <Settings className="w-4 h-4" /> },
                          { label: "Success Rate", value: "94%", icon: <ArrowUpRight className="w-4 h-4" /> },
                          { label: "Funding Released", value: "₱28.3M", icon: <Download className="w-4 h-4" /> }
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400">
                                {stat.icon}
                              </div>
                              <span className="text-xs text-emerald-300">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div
                        className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 rounded-xl p-4 border border-emerald-700/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-emerald-100 text-sm font-medium">Monthly Progress</span>
                          <span className="text-xs text-emerald-400">+18.2%</span>
                        </div>
                        <div className="h-12 flex items-end gap-1">
                          {[35, 48, 40, 60, 55, 70, 65, 90, 85, 75, 80, 95].map((height, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ 
                                delay: 1.3 + (i * 0.05), 
                                duration: 0.7,
                                ease: "easeOut" 
                              }}
                            ></motion.div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-emerald-400">Jan</span>
                          <span className="text-xs text-emerald-400">Dec</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="mt-16 flex flex-col items-center"
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
                      Platform Features
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    Designed for efficiency, built for impact
                  </h2>
                  <p className="text-lg text-gray-600">
                    Our platform empowers DSWD staff with the tools they need to effectively manage sustainable livelihood programs
                  </p>
                </motion.div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={<Code />}
                    title="Developer Friendly"
                    description="Built with modern technologies for seamless integration and development experience."
                    gradient="from-blue-500 to-indigo-600"
                    delay={0}
                  />
                  
                  <FeatureCard 
                    icon={<Settings />}
                    title="Highly Configurable"
                    description="Customize and adapt the system to meet your specific needs and requirements."
                    gradient="from-emerald-500 to-teal-600"
                    delay={0.2}
                  />
                  
                  <FeatureCard 
                    icon={<Shield />}
                    title="Secure & Reliable"
                    description="Built with security in mind, ensuring your data is protected and always available."
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
                      <h3 className="text-2xl font-bold mb-6 text-emerald-800">Why choose our platform?</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Real-time Data Analytics", description: "Access up-to-date information and insights to make informed decisions" },
                          { title: "Seamless Collaboration", description: "Connect teams across departments for better coordination" },
                          { title: "Scalable Infrastructure", description: "Grows with your needs from local to national implementation" },
                          { title: "Responsive Support", description: "24/7 assistance from our dedicated support team" }
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
                              <div className="text-emerald-800 font-medium">System Status</div>
                              <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                Active
                              </div>
                            </div>
                            <div className="space-y-3">
                              {[
                                { name: "Database", status: 100 },
                                { name: "API Services", status: 99 },
                                { name: "Web Portal", status: 100 },
                                { name: "Mobile App", status: 97 }
                              ].map((service) => (
                                <div key={service.name}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{service.name}</span>
                                    <span className="text-emerald-800 font-medium">{service.status}%</span>
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
                            <div className="text-gray-500">Updated 2 minutes ago</div>
                            <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                              <span>View details</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
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
                      Platform Users
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <p className="text-slate-700 mb-8 text-lg">
                      The DSWD Sustanable Livelihood Program - Proposal System
                      serves various stakeholders involved in social welfare
                      programs:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          DSWD Administrators
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Manage overall system configuration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Create and manage user accounts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Generate comprehensive reports</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Oversee program implementation nationwide
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Manage system security and access controls
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Inventory Managers
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Track and manage inventory items</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Process incoming and outgoing stock</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Monitor stock levels and alerts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Conduct inventory audits and reconciliation
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Generate inventory forecasts and reports
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 transition-all hover:shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-sky-800">
                          Program Coordinators
                        </h3>
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Manage participants information</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Process disbursement requests</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Track program implementation</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>Coordinate with local government units</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-sky-500 mr-2 text-lg">•</span>
                            <span>
                              Facilitate participants training and support
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
                            <strong>Note:</strong> All users must complete
                            mandatory security training and sign confidentiality
                            agreements before accessing the system. User
                            activities are logged for security and audit
                            purposes.
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
                            For DSWD Staff
                          </h3>
                          <ol className="space-y-4 text-slate-700 list-decimal pl-5">
                            <li>
                              Submit an account request through your department
                              head
                            </li>
                            <li>
                              Complete the user registration form with your
                              official DSWD email
                            </li>
                            <li>
                              Await approval from the system administrator
                            </li>
                            <li>
                              Receive account credentials via your official
                              email
                            </li>
                            <li>
                              Complete mandatory system training before full
                              access
                            </li>
                          </ol>
                        </div>

                        <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 flex-1 transition-all hover:shadow-md">
                          <h3 className="font-bold text-lg mb-4 text-sky-800">
                            For Partner Agencies
                          </h3>
                          <ol className="space-y-4 text-slate-700 list-decimal pl-5">
                            <li>
                              Submit an official letter of request to the DSWD
                              SWCF office
                            </li>
                            <li>
                              Complete the partner agency registration form
                            </li>
                            <li>
                              Provide required documentation for verification
                            </li>
                            <li>
                              Attend orientation on system usage and protocols
                            </li>
                            <li>
                              Receive limited access credentials based on
                              partnership agreement
                            </li>
                          </ol>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-8 rounded-xl border border-sky-100">
                        <h3 className="font-bold text-xl mb-6 text-sky-800 text-center">
                          Account Approval Process
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <div className="w-14 h-14 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                              <span className="text-white font-bold text-xl">
                                1
                              </span>
                            </div>
                            <h4 className="font-semibold text-sky-800 mb-2">
                              Request Submission
                            </h4>
                            <p className="text-sm text-slate-600">
                              Submit request with required documentation
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <div className="w-14 h-14 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                              <span className="text-white font-bold text-xl">
                                2
                              </span>
                            </div>
                            <h4 className="font-semibold text-sky-800 mb-2">
                              Verification
                            </h4>
                            <p className="text-sm text-slate-600">
                              Information and eligibility verification
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <div className="w-14 h-14 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                              <span className="text-white font-bold text-xl">
                                3
                              </span>
                            </div>
                            <h4 className="font-semibold text-sky-800 mb-2">
                              Approval
                            </h4>
                            <p className="text-sm text-slate-600">
                              Review and approval by system administrator
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <div className="w-14 h-14 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                              <span className="text-white font-bold text-xl">
                                4
                              </span>
                            </div>
                            <h4 className="font-semibold text-sky-800 mb-2">
                              Account Creation
                            </h4>
                            <p className="text-sm text-slate-600">
                              Account setup and credential delivery
                            </p>
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
                              <strong>Important:</strong> Account creation is
                              strictly controlled for security purposes.
                              Self-registration is not available. All accounts
                              must be authorized by the DSWD SLP-PS
                              administration.
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

                {/* FAQs */}
                <div id="faqs" className="scroll-mt-24">
                  <div className="flex items-center mb-10">
                    <div className="bg-sky-100 p-3 rounded-full mr-4">
                      <HelpCircle className="w-7 h-7 text-sky-700" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="space-y-6 max-w-4xl mx-auto">
                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          How do I request an account for the DSWD SLP-PS
                          system?
                        </h3>
                        <p className="text-slate-700">
                          DSWD staff should submit a request through their
                          department head. Partner agencies need to send an
                          official letter to the DSWD SLP-PS office.
                          Self-registration is not available for security
                          reasons.
                        </p>
                      </div>

                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          What should I do if I forgot my password?
                        </h3>
                        <p className="text-slate-700">
                          Click on the "Forgot Password" link on the login page.
                          You will receive password reset instructions on your
                          registered email. If you cannot access your email,
                          contact the system administrator.
                        </p>
                      </div>

                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          How do I report technical issues with the system?
                        </h3>
                        <p className="text-slate-700">
                          For technical issues, contact the DSWD SLP-PS support
                          team via email at support@dswdswcf.gov.ph or call the
                          helpdesk at (02) 8931-8101. Please provide detailed
                          information about the issue.
                        </p>
                      </div>

                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          Can I access the system outside the DSWD network?
                        </h3>
                        <p className="text-slate-700">
                          Yes, the system is accessible via the internet, but
                          you must use secure, authorized devices and
                          connections. For security reasons, some functions may
                          be limited when accessing from external networks.
                        </p>
                      </div>

                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          How often is inventory data updated in the system?
                        </h3>
                        <p className="text-slate-700">
                          Inventory data is updated in real-time as transactions
                          occur. Stock levels, disbursements, and other
                          inventory movements are reflected immediately to
                          ensure accurate reporting and decision-making.
                        </p>
                      </div>

                      <div className="border-b border-slate-200 pb-5">
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          What training is available for new users?
                        </h3>
                        <p className="text-slate-700">
                          New users must complete mandatory system training
                          before gaining full access. Training sessions are
                          conducted monthly, and additional resources including
                          user manuals and video tutorials are available in the
                          Help section.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3 text-sky-800">
                          Is the system available in multiple languages?
                        </h3>
                        <p className="text-slate-700">
                          Currently, the system interface is available in
                          English and Filipino. Regional language support is
                          under development and will be available in future
                          updates to better serve local communities.
                        </p>
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
                            onClick={() => router.push("/login")}
                            className="bg-white hover:bg-emerald-50 text-emerald-800 font-medium py-3.5 px-8 rounded-xl text-base shadow-xl transition-all hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2 group"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>Login to System</span>
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
                        { name: "FAQs", href: "#faqs" },
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