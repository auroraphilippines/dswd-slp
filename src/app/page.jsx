"use client"
import { useState, useEffect } from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Info,
  Target,
  Clock,
  Users,
  Compass,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Settings,
  Shield,
  ArrowUpRight,
  Layers,
  LifeBuoy,
  BookOpen,
  Award,
  Eye,
  Heart,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hero", element: document.querySelector("section") },
        { id: "about-program", element: document.getElementById("about-program") },
        { id: "program-modalities", element: document.getElementById("program-modalities") },
        { id: "mission-vision", element: document.getElementById("mission-vision") },
        { id: "team", element: document.getElementById("team") },
      ]

      const scrollPosition = window.scrollY + 100 // Offset to trigger slightly before reaching section

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element) {
          const offsetTop = section.element.offsetTop
          if (scrollPosition >= offsetTop) {
            if (activeSection !== section.id) {
              setActiveSection(section.id)
            }
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial call to set active section on load
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection])

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = (id) => {
    setMobileMenuOpen(false)
    if (id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
                    <img src="/images/DSWD.png" alt="DSWD Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-emerald-950">DSWD SLP-PS</h1>
                    <p className="text-xs text-emerald-600">Sustainable Livelihood Program</p>
                  </div>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                  <motion.div
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
                  >
                    <MainNavLink
                      href="#hero"
                      icon={<Home className="w-5 h-5" />}
                      text="Home"
                      isActive={activeSection === "hero"}
                    />
                    <MainNavLink
                      href="#about-program"
                      icon={<Info className="w-5 h-5" />}
                      text="About"
                      isActive={activeSection === "about-program"}
                    />
                    <MainNavLink
                      href="#program-modalities"
                      icon={<Layers className="w-5 h-5" />}
                      text="Program"
                      isActive={activeSection === "program-modalities"}
                    />
                    <MainNavLink
                      href="#mission-vision"
                      icon={<Target className="w-5 h-5" />}
                      text="Principles"
                      isActive={activeSection === "mission-vision"}
                    />

                    <MainNavLink
                      href="#team"
                      icon={<Users className="w-5 h-5" />}
                      text="Team"
                      isActive={activeSection === "team"}
                    />
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
                          <span className="font-bold text-emerald-900">DSWD SLP-PS</span>
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
                            href="#hero"
                            icon={<Home className="mr-3 h-5 w-5" />}
                            text="Home"
                            onClick={() => handleNavLinkClick("hero")}
                            isActive={activeSection === "hero"}
                          />
                          <MobileNavLink
                            href="#about-program"
                            icon={<Info className="mr-3 h-5 w-5" />}
                            text="About"
                            onClick={() => handleNavLinkClick("about-program")}
                            isActive={activeSection === "about-program"}
                          />
                          <MobileNavLink
                            href="#program-modalities"
                            icon={<Layers className="mr-3 h-5 w-5" />}
                            text="Program"
                            onClick={() => handleNavLinkClick("program-modalities")}
                            isActive={activeSection === "program-modalities"}
                          />
                          <MobileNavLink
                            href="#mission-vision"
                            icon={<Target className="mr-3 h-5 w-5" />}
                            text="Principles"
                            onClick={() => handleNavLinkClick("mission-vision")}
                            isActive={activeSection === "mission-vision"}
                          />
                          <MobileNavLink
                            href="#history"
                            icon={<Clock className="mr-3 h-5 w-5" />}
                            text="History"
                            onClick={() => handleNavLinkClick("history")}
                            isActive={activeSection === "history"}
                          />
                          <MobileNavLink
                            href="#team"
                            icon={<Users className="mr-3 h-5 w-5" />}
                            text="Team"
                            onClick={() => handleNavLinkClick("team")}
                            isActive={activeSection === "team"}
                          />
                        </nav>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section id="hero" className="relative py-24 md:py-32 overflow-hidden">
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                    repeat: Number.POSITIVE_INFINITY,
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
                      Empowering communities through sustainable livelihood initiatives designed to create opportunities
                      for growth and self-reliance.
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
                        <span>Login</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            duration: 1.5,
                            repeatDelay: 2,
                          }}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.span>
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
                          repeat: Number.POSITIVE_INFINITY,
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
                        repeat: Number.POSITIVE_INFINITY,
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
                            Provides access to micro-financing for microenterprise development through the provision of
                            seed capital fund in the amount of P10,000 (individual) or up to P15,000 per participant
                            (group).
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
                            Facilitates opportunities for wage employment through pre-employment assistance such as
                            skills training, career guidance and coaching, and job referral with TESDA, DOLE, and
                            partners.
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
                            SLP organizes target participants in groups called SLP Associations (SLPAs) to improve
                            program delivery efficiency and facilitate sustainable interventions.
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

            {/* About Program Section */}
            <section id="about-program" className="py-20 bg-white">
              <div className="container mx-auto px-4">
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
                      About the Program
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    The Sustainable Livelihood Program
                  </h2>
                  <p className="text-lg text-gray-600">
                    Empowering lives and transforming communities through sustainable livelihood opportunities
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">What is SLP?</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      The Sustainable Livelihood Program (SLP) is a capacity-building program aimed at providing viable
                      interventions and support to identified poor, vulnerable, and marginalized households and
                      communities. It helps improve the program participants' socio-economic conditions by accessing and
                      acquiring necessary assets to engage in and maintain thriving livelihoods.
                    </p>
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      As a component of the Convergence Strategy, the program aims to serve the beneficiaries of the
                      Pantawid Pamilyang Pilipino Program (4Ps), hoping to sustain and expand beyond the five-year
                      intervention the socio-economic benefits gained.
                    </p>

                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                      <h4 className="font-semibold text-emerald-800 mb-4">
                        SLP is implemented through a two-track program:
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <Target className="w-5 h-5" />
                            </div>
                            <h5 className="font-semibold text-emerald-700">Microenterprise Development</h5>
                          </div>
                          <p className="text-sm text-gray-600">
                            Supports micro-enterprises in becoming organizationally and economically viable.
                          </p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <Users className="w-5 h-5" />
                            </div>
                            <h5 className="font-semibold text-emerald-700">Employment Facilitation</h5>
                          </div>
                          <p className="text-sm text-gray-600">
                            Assists participants to access appropriate employment opportunities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl"></div>
                    <div className="relative rounded-xl overflow-hidden shadow-xl">
                      <img
                        src="/images/SLP-participants.jpg"
                        alt="SLP Program Participants"
                        className="w-full h-60 object-cover"
                      />
                      <div className="bg-white p-8">
                        <h3 className="text-xl font-bold text-emerald-800 mb-4">Program Objectives</h3>
                        <ul className="space-y-3">
                          {[
                            "Enhance human assets through technical-vocational and life skills training",
                            "Extend social assets through membership and participation in SLP associations",
                            "Expand financial assets through seed capital and access to credit facilities",
                            "Enrich natural assets that protect and contribute to community livelihoods",
                            "Establish physical assets for more efficient livelihood operations",
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                            >
                              <div className="min-w-[24px] h-6 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                </div>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Program Modalities Section */}
            <section id="program-modalities" className="py-20 bg-emerald-50">
              <div className="container mx-auto px-4">
                <motion.div
                  className="mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-emerald-800 mb-8 text-center">Program Modalities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: "Seed Capital Fund",
                        icon: <Layers className="w-6 h-6" />,
                        description:
                          "A start-up capital for the purchase of tools, raw materials, common service facilities and other assets needed in starting or expanding a microenterprise",
                      },
                      {
                        title: "Cash-for-Building-Livelihood Assets",
                        icon: <Shield className="w-6 h-6" />,
                        description:
                          "A grant for labor-intensive projects to build, rebuild and/or protect natural and physical assets necessary for microenterprises",
                      },
                      {
                        title: "Skills Training Fund",
                        icon: <Award className="w-6 h-6" />,
                        description:
                          "A capacity-building assistance for the acquisition of technical and vocational knowledge and skills",
                      },
                      {
                        title: "Employment Assistance Fund",
                        icon: <Compass className="w-6 h-6" />,
                        description:
                          "A grant to acquire employment requirements and access appropriate employment opportunities",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-emerald-800 mb-3">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Mission Vision Section */}
            <section id="mission-vision" className="py-20 bg-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 pointer-events-none opacity-70">
                <div className="absolute -left-20 top-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -right-20 bottom-10 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
              </div>

              <div className="container mx-auto px-4 relative">
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
                      Our Guiding Principles
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Mission, Vision & Core Values</h2>
                  <p className="text-lg text-gray-600">The foundation that guides all our initiatives and programs</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <motion.div
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>

                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Eye className="w-5 h-5" />
                        </span>
                        Vision
                      </h3>
                      <div className="pl-2 border-l-4 border-white/30">
                        <p className="text-white/90 mb-6 leading-relaxed">
                          An empowered society where the poor, vulnerable, and disadvantaged sectors have immediate and
                          equitable access to opportunities for an improved quality of life.
                        </p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mt-6">
                          <h4 className="font-semibold mb-2 text-white">2028 Vision Base Camp</h4>
                          <p className="text-white/90">
                            DSWD is a leader in transformation social protection and social welfare system in the
                            Indo-Pacific region.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-2xl p-8 shadow-xl border border-emerald-100 relative overflow-hidden"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl"></div>

                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-6 text-emerald-800 flex items-center gap-3">
                        <span className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Target className="w-5 h-5 text-emerald-600" />
                        </span>
                        Mission
                      </h3>
                      <div className="pl-2 border-l-4 border-emerald-200">
                        <p className="text-gray-700 leading-relaxed">
                          As the authority in the Social Welfare and Development sector, the DSWD develops, implements,
                          enables, and coordinates SWD policies and programs for and with the poor, vulnerable, and
                          disadvantage.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-emerald-800 mb-10 text-center">Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Maagap at Mapagkalinga",
                        description:
                          "Emphasizes empathy, understanding, and providing care to individuals, families, and communities in need. It reflects the DSWD's recognition of the inherent worth and dignity of every person and their right to be treated with kindness, respect, and support.",
                        icon: <Heart className="w-6 h-6" />,
                      },
                      {
                        title: "Matapat",
                        description:
                          "Upholds honest, ethical behavior, and a strong sense of moral principles within the organization. It involves adhering to a set of values and principles that guide the actions and decisions of the DSWD workforce, ensuring that they act with transparency, accountability and professionalism.",
                        icon: <Shield className="w-6 h-6" />,
                      },
                      {
                        title: "Mahusay",
                        description:
                          "Provides high-quality, efficient, and effective services to individuals, families, and communities in need. It encompasses a dedication to delivering services anchored in social justice, while also striving for continuous improvement and innovation.",
                        icon: <Award className="w-6 h-6" />,
                      },
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {value.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-emerald-800 mb-3">{value.title}</h4>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="text-center mt-12">
                  <motion.div
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <p className="text-emerald-600 font-medium text-lg">#BawatBuhayMayHalagaSaDSWD</p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Our Team */}
            <section id="team" className="py-20 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute -left-20 top-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -right-20 bottom-10 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-60"></div>
              </div>

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  className="max-w-3xl mx-auto text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-block mb-4">
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium border border-emerald-100">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Meet Our Team</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">The People Behind SLP</h2>
                  <p className="text-lg text-gray-600">
                    Our dedicated team of professionals is committed to improving the lives of vulnerable Filipinos
                    through sustainable livelihood opportunities.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-16">
                  {/* Leadership */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="text-center mb-10">
                      <h3 className="inline-block text-xl font-bold text-emerald-800 px-6 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        Leadership
                      </h3>
                    </div>

                    <div className="flex justify-center">
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-lg"></div>
                        <div className="relative flex flex-col items-center">
                          <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-xl">
                            <img
                              src="/images/margie.jpg"
                              alt="Margie Y. Nortez"
                              className="w-full h-full rounded-full object-cover border-4 border-white"
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <h4 className="text-xl font-bold text-gray-900">Margie Y. Nortez</h4>
                            <p className="text-emerald-600 font-medium">Provincial Coordinator</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Management Team */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="text-center mb-10">
                      <h3 className="inline-block text-xl font-bold text-emerald-800 px-6 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        Management Team
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
                      {[
                        {
                          name: "Marlon Vito L. Torio",
                          title: "Provincial Monitoring and Evaluation Officer",
                          image: "/images/marvit.jpg",
                          delay: 0.1,
                        },
                        {
                          name: "Kristel Joy N. De Leon",
                          title: "Capability Building & Provincial Partnership Officer",
                          image: "/images/kristel.jpg",
                          delay: 0.2,
                        },
                      ].map((member, index) => (
                        <motion.div
                          key={index}
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: member.delay }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur-md"></div>
                          <div className="relative bg-white rounded-xl p-6 shadow-md border border-emerald-100 flex flex-col items-center max-w-xs">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg -mt-14">
                              <img
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover border-4 border-white"
                              />
                            </div>
                            <div className="mt-4 text-center">
                              <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                              <p className="text-emerald-600 font-medium text-sm">{member.title}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Implementation Team */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="text-center mb-10">
                      <h3 className="inline-block text-xl font-bold text-emerald-800 px-6 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        Implementation Team
                      </h3>
                    </div>

                    {/* First row - 4 team members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                      {[
                        {
                          name: "Jayson H. Pasion",
                          title: "Implementing Project Development Officer",
                          image: "/images/jayson.jpg",
                          delay: 0.1,
                        },
                        {
                          name: "Michael G. Olila",
                          title: "Implementing Project Development Officer",
                          image: "/images/michael.jpg",
                          delay: 0.2,
                        },
                        {
                          name: "Gina T. Bustillos",
                          title: "Monitoring Project Development Officer",
                          image: "/images/gina.jpg",
                          delay: 0.3,
                        },
                        {
                          name: "Edward R. Parrocha",
                          title: "Monitoring Project Development Officer",
                          image: "/images/avatar8.png",
                          delay: 0.4,
                        },
                      ].map((member, index) => (
                        <motion.div
                          key={index}
                          className="w-full"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: member.delay }}
                          whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                          <div className="bg-white rounded-2xl border border-emerald-300 p-4 h-[180px] flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-emerald-50 hover:shadow-emerald-400/60">
                            <div className="flex flex-col items-center">
                              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 overflow-hidden">
                                <img
                                  src={member.image || "/placeholder.svg?height=96&width=96"}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="mt-4 text-center w-full">
                                <h4 className="text-lg font-bold text-gray-900 truncate">{member.name}</h4>
                                <p className="text-emerald-500 text-sm truncate">{member.title}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Second row - last 3 team members */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-8">
                      {[
                        {
                          name: "Jan Marvin C. Sagud",
                          title: "Monitoring Project Development Officer",
                          image: "/images/marvin.jpg",
                          delay: 0.5,
                        },
                        {
                          name: "Edmar Pascual Rin",
                          title: "Front-End & Back-End Developer",
                          image: "/images/avatar9.png",
                          delay: 0.6,
                        },
                        {
                          name: "Christian Joseph Marigmen",
                          title: "Front-End Developer",
                          image: "/images/avatar11.png",
                          delay: 0.7,
                        },
                      ].map((member, index) => (
                        <motion.div
                          key={index}
                          className="w-full"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: member.delay }}
                          whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                          <div className="bg-white rounded-2xl border border-emerald-300 p-4 h-[180px] flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-emerald-50 hover:shadow-emerald-400/60">
                            <div className="flex flex-col items-center">
                              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 overflow-hidden">
                                <img
                                  src={member.image || "/placeholder.svg?height=96&width=96"}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="mt-4 text-center w-full">
                                <h4 className="text-lg font-bold text-gray-900 truncate">{member.name}</h4>
                                <p className="text-emerald-500 text-sm truncate">{member.title}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
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
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <motion.div
                  className="absolute -left-1/4 bottom-0 w-1/2 h-1/2 bg-gradient-to-r from-emerald-500/10 to-teal-500/20 blur-3xl rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
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
                          Access the DSWD Sustainable Livelihood Program - Proposal System to manage inventory, process
                          disbursements, and support participants.
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
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
                        <p className="text-xs text-gray-400">Sustainable Livelihood Program</p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6">
                      The DSWD Sustainable Livelihood Program - Proposal System is designed to efficiently manage
                      inventory, track disbursements, and support participants through integrated digital solutions.
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
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zm-9 2a1 1 0 100 2 1 1 0 000-2zm0-10a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
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
                        <span>DSWD Provincial Extension Office - Aurora, Baler, Aurora</span>
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
                        { name: "Home", href: "#hero" },
                        { name: "About", href: "#about-program" },
                        { name: "Program", href: "#program-modalities" },
                        { name: "Principles", href: "#mission-vision" },
                        { name: "Team", href: "#team" },
                        { name: "DSWD Official Website", href: "https://www.dswd.gov.ph" },
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
                </div>

                <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
                  <p>
                    &copy; {new Date().getFullYear()} Department of Social Welfare and Development. All rights reserved.
                  </p>
                  <p className="mt-2 flex justify-center gap-4">
                    <a href="#" className="hover:text-emerald-400 transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">
                      Accessibility
                    </a>
                  </p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
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
      <motion.span className="text-emerald-600" whileHover={{ rotate: [-5, 5, 0] }} transition={{ duration: 0.5 }}>
        {icon}
      </motion.span>
      <span>{text}</span>
    </motion.a>
  )
}

// Navigation link component for mobile
function MobileNavLinkComponent({ href, icon, text, onClick, isActive = false }) {
  return (
    <motion.a
      href={href}
      className={`px-4 py-3 text-base font-medium rounded-xl flex items-center relative overflow-hidden
        ${isActive ? "text-emerald-600" : "text-emerald-700"}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background animation */}
      <motion.div
        className={`absolute inset-0 ${isActive ? "bg-emerald-100" : "bg-transparent"} z-0`}
        initial={false}
        whileHover={{
          backgroundColor: "rgba(167, 243, 208, 0.2)",
          x: 5,
          transition: { duration: 0.2 },
        }}
      />

      {/* Left border animation */}
      <motion.div
        className={`absolute left-0 top-0 bottom-0 w-1 ${isActive ? "bg-emerald-500 h-full" : "bg-emerald-300 h-0"} z-0`}
        initial={false}
        whileHover={{ height: "100%", transition: { duration: 0.3 } }}
      />

      <div className="flex items-center relative z-10">
        <motion.span whileHover={{ scale: 1.2, transition: { duration: 0.3 } }} className="mr-3">
          {icon}
        </motion.span>
        <span>{text}</span>
      </div>
    </motion.a>
  )
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

      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <motion.div whileHover={{ rotate: [-10, 10, 0] }} transition={{ duration: 0.5 }} className="w-6 h-6">
          {icon}
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">{title}</h3>

      <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{description}</p>
    </motion.div>
  )
}

// Main Navigation link component for desktop header
function MainNavLink({ href, icon, text, isActive = false }) {
  return (
    <motion.a
      href={href}
      className={`px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 relative overflow-hidden group
        ${isActive ? "text-emerald-600" : "text-emerald-700"}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Background animation */}
      <motion.div
        className={`absolute inset-0 rounded-md ${isActive ? "bg-emerald-50" : "bg-transparent"} z-0`}
        initial={false}
        whileHover={{
          backgroundColor: "rgba(167, 243, 208, 0.2)",
          transition: { duration: 0.2 },
        }}
      />

      {/* Bottom border animation */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${isActive ? "bg-emerald-500 w-full" : "bg-emerald-300 w-0"} z-0`}
        initial={false}
        whileHover={{ width: "100%", transition: { duration: 0.3 } }}
      />

      {/* Icon with animation */}
      <motion.span
        className={`${isActive ? "text-emerald-500" : "text-emerald-600"} relative z-10`}
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2, transition: { duration: 0.5 } }}
      >
        {icon}
      </motion.span>

      {/* Text */}
      <span className="relative z-10">{text}</span>
    </motion.a>
  )
}

const MobileNavLink = MobileNavLinkComponent

// --- Gradient Org Chart Data and Component ---
const orgChartCloudData = {
  name: "Margie Y. Nortez",
  title: "Provincial Coordinator",
  image: "/images/margie.jpg",
  color: "from-orange-400 via-pink-500 to-pink-600",
  children: [
    {
      name: "Marlon Vito L. Torio",
      title: "Provincial Monitoring and Evaluation Officer",
      image: "/images/marvit.jpg",
      color: "from-red-400 via-pink-500 to-pink-600",
      children: [
        {
          name: "Jayson H. Pasion",
          title: "Implementing Project Development Officer",
          image: "/images/jayson.jpg",
          color: "from-orange-400 to-yellow-400",
          children: [
            {
              name: "Edmar Pascual Rin",
              title: "Front-End & Back-End Developer",
              image: "/images/avatar9.png",
              color: "from-teal-400 to-emerald-400",
              style: { marginLeft: "8rem" },
            },
          ],
        },
        {
          name: "Michael G. Olila",
          title: "Implementing Project Development Officer",
          image: "/images/michael.jpg",
          color: "from-orange-400 to-yellow-400",
          children: [
            {
              name: "Jan Marvin C. Sagud",
              title: "Monitoring Project Development Officer",
              image: "/images/marvin.jpg",
              color: "from-teal-400 to-emerald-400",
            },
          ],
        },
      ],
    },
    {
      name: "Kristel Joy N. De Leon",
      title: "Capability Building & Provincial Partnership Officer",
      image: "/images/kristel.jpg",
      color: "from-red-400 via-pink-500 to-pink-600",
      children: [
        {
          name: "Gina T. Bustillos",
          title: "Monitoring Project Development Officer",
          image: "/images/gina.jpg",
          color: "from-blue-400 to-blue-600",
          children: [
            {
              name: "Christian Joseph Marigmen",
              title: "Front-End Developer",
              image: "/images/avatar11.png",
              color: "from-teal-400 to-emerald-400",
            },
          ],
        },
        {
          name: "Edward R. Parrocha",
          title: "Monitoring Project Development Officer",
          image: "/images/avatar8.png",
          color: "from-blue-400 to-blue-600",
        },
      ],
    },
  ],
}

function OrgChartCloud({ node, level = 0, isLast = false }) {
  const renderProfileImage = () => (
    <div className="z-10">
      <div className="mx-auto -mb-8 w-24 h-24 flex items-center justify-center">
        <div
          className="bg-gradient-to-tr p-1 rounded-full shadow-lg"
          style={{ background: "linear-gradient(135deg, #ff9800 0%, #e040fb 100%)" }}
        >
          <img
            src={node.image || "/placeholder.svg"}
            alt={node.name}
            className="w-22 h-22 rounded-full object-cover border-4 border-white"
          />
        </div>
      </div>
    </div>
  )

  const renderCloudCard = () => (
    <div
      className={`
        relative z-0 -mt-6 px-6 pt-10 pb-4 
        min-w-[200px] max-w-[240px] 
        flex flex-col items-center shadow-xl 
        rounded-b-[60px] rounded-t-[40px] 
        bg-gradient-to-r ${node.color}
      `}
      style={{ borderRadius: "40px 40px 60px 60px/40px 40px 60px 60px" }}
    >
      <h4 className="text-white text-2xl font-extrabold text-center drop-shadow-lg bg-black/30 px-3 py-1 rounded-md">
        {node.name}
      </h4>
      <p className="text-white text-xs text-center opacity-90 mb-1 drop-shadow-sm">{node.title}</p>
      <div className="h-1 w-12 bg-white/40 rounded-full my-2" />
    </div>
  )

  const renderChildrenConnectors = () => {
    if (!node.children?.length) return null

    return (
      <div className="flex items-center justify-center relative h-8">{/* Empty container to maintain spacing */}</div>
    )
  }

  const renderChildren = () => {
    if (!node.children?.length) return null

    return (
      <div className="flex flex-col items-center">
        {renderChildrenConnectors()}
        <div className="flex justify-center gap-12 mt-0.5">
          {node.children.map((child, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center ${
                child.name === "Edmar Pascual Rin" ||
                child.name === "Jan Marvin C. Sagud" ||
                child.name === "Christian Joseph Marigmen"
                  ? "translate-x-35"
                  : ""
              }`}
            >
              <OrgChartCloud node={child} level={level + 1} isLast={idx === node.children.length - 1} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center relative">
      {renderProfileImage()}  
      {renderCloudCard()}
      {renderChildren()}
    </div>
  )
}
// --- End Gradient Org Chart ---
