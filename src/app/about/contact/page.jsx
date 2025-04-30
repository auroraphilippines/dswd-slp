"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      // Simulate successful submission
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
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
              <NavLink href="/about" text="About Program" />
              <NavLink href="/about#mission-vision" text="Mission & Vision" />
              <NavLink href="/about#history" text="History" />
              <NavLink href="/about#team" text="Team" />
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
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background elements */}
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
                Get in Touch
              </div>
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                Contact Support
              </span>
            </motion.h2>
            
            <motion.p
              className="text-xl mb-8 text-emerald-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Have questions or need assistance? Our team is here to help you with any inquiries about the Sustainable Livelihood Program.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white relative z-10 -mt-10 rounded-t-3xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              className="col-span-1 lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold text-emerald-800 mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                    <p className="text-gray-600">DSWD Central Office, IBP Road, Batasan Pambansa Complex, Constitution Hills, Quezon City 1126</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone Numbers</h4>
                    <p className="text-gray-600">Main Line: (+632) 8931-8101</p>
                    <p className="text-gray-600">Helpdesk: (+632) 8931-8101 to 07</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                    <p className="text-gray-600">inquiry@dswd.gov.ph</p>
                    <p className="text-gray-600">slp.support@dswd.gov.ph</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Social Media</h4>
                    <div className="flex gap-4 mt-2">
                      {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                        <a 
                          key={social}
                          href={`https://${social}.com/dswdserves`} 
                          className="w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{social}</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zm-9 2a1 1 0 100 2 1 1 0 000-2zm0-10a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Support Hours
                </h4>
                <p className="text-gray-600 mb-3">Our support team is available during the following hours:</p>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">8:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              className="col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">Send a Message</h3>
                
                {formStatus === "success" ? (
                  <motion.div
                    className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-emerald-800 mb-2">Message Sent Successfully!</h4>
                    <p className="text-gray-600 mb-4">Thank you for reaching out. Our team will get back to you soon.</p>
                    <button
                      onClick={() => setFormStatus(null)}
                      className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">Subject (Optional)</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="What is this regarding?"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Message <span className="text-red-500">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                        placeholder="Please describe your inquiry or issue in detail..."
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        type="submit"
                        disabled={formStatus === "submitting"}
                        className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 ${formStatus === "submitting" ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {formStatus === "submitting" ? (
                          <>
                            <span>Sending Message</span>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
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