import scheduleImage from "../assets/track.png";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../lib/motion";

const ManageSection = () => {
  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 py-24 md:py-32"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
    
        <motion.div
          variants={fadeIn("right", 0.3)}
          className="w-full md:w-1/2"
        >
          <motion.img
            variants={fadeIn("up", 0.4)}
            src={scheduleImage}
            alt="Health tracking and progress dashboard"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </motion.div>

        <motion.div
          variants={fadeIn("left", 0.3)}
          className="w-full md:w-1/2"
        >
          <motion.span
            variants={fadeIn("up", 0.4)}
            className="text-green-600 font-semibold tracking-wide uppercase"
          >
            Health Management
          </motion.span>

          <motion.h2
            variants={textVariant(0.5)}
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6 leading-snug"
          >
            Manage Your Health Journey <br />
            With Smart Tracking & Reminders
          </motion.h2>

          <motion.p
            variants={fadeIn("up", 0.6)}
            className="text-gray-600 mb-8 leading-relaxed"
          >
            Healvia helps you stay organized and informed throughout your care
            journey. Securely track medical appointments, medication schedules,
            uploaded diagnostic reports, and long-term health progress — all in
            one place designed to support clarity, consistency, and confidence
            in your healthcare decisions.
          </motion.p>

          <motion.a
            variants={fadeIn("up", 0.7)}
            href="#"
            className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all"
          >
            Explore health tracking features
            <motion.svg
              variants={fadeIn("left", 0.8)}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ManageSection;