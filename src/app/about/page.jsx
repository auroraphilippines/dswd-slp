"use client";

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
} from "react-feather";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-lime-700">
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
              <h1 className="text-xl font-bold">DSWD SLP-PS</h1>
              <p className="text-xs">
                Sustainable Livelihood Program - Proposal System
              </p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#about-program"
              className="hover:text-[#FFC612] transition-colors"
            >
              About
            </a>
            <a
              href="#mission-vision"
              className="hover:text-[#FFC612] transition-colors"
            >
              Mission & Vision
            </a>
            <a
              href="#history"
              className="hover:text-[#FFC612] transition-colors"
            >
              History
            </a>
            <a href="#team" className="hover:text-[#FFC612] transition-colors">
              Our Team
            </a>
            <div onClick={() => router.push("/")}>
              <button className="bg-[#FFC612] text-[#0F4C81] px-4 py-1 rounded-md font-medium hover:bg-white transition-colors">
                Back Home
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section
        className="relative text-white py-20 md:py-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 76, 129, 0.85), rgba(26, 107, 173, 0.9)), url('/images/DSWD-RO3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            About SLP Proposal System
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            A comprehensive digital platform designed to streamline livelihood
            proposal management, participant tracking, and program
            implementation
          </p>
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

          {/* Mission and Vision */}
          <div id="mission-vision" className="mb-20 scroll-mt-20">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-[#0F4C81] mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">
                Mission & Vision
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4 text-[#0F4C81] text-center">
                    Our Mission
                  </h3>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-1 bg-[#FFC612]"></div>
                  </div>
                  <p className="text-gray-700 text-center">
                    To lead in the formulation, implementation, and coordination
                    of social welfare and development policies and programs for
                    and with the poor, vulnerable, and disadvantaged, by
                    providing integrated, sustainable, and technology-driven
                    livelihood solutions that empower individuals and
                    communities to achieve self-sufficiency and improved quality
                    of life.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4 text-[#0F4C81] text-center">
                    Our Vision
                  </h3>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-1 bg-[#FFC612]"></div>
                  </div>
                  <p className="text-gray-700 text-center">
                    By 2030, the DSWD Sustainable Livelihood Program envisions a
                    Philippines where every Filipino family enjoys a decent,
                    dignified, and sustainable livelihood, supported by
                    efficient, transparent, and accessible digital systems that
                    facilitate equitable distribution of resources and
                    opportunities.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-blue-100 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4 text-[#0F4C81]">
                  Core Values
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">I</span>
                    </div>
                    <h4 className="font-semibold text-[#0F4C81] mb-2">
                      Integrity
                    </h4>
                    <p className="text-sm text-gray-600">
                      We uphold the highest ethical standards in all our actions
                      and decisions
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <h4 className="font-semibold text-[#0F4C81] mb-2">
                      Compassion
                    </h4>
                    <p className="text-sm text-gray-600">
                      We serve with genuine care and empathy for the vulnerable
                      and disadvantaged
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <h4 className="font-semibold text-[#0F4C81] mb-2">
                      Transparency
                    </h4>
                    <p className="text-sm text-gray-600">
                      We ensure openness and accountability in all our processes
                      and transactions
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">E</span>
                    </div>
                    <h4 className="font-semibold text-[#0F4C81] mb-2">
                      Excellence
                    </h4>
                    <p className="text-sm text-gray-600">
                      We strive for continuous improvement and innovation in
                      service delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              {/* Gradient Org Chart */}
              <div className="relative flex flex-col items-center w-full max-w-5xl mx-auto pt-8 pb-16">
                {/* Top Level */}
                <div className="flex justify-center z-10">
                  <div className="org-card-gradient relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar1.png" alt="SLP Director" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Dr. Maria Santos</div>
                      <div className="org-title">Director, Sustainable Livelihood Program</div>
                    </div>
                  </div>
                </div>
                {/* Connecting line to next row */}
                <div className="absolute left-1/2 top-32 w-1 h-12 bg-gradient-to-b from-yellow-400 to-pink-500 z-0" style={{transform:'translateX(-50%)'}}></div>
                {/* Second Level */}
                <div className="flex justify-center gap-24 mt-20 z-10">
                  <div className="org-card-gradient-pink relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar2.png" alt="Lead Developer" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Juan Dela Cruz</div>
                      <div className="org-title">Lead Developer</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-pink relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar3.png" alt="UI/UX Developer" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Ana Reyes</div>
                      <div className="org-title">UI/UX Developer</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-pink relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar4.png" alt="Training Specialist" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Sofia Garcia</div>
                      <div className="org-title">Training Specialist</div>
                    </div>
                  </div>
                </div>
                {/* Connecting lines to next row */}
                <div className="absolute left-1/2 top-[19.5rem] w-[60%] h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-orange-400 z-0" style={{transform:'translateX(-50%)'}}></div>
                {/* Third Level */}
                <div className="flex flex-wrap justify-center gap-8 mt-20 z-10">
                  <div className="org-card-gradient-orange relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar5.png" alt="Regional Coordinator" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Carlos Mendoza</div>
                      <div className="org-title">Regional Coordinator</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-orange relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar6.png" alt="Financial Analyst" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Rafael Lim</div>
                      <div className="org-title">Financial Analyst</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-blue relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar2.png" alt="Monitoring Officer" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Miguel Santos</div>
                      <div className="org-title">Monitoring Officer</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-blue relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar3.png" alt="Community Facilitator" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Isabella Reyes</div>
                      <div className="org-title">Community Facilitator</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-blue relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar4.png" alt="Livelihood Specialist" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Elena Cruz</div>
                      <div className="org-title">Livelihood Specialist</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-blue relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar5.png" alt="Data Analyst" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Antonio Tan</div>
                      <div className="org-title">Data Analyst</div>
                    </div>
                  </div>
                  <div className="org-card-gradient-blue relative flex flex-col items-center">
                    <div className="hexagon-outer absolute -top-12 z-10">
                      <div className="hexagon-frame">
                        <img src="/images/avatar3.png" alt="Administrative Officer" className="org-avatar" />
                      </div>
                    </div>
                    <div className="org-info pt-12">
                      <div className="org-name">Gabriela Pascual</div>
                      <div className="org-title">Administrative Officer</div>
                    </div>
                  </div>
                </div>
                {/* Custom styles for org chart */}
                <style jsx>{`
                  .hexagon-outer {
                    width: 90px;
                    height: 90px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .hexagon-frame {
                    width: 90px;
                    height: 90px;
                    background: linear-gradient(135deg, #ffb347 0%, #f857a6 100%);
                    clip-path: polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.10);
                    padding: 4px;
                  }
                  .hexagon-frame img.org-avatar {
                    width: 78px;
                    height: 78px;
                    object-fit: cover;
                    border-radius: 16px;
                    clip-path: polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%);
                    background: #fff;
                    border: 2px solid #fff;
                  }
                  .org-card-gradient, .org-card-gradient-pink, .org-card-gradient-orange, .org-card-gradient-blue {
                    position: relative;
                    margin-top: 2.5rem;
                    padding-top: 3.5rem;
                    border-radius: 2.5rem 2.5rem 2.5rem 2.5rem/2rem 2rem 2.5rem 2.5rem;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 220px;
                    margin-bottom: 1rem;
                  }
                  .org-info {
                    text-align: center;
                    margin-top: 0.5rem;
                  }
                  .org-name {
                    font-weight: bold;
                    font-size: 1.1rem;
                    color: #fff;
                  }
                  .org-title {
                    font-size: 0.95rem;
                    color: #f3f3f3;
                  }
                  @media (max-width: 900px) {
                    .org-card-gradient, .org-card-gradient-pink, .org-card-gradient-orange, .org-card-gradient-blue {
                      min-width: 140px;
                      padding: 2.5rem 1.2rem 1rem 1.2rem;
                    }
                    .hexagon-outer, .hexagon-frame {
                      width: 60px;
                      height: 60px;
                    }
                    .hexagon-frame img.org-avatar {
                      width: 50px;
                      height: 50px;
                    }
                  }
                `}</style>
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
            Access the DSWD Sustainable Livelihood Program - Proposal System to
            manage inventory, process disbursements, and support beneficiaries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div onClick={() => router.push("/login")}>
              <button className="bg-[#FFC612] hover:bg-[#ffffff] text-[#0F4C81] font-bold py-3 px-6 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 w-full sm:w-auto">
                Login to System
              </button>
            </div>
            <div onClick={() => router.push("/contact")}>
              <button className="bg-transparent border-2 border-white hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 w-full sm:w-auto mt-3 sm:mt-0">
                Contact Support
              </button>
            </div>
          </div>
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
                  <h3 className="text-lg font-bold">DSWD SLP-PS</h3>
                  <p className="text-xs text-gray-400">
                    Sustainable Livelihood Program - Proposal System
                  </p>
                </div>
              </div>
              <p className="text-gray-400">
                The DSWD Sustainable Livelihood Program - Proposal System is
                designed to efficiently manage inventory, track disbursements,
                and support beneficiaries through integrated digital solutions,
                empowering communities across the Philippines.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    DSWD Provincial Extension Office - Aurora, Baler, Aurora
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
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Monday to Friday: 8:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about-program"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    About Program
                  </a>
                </li>
                <li>
                  <a
                    href="#mission-vision"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Mission & Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#history"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Program History
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    className="hover:text-[#FFC612] transition-colors"
                  >
                    Our Team
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
                    href="https://fo3.dswd.gov.ph/slp/"
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
              &copy; {new Date().getFullYear()} Department of Social Welfare and
              Development. All rights reserved.
            </p>
            <p className="mt-2">
              This system is for authorized users only. Unauthorized access is
              prohibited.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}