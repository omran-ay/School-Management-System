import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSchool,
  FaBookOpen,
  FaClipboardList,
  FaFileAlt,
  FaCalendarAlt,
  FaDoorOpen,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: <FaUserGraduate className="text-green-600 text-5xl" />,
    title: "Student Management",
    description: [
      "Comprehensive student profiles with academic history",
      "Automated attendance tracking with analytics",
      "Customizable performance dashboards",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaChalkboardTeacher className="text-green-600 text-5xl" />,
    title: "Teacher Management",
    description: [
      "Digital faculty records with certification tracking",
      "Automated workload balancing system",
      "Performance evaluation tools",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaSchool className="text-green-600 text-5xl" />,
    title: "Classroom Management",
    description: [
      "Smart room allocation with conflict detection",
      "Resource inventory management",
      "Maintenance scheduling system",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaBookOpen className="text-green-600 text-5xl" />,
    title: "Curriculum Management",
    description: [
      "Standard-aligned course creation",
      "Learning objective tracking",
      "Cross-grade curriculum mapping",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaClipboardList className="text-green-600 text-5xl" />,
    title: "Subject Management",
    description: [
      "Custom subject creation with prerequisites",
      "Teacher-subject matching recommendations",
      "Student performance by subject analytics",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaDoorOpen className="text-green-600 text-5xl" />,
    title: "Admissions System",
    description: [
      "Online application portal with document upload",
      "Automated application status updates",
      "Demographic analysis and reporting",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaFileAlt className="text-green-600 text-5xl" />,
    title: "Assessment Center",
    description: [
      "Automated grade calculation with rubrics",
      "Custom report card generation",
      "Longitudinal performance tracking",
    ],
    color: "bg-green-50",
  },
  {
    icon: <FaCalendarAlt className="text-green-600 text-5xl" />,
    title: "Smart Scheduling",
    description: [
      "AI-powered timetable generation",
      "Real-time schedule conflict detection",
      "Mobile-friendly calendar views",
    ],
    color: "bg-green-50",
  },
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col lg:flex-row items-center gap-8 ${
        index % 2 === 1 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Icon Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex-shrink-0 p-6 ${feature.color} rounded-2xl shadow-lg border border-green-100`}
      >
        {feature.icon}
      </motion.div>

      {/* Text Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 flex-1 hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          {feature.title}
        </h3>
        <ul className="text-gray-600 space-y-3 mb-6">
          {feature.description.map((desc, i) => (
            <li key={i} className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mt-2 mr-2"></span>
              {desc}
            </li>
          ))}
        </ul>
        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-800 transition-colors"
        >
          Explore module <FiArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Comprehensive School Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All the tools you need to efficiently manage every aspect of your
            educational institution
          </p>
        </motion.div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-gray-600 mb-6">Need something more specific?</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all"
          >
            Request Custom Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
