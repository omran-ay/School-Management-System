import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  Rocket,
  Shield,
  BarChart2,
  Clock,
  UserPlus,
} from "lucide-react";

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-white mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-20 w-80 h-80 rounded-full bg-white mix-blend-screen"></div>
        </div>

        <div className="container mx-auto  flex flex-col-reverse max-lg:flex-row lg:flex-row items-center px-6 lg:px-12 relative z-10">
          {/* Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-6"
            >
              <Rocket className="w-5 h-5" />
              <span className="text-sm font-medium">
                TRUSTED BY 3,000+ SCHOOLS
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Transform Your School <br className="hidden lg:block" />
              Management Today
            </h1>

            <p className="text-xl mb-8 opacity-90 max-w-lg mx-auto lg:mx-0">
              All-in-one platform to streamline administration, enhance
              communication, and improve student outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free <UserPlus className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Watch Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 max-lg:w-3.5 drop-shadow-2xl"
          >
            <img
              src="images/image3.png"
              alt="School Management Dashboard"
              className="w-full max-w-2xl mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Schools Love Our Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed by educators for educators, with features that make
              school management effortless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Check className="w-8 h-8 text-green-600" />,
                title: "Easy to Use",
                desc: "Intuitive interface requires minimal training",
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "Secure",
                desc: "Enterprise-grade security for your data",
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-green-600" />,
                title: "Powerful Analytics",
                desc: "Real-time insights into school performance",
              },
              {
                icon: <Clock className="w-8 h-8 text-green-600" />,
                title: "Time Saving",
                desc: "Automate routine tasks and save hours weekly",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Implementation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get up and running in days, not months, with our streamlined
              onboarding
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row max-lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <img
                src="images/image3.png"
                alt="Implementation Process"
                className="w-full max-w-md mx-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              {[
                {
                  step: "1",
                  title: "Initial Setup",
                  desc: "Our team helps configure your school's settings",
                },
                {
                  step: "2",
                  title: "Data Migration",
                  desc: "We securely transfer your existing data",
                },
                {
                  step: "3",
                  title: "Staff Training",
                  desc: "Comprehensive training for all users",
                },
                {
                  step: "4",
                  title: "Go Live",
                  desc: "Full support during your launch period",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
