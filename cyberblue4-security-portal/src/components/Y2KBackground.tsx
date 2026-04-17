import React from 'react';
import { motion } from 'motion/react';

export const Y2KBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-200">
      {/* Sea Blue Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl"
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} 
      />
    </div>
  );
};
