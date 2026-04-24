import React from "react";
import { motion } from "framer-motion";

const PurposeSection = () => {
  const features = [
    {
      title:
        "To simplify health decision-making by providing personalized, reliable guidance that helps individuals understand their health conditions, interpret medical information, manage treatments effectively, and adopt sustainable lifestyle habits with clarity, confidence, and trust."
    },
  ];

  return (
    <section id="about" className="w-full bg-gray-50 py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-600 text-center mb-6"
        >
          Our Purpose
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 text-center max-w-3xl mb-12"
        >
          We aim to empower users with AI-driven insights and tools to make informed health decisions.
        </motion.p>

        <div className="grid grid-cols-1 gap-8 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.3 * index
              }}
              className="flex justify-center"
            >
              <p className="text-gray-700 text-lg md:text-xl text-center max-w-4xl">
                {feature.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;