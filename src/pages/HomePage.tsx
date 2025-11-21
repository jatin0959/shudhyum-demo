import React from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { ProductShowcase } from '../components/ProductShowcase';
import { Features } from '../components/Features';
import { About } from '../components/About';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.3
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export function HomePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={sectionVariants}>
        <Hero />
      </motion.section>
      <motion.section variants={sectionVariants}>
        <ProductShowcase />
      </motion.section>
      <motion.section variants={sectionVariants}>
        <Features />
      </motion.section>
      <motion.section variants={sectionVariants}>
        <About />
      </motion.section>
    </motion.div>
  );
}