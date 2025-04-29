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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds for the animation

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = (id) => {
    setMobileMenuOpen(false);
    // If we need to scroll to an element
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-sky-800 to-sky-900 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-40 h-40 mx-auto mb-4 relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-sky-300 opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <img
                  src="/images/SLP.png"
                  alt="SLP Logo"
                  className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl font-bold text-white"
              >
                DSWD SLP-PS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-white mt-2"
              >
                Sustainable Livelihood Program - Proposal System
              </motion.p>
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
            <header className="bg-white shadow-sm sticky top-0 z-40">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/SLP.png"
                      alt="SLP Logo"
                      className="w-10 h-10 rounded-full object-cover border-2 border-sky-100"
                    />
                    <img
                      src="/images/DSWD.png"
                      alt="DSWD Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-sky-900">
                      DSWD SLP-PS
                    </h1>
                    <p className="text-xs text-slate-500">
                      Sustainable Livelihood Program
                    </p>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <a
                    href="#platform-users"
                    className="text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm"
                  >
                    Users
                  </a>
                  <a
                    href="#account-creation"
                    className="text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm"
                  >
                    Accounts
                  </a>
                  <a
                    href="#service-access"
                    className="text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm"
                  >
                    Services
                  </a>
                  <a
                    href="#faqs"
                    className="text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm"
                  >
                    FAQs
                  </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
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
                        damping: 25,
                        stiffness: 300,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src="/images/SLP.png"
                            alt="SLP Logo"
                            className="w-8 h-8 rounded-full object-cover border-2 border-sky-100"
                          />
                          <span className="font-bold text-sky-900">
                            DSWD SLP-PS
                          </span>
                        </div>
                        <button
                          className="p-2 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          onClick={() => setMobileMenuOpen(false)}
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto py-4">
                        <nav className="flex flex-col space-y-1 px-2">
                          <a
                            href="#platform-users"
                            className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors"
                            onClick={() => handleNavLinkClick("platform-users")}
                          >
                            <div className="flex items-center">
                              <Users className="mr-3 h-5 w-5 text-slate-500" />
                              <span>Platform Users</span>
                            </div>
                          </a>
                          <a
                            href="#account-creation"
                            className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors"
                            onClick={() =>
                              handleNavLinkClick("account-creation")
                            }
                          >
                            <div className="flex items-center">
                              <UserPlus className="mr-3 h-5 w-5 text-slate-500" />
                              <span>Account Creation</span>
                            </div>
                          </a>
                          <a
                            href="#service-access"
                            className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors"
                            onClick={() => handleNavLinkClick("service-access")}
                          >
                            <div className="flex items-center">
                              <Compass className="mr-3 h-5 w-5 text-slate-500" />
                              <span>Service Access</span>
                            </div>
                          </a>
                          <a
                            href="#faqs"
                            className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors"
                            onClick={() => handleNavLinkClick("faqs")}
                          >
                            <div className="flex items-center">
                              <HelpCircle className="mr-3 h-5 w-5 text-slate-500" />
                              <span>FAQs</span>
                            </div>
                          </a>
                        </nav>
                      </div>
                      <div className="p-4 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/login");
                          }}
                          className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-4 rounded-lg text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Login to System
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/about");
                          }}
                          className="w-full mt-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Learn More
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* Hero Section with Background Image */}
            <section
              className="relative text-white py-24 md:py-32 bg-cover bg-center bg-no-repeat overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('/images/DSWD-RO3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-indigo-900/80"></div>
              <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto"
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    Welcome to DSWD Sustainable Livelihood Program - Proposal
                    System
                  </h2>
                  <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-slate-200">
                    Manage inventory, track disbursements, and support
                    participants through our integrated platform designed to
                    strengthen communities across the Philippines
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => router.push("/login")}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 px-8 rounded-lg text-base shadow-lg transition-all hover:shadow-amber-500/20 focus:outline-none focus:ring-4 focus:ring-amber-500/30 w-full sm:w-auto"
                    >
                      Login to System
                    </button>
                    <button
                      onClick={() => router.push("/about")}
                      className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg text-base shadow-lg transition-all hover:shadow-white/10 focus:outline-none focus:ring-4 focus:ring-white/20 w-full sm:w-auto mt-3 sm:mt-0"
                    >
                      Learn More
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-16"
                >
                  <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-amber-400" />
                  <p className="text-sm mt-2 text-slate-300">
                    Scroll to learn more
                  </p>
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
            <section className="bg-gradient-to-r from-sky-800 to-indigo-900 text-white py-20">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg mb-10 max-w-2xl mx-auto text-slate-200">
                  Access the DSWD Sustainable Livelihood Program - Proposal
                  System to manage inventory, process disbursements, and support
                  participants.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 px-8 rounded-lg text-base shadow-lg transition-all hover:shadow-amber-500/20 focus:outline-none focus:ring-4 focus:ring-amber-500/30 w-full sm:w-auto"
                  >
                    Login to System
                  </button>
                  <button
                    onClick={() => router.push("/contact")}
                    className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg text-base shadow-lg transition-all hover:shadow-white/10 focus:outline-none focus:ring-4 focus:ring-white/20 w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 mr-3">
                        <img
                          src="/images/SLP.png"
                          alt="SLP Logo"
                          className="w-full h-full rounded-full object-cover border-2 border-sky-700"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">DSWD SLP-PS</h3>
                        <p className="text-xs text-slate-400">
                          Sustainable Livelihood Program - Proposal System
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-400">
                      The DSWD Sustainable Livelihood Program - Proposal System
                      is designed to efficiently manage inventory, track
                      disbursements, and support participants through integrated
                      digital solutions, empowering communities across the
                      Philippines.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-6 text-slate-200">
                      Contact Information
                    </h3>
                    <ul className="space-y-4 text-slate-400">
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-sky-400" />
                        <span>
                          DSWD Provincial Extension Office - Aurora, Baler,
                          Aurora
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Phone className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-sky-400" />
                        <span>(02) 8931-8101 to 07</span>
                      </li>
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-sky-400" />
                        <span>inquiry@dswd.gov.ph</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-sky-400" />
                        <span>Monday to Friday: 8:00 AM - 5:00 PM</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-6 text-slate-200">
                      Quick Links
                    </h3>
                    <ul className="space-y-3 text-slate-400">
                      <li>
                        <a
                          href="#platform-users"
                          className="hover:text-sky-400 transition-colors"
                        >
                          Platform Users
                        </a>
                      </li>
                      <li>
                        <a
                          href="#account-creation"
                          className="hover:text-sky-400 transition-colors"
                        >
                          Account Creation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#service-access"
                          className="hover:text-sky-400 transition-colors"
                        >
                          Service Access Guide
                        </a>
                      </li>
                      <li>
                        <a
                          href="#faqs"
                          className="hover:text-sky-400 transition-colors"
                        >
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.dswd.gov.ph"
                          className="hover:text-sky-400 transition-colors"
                        >
                          DSWD Official Website
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://fo3.dswd.gov.ph/slp/"
                          className="hover:text-sky-400 transition-colors"
                        >
                          Sustainable Livelihood Program
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-8 text-center text-slate-400 text-sm">
                  <p>
                    &copy; {new Date().getFullYear()} Department of Social
                    Welfare and Development. All rights reserved.
                  </p>
                  <p className="mt-2">
                    This system is for authorized users only. Unauthorized
                    access is prohibited.
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
