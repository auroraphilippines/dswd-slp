"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Target,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Layers,
  Shield,
  Compass,
  Eye,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
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
              <h1 className="text-lg font-bold text-emerald-900">
                DSWD SLP-PS
              </h1>
              <p className="text-xs text-emerald-600">
                Sustainable Livelihood Program
              </p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-1">
            <motion.div 
              className="flex space-x-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              <NavLink href="#about-program" text="About" />
              <NavLink href="#mission-vision" text="Mission & Vision" />
              <NavLink href="#history" text="History" />
              <NavLink href="#team" text="Team" />
              <NavLink href="/about/contact" text="Contact" />
            </motion.div>
            
            <motion.div
              className="ml-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full py-2 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1 group"
              >
                <span>Back Home</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button - To be implemented */}
          <div className="md:hidden">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>
        </div>
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
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <div className="bg-emerald-300/20 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-100 text-sm font-medium border border-emerald-300/20">
                DSWD Sustainable Livelihood Program
              </div>
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                Empowering Communities
              </span>{" "}
              <span className="relative">
                Through Sustainable Livelihoods
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 w-full bg-emerald-400/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </span>
            </motion.h2>
            
            <motion.p
              className="text-xl mb-8 text-emerald-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              A comprehensive digital platform designed to streamline livelihood proposal management, 
              participant tracking, and program implementation for vulnerable communities across the Philippines.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 flex justify-center"
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
              <ChevronRight className="w-8 h-8 text-emerald-400 rotate-90" />
            </motion.div>
          </motion.div>
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
                interventions and support to identified poor, vulnerable, and marginalized households and communities. 
                It helps improve the program participants' socio-economic conditions by accessing and acquiring necessary 
                assets to engage in and maintain thriving livelihoods.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                As a component of the Convergence Strategy, the program aims to serve the beneficiaries of the 
                Pantawid Pamilyang Pilipino Program (4Ps), hoping to sustain and expand beyond the five-year 
                intervention the socio-economic benefits gained.
              </p>
              
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-4">SLP is implemented through a two-track program:</h4>
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
                      "Establish physical assets for more efficient livelihood operations"
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
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
      <section className="py-20 bg-emerald-50">
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
                  description: "A start-up capital for the purchase of tools, raw materials, common service facilities and other assets needed in starting or expanding a microenterprise"
                },
                {
                  title: "Cash-for-Building-Livelihood Assets",
                  icon: <Shield className="w-6 h-6" />,
                  description: "A grant for labor-intensive projects to build, rebuild and/or protect natural and physical assets necessary for microenterprises"
                },
                {
                  title: "Skills Training Fund",
                  icon: <Award className="w-6 h-6" />,
                  description: "A capacity-building assistance for the acquisition of technical and vocational knowledge and skills"
                },
                {
                  title: "Employment Assistance Fund",
                  icon: <Compass className="w-6 h-6" />,
                  description: "A grant to acquire employment requirements and access appropriate employment opportunities"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
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

      {/* Information Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* About the Program */}
          <div id="about-program" className="mb-20 scroll-mt-20">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-[#0F4C81] mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                About the Program
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    The Sustainable Livelihood Program (SLP) is a
                    community-based program that aims to improve the
                    socio-economic status of program participants. A key feature
                    of our system is the comprehensive participant backtracking
                    functionality, which allows us to monitor the progress of
                    beneficiaries throughout their journey in the program.
                  </p>
                  <p className="text-gray-700 mb-4">
                    The SLP-Proposal System (SLP-PS) is a digital platform
                    designed to streamline the management of livelihood
                    proposals, inventory tracking, and beneficiary support
                    across all DSWD regional offices in the Philippines.
                  </p>
                  <p className="text-gray-700">
                    Through this integrated system, we aim to enhance
                    efficiency, transparency, and accountability in the
                    implementation of social welfare programs, ultimately
                    improving service delivery to our beneficiaries.
                  </p>
                </div>
                <div className="flex justify-center">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="SLP Program Activities"
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                    Beneficiary-Centered
                  </h3>
                  <p className="text-gray-700">
                    Our program places beneficiaries at the center of all
                    initiatives, ensuring that interventions are responsive to
                    their needs and aspirations for sustainable livelihoods.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                    Results-Oriented
                  </h3>
                  <p className="text-gray-700">
                    We focus on achieving measurable outcomes that lead to
                    improved quality of life for program participants, with
                    emphasis on sustainable income generation.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                    Excellence in Service
                  </h3>
                  <p className="text-gray-700">
                    We are committed to delivering high-quality services through
                    efficient processes, innovative approaches, and continuous
                    improvement in program implementation.
                  </p>
                </div>
              </div>
              <div className="mt-8 bg-blue-100 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-[#0F4C81]">
                  Participant Backtracking System
                </h3>
                <p className="text-gray-700 mb-4">
                  Our advanced participant backtracking system allows program
                  administrators to:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Track the complete journey of participants from enrollment
                      to graduation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Monitor participation in training programs and workshops
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Assess the impact of interventions on participant
                      livelihoods
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Generate comprehensive reports on participant progress and
                      outcomes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#0F4C81] mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Identify areas where additional support may be needed
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

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
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Mission, Vision & Core Values
                </h2>
                <p className="text-lg text-gray-600">
                  The foundation that guides all our initiatives and programs
                </p>
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
                        An empowered society where the poor, vulnerable, and disadvantaged sectors have immediate and equitable access to opportunities for an improved quality of life.
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mt-6">
                        <h4 className="font-semibold mb-2 text-white">2028 Vision Base Camp</h4>
                        <p className="text-white/90">
                          DSWD is a leader in transformation social protection and social welfare system in the Indo-Pacific region.
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
                        As the authority in the Social Welfare and Development sector, the DSWD develops, implements, enables, and coordinates SWD policies and programs for and with the poor, vulnerable, and disadvantage.
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
                      description: "Emphasizes empathy, understanding, and providing care to individuals, families, and communities in need. It reflects the DSWD's recognition of the inherent worth and dignity of every person and their right to be treated with kindness, respect, and support.",
                      icon: <Heart className="w-6 h-6" />
                    },
                    {
                      title: "Matapat",
                      description: "Upholds honest, ethical behavior, and a strong sense of moral principles within the organization. It involves adhering to a set of values and principles that guide the actions and decisions of the DSWD workforce, ensuring that they act with transparency, accountability and professionalism.",
                      icon: <Shield className="w-6 h-6" />
                    },
                    {
                      title: "Mahusay",
                      description: "Provides high-quality, efficient, and effective services to individuals, families, and communities in need. It encompasses a dedication to delivering services anchored in social justice, while also striving for continuous improvement and innovation.",
                      icon: <Award className="w-6 h-6" />
                    }
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
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

          {/* Program History */}
          <div id="history" className="mb-20 scroll-mt-20">
            <div className="flex items-center mb-6">
              <Clock className="w-8 h-8 text-[#0F4C81] mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                Program History
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="mb-8">
                <p className="text-gray-700">
                  The Sustainable Livelihood Program has evolved over the years
                  to better serve the needs of vulnerable Filipinos. Here's a
                  timeline of our journey:
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-[#0F4C81] mt-2"></div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                      2011 - Program Inception
                    </h3>
                    <p className="text-gray-700">
                      The Sustainable Livelihood Program was established as a
                      community-based capacity building program that seeks to
                      improve the socio-economic status of program participants.
                      It replaced the previous Self-Employment Assistance
                      Kaunlaran (SEA-K) Program.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-[#0F4C81] mt-2"></div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                      2015 - Program Expansion
                    </h3>
                    <p className="text-gray-700">
                      The program expanded its reach to include more
                      beneficiaries and introduced the Microenterprise
                      Development Track and Employment Facilitation Track to
                      provide more comprehensive support to participants.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-[#0F4C81] mt-2"></div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                      2018 - Digital Transformation Initiative
                    </h3>
                    <p className="text-gray-700">
                      The DSWD began the digital transformation of the SLP,
                      developing initial systems to track beneficiaries and
                      program implementation. This laid the groundwork for more
                      comprehensive digital solutions.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-[#0F4C81] mt-2"></div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                      2020 - COVID-19 Response
                    </h3>
                    <p className="text-gray-700">
                      The program adapted to address the challenges posed by the
                      COVID-19 pandemic, providing emergency livelihood
                      assistance to affected families and communities, and
                      accelerating digital transformation efforts.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 text-[#0F4C81]">
                      2023 - Launch of SLP-PS
                    </h3>
                    <p className="text-gray-700">
                      The Sustainable Livelihood Program - Proposal System was
                      launched as a comprehensive digital platform to streamline
                      program implementation, enhance monitoring and evaluation,
                      and improve service delivery to beneficiaries nationwide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
                      <strong>Note:</strong> The SLP continues to evolve based
                      on lessons learned, stakeholder feedback, and emerging
                      needs of communities. Our commitment to sustainable
                      development and poverty reduction remains unwavering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div id="team" className="scroll-mt-20 mb-20">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-[#0F4C81] mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                Our Team
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <p className="text-gray-700 mb-8">
                The Sustainable Livelihood Program is led by a dedicated team of
                professionals committed to improving the lives of vulnerable
                Filipinos through sustainable livelihood opportunities.
              </p>

              {/* Director */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#0F4C81] mb-6 pb-2 border-b border-gray-200">
                  Program Leadership
                </h3>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 overflow-hidden rounded-full flex-shrink-0">
                    <img
                      src="/images/avatar1.png"
                      alt="SLP Director"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#0F4C81]">
                      Dr. Maria Santos
                    </h4>
                    <p className="text-gray-600 font-medium mb-3">
                      Director, Sustainable Livelihood Program
                    </p>
                    <p className="text-gray-700">
                      Dr. Santos leads the Sustainable Livelihood Program and
                      its affiliated colleges with over 15 years of experience
                      in social welfare and community development. She oversees
                      all strategic initiatives and ensures the program's
                      alignment with DSWD's mission to empower vulnerable
                      communities across the Philippines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Developers */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#0F4C81] mb-6 pb-2 border-b border-gray-200">
                  System Developers
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-24 h-24 overflow-hidden rounded-full flex-shrink-0">
                      <img
                        src="/images/avatar2.png"
                        alt="Lead Developer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0F4C81] text-center md:text-left">
                        Juan Dela Cruz
                      </h4>
                      <p className="text-gray-600 font-medium mb-2 text-center md:text-left">
                        Lead Developer
                      </p>
                      <p className="text-gray-700">
                        Architected and developed the core functionality of the
                        SLP Proposal System, with expertise in full-stack
                        development and database design.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-24 h-24 overflow-hidden rounded-full flex-shrink-0">
                      <img
                        src="/images/avatar3.png"
                        alt="UI/UX Developer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0F4C81] text-center md:text-left">
                        Ana Reyes
                      </h4>
                      <p className="text-gray-600 font-medium mb-2 text-center md:text-left">
                        UI/UX Developer
                      </p>
                      <p className="text-gray-700">
                        Designed the user interface and experience of the
                        SLP-PS, ensuring the system is intuitive, accessible,
                        and responsive across all devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-xl font-bold text-[#0F4C81] mb-6 pb-2 border-b border-gray-200">
                  Program Implementation Team
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar5.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Carlos Mendoza</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Regional Coordinator
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar4.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Sofia Garcia</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Training Specialist
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar2.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Miguel Santos</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Monitoring Officer
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar3.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Isabella Reyes</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Community Facilitator
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar6.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Rafael Lim</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Financial Analyst
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar4.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Elena Cruz</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Livelihood Specialist
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar5.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">Antonio Tan</h4>
                    <p className="text-sm text-gray-600 mb-1">Data Analyst</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                      <img
                        src="/images/avatar3.png"
                        alt="Team Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[#0F4C81]">
                      Gabriela Pascual
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Administrative Officer
                    </p>
                  </div>
                </div>
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
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zm-9 2a1 1 0 100 2 1 1 0 000-2zm0-10a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                  { name: "About Program", href: "#about-program" },
                  { name: "Mission & Vision", href: "#mission-vision" },
                  { name: "History", href: "#history" },
                  { name: "Our Team", href: "#team" },
                  { name: "DSWD Official Website", href: "https://www.dswd.gov.ph" },
                  { name: "Livelihood Program", href: "https://www.dswd.gov.ph/sustainable-livelihood-program/" }
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
    </div>
  );
}

// Navigation link component for desktop
function NavLink({ href, text }) {
  return (
    <motion.a
      href={href}
      className="text-emerald-700 hover:text-emerald-500 px-3 py-2 rounded-full hover:bg-emerald-50 font-medium transition-colors text-sm flex items-center gap-1.5 group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span>{text}</span>
    </motion.a>
  );
}
