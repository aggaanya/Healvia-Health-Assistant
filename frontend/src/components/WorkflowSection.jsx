import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../lib/motion";

const WorkflowSection = () => {
  const steps = [
    {
      number: "I",
      title: "Enter Your Health Data",
      description: "Provide your medical history, lifestyle habits, and current health info."
    },
    {
      number: "II",
      title: "AI Analysis",
      description: "Our AI analyzes your data and generates personalized insights and recommendations."
    },
    {
      number: "III",
      title: "Track Progress",
      description: "Monitor your health journey with visual dashboards, schedules, and alerts."
    },
    {
      number: "IV",
      title: "Achieve Goals",
      description: "Follow suggestions to improve health outcomes and maintain long-term wellness."
    }
  ];

  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 py-16 md:py-24"
    >
     
      <motion.div
        variants={fadeIn("up", 0.3)}
        className="text-center mb-16"
      >
        <motion.span className="text-emerald-500 font-semibold">WORKFLOW</motion.span>
        <motion.h2
          variants={textVariant(0.5)}
          className="text-3xl md:text-4xl font-bold text-navy-900 mt-4"
        >
          How Healvia Works
        </motion.h2>
        <motion.p
          variants={fadeIn("up", 0.4)}
          className="text-gray-600 mt-4 max-w-2xl mx-auto"
        >
          Follow a simple 4-step process to understand, manage, and improve your health with Healvia.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center text-center p-8 rounded-lg border-4 border-blue-600 cursor-pointer"
          >
            <div className="w-20 h-20 flex items-center justify-center mb-6 rounded-full text-4xl font-bold text-blue-600 border-2 border-blue-600">
              {step.number}
            </div>

            <motion.h3
              variants={fadeIn("up", 0.3)}
              className="text-xl font-semibold mb-2"
            >
              {step.title}
            </motion.h3>
            <motion.p
              variants={fadeIn("up", 0.4)}
              className="text-gray-600 text-sm"
            >
              {step.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default WorkflowSection;