import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20 px-4 text-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-white"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-green-800 bg-opacity-50 px-4 py-2 rounded-full mb-6">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Trusted by 2,500+ schools</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Revolutionize Your School Management{" "}
          <br className="hidden md:block" />
          in Just 30 Days
        </h2>

        <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
          Join educators who reduced administrative work by 60% and improved
          communication with our all-in-one platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-gray-50 hover:scale-[1.02] transform transition-all duration-200 active:scale-95"
            aria-label="Create your free account"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/demo"
            className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            aria-label="Schedule a demo"
          >
            Schedule a Demo
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>30-day free trial</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
