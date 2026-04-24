import React from "react";
import { motion } from "framer-motion";

import chatboticon from "../assets/chat-bot-icon.png";
import lockerlogo from "../assets/locker-logo.png";
import calendarlogo from "../assets/calendar-logo.png";
import graphlogo from "../assets/graph-logo.png";

const FeaturesSection = () => {
  const features = [
    { icon: chatboticon, title: "Personalized AI Assistance", description: "AI-powered insights tailored to your specific health needs." },
    { icon: lockerlogo, title: "Digital Locker", description: "Securely store and access your medical records anytime." },
    { icon: calendarlogo, title: "Comprehensive Scheduling", description: "Track appointments, routines, and your health journey seamlessly." },
    { icon: graphlogo, title: "Track Growth & Results", description: "Visualize progress with intuitive health graphs and reports." }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-40 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Designed to simplify healthcare decisions and empower better outcomes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="flex justify-center items-start gap-16 flex-wrap md:flex-nowrap"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center max-w-xs p-4 rounded-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={feature.icon} alt={feature.title} className="w-28 h-28 mb-8 object-contain" />
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;