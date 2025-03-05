"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Compass,
  FileText,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "react-feather";
export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds for the animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-lime-300">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-[#0F4C81] z-50"
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
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.5,
                }}
                className="w-40 h-40 mx-auto mb-4"
              >
                <img
                  src="/images/SLP.png"
                  alt="SLP Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl font-bold text-white"
              >
                DSWD SLP-TIS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-white mt-2"
              >
                Sustainable Livelihood Program - Tracking Inventory System
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
            <header className="bg-[#0F4C81] text-white shadow-md">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-3">
                    <img
                      src="/images/SLP.png"
                      alt="SLP Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="w-13 h-13 mr-3">
                    <img
                      src="/images/DSWD.png"
                      alt="DSWD Logo"
                      className="w-full h-full square-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">DSWD SLP-TIS</h1>
                    <p className="text-xs">
                      Sustainable Livelihood Program - Tracking Inventory System
                    </p>
                  </div>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <a
                    href="#platform-users"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Users
                  </a>
                  <a
                    href="#account-creation"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Accounts
                  </a>
                  <a
                    href="#service-access"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Services
                  </a>
                  <a
                    href="#required-documents"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Documents
                  </a>
                  <a
                    href="#faqs"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    FAQs
                  </a>
                </nav>
              </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[#0F4C81] to-[#1A6BAD] text-white py-20 md:py-32">
              <div className="container mx-auto px-4 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-5xl font-bold mb-6"
                >
                  Welcome to DSWD Sustainable Livelihood Program - Tracking
                  Inventory System
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-lg md:text-xl mb-10 max-w-3xl mx-auto"
                >
                  Manage inventory, track disbursements, and support
                  beneficiaries through our integrated platform
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link href="/login">
                    <button className="bg-[#FFC612] hover:bg-[#FFD54F] text-[#0F4C81] font-bold py-4 px-8 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                      Login to System
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-16"
                >
                  <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
                  <p className="text-sm mt-2">Scroll to learn more</p>
                </motion.div>
              </div>
            </section>

            {/* Information Sections */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                {/* Platform Users */}
                <div id="platform-users" className="mb-20 scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <Users className="w-8 h-8 text-[#0F4C81] mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                      Platform Users
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <p className="text-gray-700 mb-6">
                      The DSWD Sustanable Livelihood Program - Tracking
                      Inventory System serves various stakeholders involved in
                      social welfare programs:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          DSWD Administrators
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Manage overall system configuration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Create and manage user accounts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Generate comprehensive reports</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Inventory Managers
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Track and manage inventory items</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Process incoming and outgoing stock</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Monitor stock levels and alerts</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Program Coordinators
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Manage beneficiary information</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Process disbursement requests</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Track program implementation</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Creation */}
                <div id="account-creation" className="mb-20 scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <UserPlus className="w-8 h-8 text-[#0F4C81] mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                      Account Creation
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <p className="text-gray-700 mb-6">
                      To access the DSWD Sustanable Livelihood Program -
                      Tracking Inventory System, you need to have an authorized
                      account:
                    </p>

                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg flex-1">
                          <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                            For DSWD Staff
                          </h3>
                          <ol className="space-y-4 text-gray-700 list-decimal pl-5">
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

                        <div className="bg-blue-50 p-6 rounded-lg flex-1">
                          <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                            For Partner Agencies
                          </h3>
                          <ol className="space-y-4 text-gray-700 list-decimal pl-5">
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

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
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
                            <p className="text-sm text-yellow-700">
                              <strong>Important:</strong> Account creation is
                              strictly controlled for security purposes.
                              Self-registration is not available. All accounts
                              must be authorized by the DSWD SLP-TIS
                              administration.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Access Guide */}
                <div id="service-access" className="mb-20 scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <Compass className="w-8 h-8 text-[#0F4C81] mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                      Service Access Guide
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <p className="text-gray-700 mb-6">
                      The DSWD Sustainable Livelihood Program - Tracking
                      Inventory System provides various services to support
                      social welfare programs:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Inventory Management
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Track and manage relief goods, supplies, and
                              equipment
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Monitor stock levels and receive low stock alerts
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate inventory reports and analytics
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Disbursement Processing
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Create and approve disbursement requests
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>Track disbursement status and delivery</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate disbursement reports for auditing
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Beneficiary Management
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Register and manage beneficiary information
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Track assistance provided to beneficiaries
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Generate beneficiary reports and statistics
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          Program Management
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Set up and configure social welfare programs
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Monitor program implementation and progress
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                            <span>Generate program performance reports</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-100 p-6 rounded-lg">
                      <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                        How to Access Services
                      </h3>
                      <ol className="space-y-4 text-gray-700 list-decimal pl-5">
                        <li>
                          Log in to the DSWD SLP-TIS system using your
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
                          For assistance, contact the DSWD SLP-TIS support team
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div id="required-documents" className="mb-20 scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <FileText className="w-8 h-8 text-[#0F4C81] mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                      Required Documents
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <p className="text-gray-700 mb-6">
                      Various documents are required for different processes
                      within the DSWD Sustainable Livelihood Program - Tracking
                      Inventory System:
                    </p>

                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          For Account Registration
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Official request letter from department head or
                              agency
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Valid government ID (e.g., DSWD ID, agency ID)
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Completed user registration form</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Signed confidentiality and data privacy agreement
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          For Inventory Management
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Purchase orders or donation receipts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Delivery receipts for incoming inventory
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Inventory transfer forms for internal movements
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Stock adjustment forms with proper justification
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          For Disbursement Processing
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Approved disbursement request form</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Beneficiary list with complete information
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Program implementation plan or disaster response
                              plan
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Proof of delivery and receipt by beneficiaries
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                          For Beneficiary Registration
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>Completed beneficiary registration form</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Valid ID or other identification document
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Proof of eligibility for the specific program
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#0F4C81] mr-2">•</span>
                            <span>
                              Signed consent for data collection and processing
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div id="faqs" className="scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <HelpCircle className="w-8 h-8 text-[#0F4C81] mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          How do I request an account for the DSWD SLP-TIS
                          system?
                        </h3>
                        <p className="text-gray-700">
                          DSWD staff should submit a request through their
                          department head. Partner agencies need to send an
                          official letter to the DSWD SLP-TIS office.
                          Self-registration is not available for security
                          reasons.
                        </p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          What should I do if I forgot my password?
                        </h3>
                        <p className="text-gray-700">
                          Click on the "Forgot Password" link on the login page.
                          You will receive password reset instructions on your
                          registered email. If you cannot access your email,
                          contact the system administrator.
                        </p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          How do I report technical issues with the system?
                        </h3>
                        <p className="text-gray-700">
                          For technical issues, contact the DSWD SLP-TIS support
                          team via email at support@dswdswcf.gov.ph or call the
                          helpdesk at (02) 8931-8101. Please provide detailed
                          information about the issue.
                        </p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          Can I access the system outside the DSWD network?
                        </h3>
                        <p className="text-gray-700">
                          Yes, the system is accessible via the internet, but
                          you must use secure, authorized devices and
                          connections. For security reasons, some functions may
                          be limited when accessing from external networks.
                        </p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          How often is inventory data updated in the system?
                        </h3>
                        <p className="text-gray-700">
                          Inventory data is updated in real-time as transactions
                          occur. Stock levels, disbursements, and other
                          inventory movements are reflected immediately to
                          ensure accurate reporting and decision-making.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                          What training is available for new users?
                        </h3>
                        <p className="text-gray-700">
                          New users must complete mandatory system training
                          before gaining full access. Training sessions are
                          conducted monthly, and additional resources including
                          user manuals and video tutorials are available in the
                          Help section.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-[#0F4C81] text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Access the DSWD Sustainable Livelihood Program - Tracking
                  Inventory System to manage inventory, process disbursements,
                  and support beneficiaries.
                </p>
                <Link href="/dashboard">
                  <button className="bg-[#FFC612] hover:bg-[#FFD54F] text-[#0F4C81] font-bold py-3 px-6 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                    Login to System
                  </button>
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-10">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 mr-3">
                        <img
                          src="/images/SLP.png"
                          alt="SLP Logo"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">DSWD SLP-TIS</h3>
                        <p className="text-xs text-gray-400">
                          Sustainable Livelihood Program - Tracking Inventory
                          System
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400">
                      The DSWD Sustainable Livelihood Program - Tracking
                      Inventory System is designed The DSWD Sustainable
                      Livelihood Program - Tracking Inventory System is designed
                      to efficiently manage inventory, track disbursements, and
                      support beneficiaries through integrated digital
                      solutions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">
                      Contact Information
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          DSWD Central Office, IBP Road, Constitution Hills,
                          Quezon City
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>(02) 8931-8101 to 07</span>
                      </li>
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>inquiry@dswd.gov.ph</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>
                        <a
                          href="#platform-users"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          Platform Users
                        </a>
                      </li>
                      <li>
                        <a
                          href="#account-creation"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          Account Creation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#service-access"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          Service Access Guide
                        </a>
                      </li>
                      <li>
                        <a
                          href="#required-documents"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          Required Documents
                        </a>
                      </li>
                      <li>
                        <a
                          href="#faqs"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.dswd.gov.ph"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          DSWD Official Website
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.dswd.gov.ph/sustainable-livelihood-program/"
                          className="hover:text-[#FFC612] transition-colors"
                        >
                          Sustainable Livelihood Program
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
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
