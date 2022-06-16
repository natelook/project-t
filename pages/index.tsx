import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="w-full"
      >
        <div className="flex justify-evenly items-center w-full mb-10 py-12">
          <motion.div
            initial={{ y: 5 }}
            animate={{ y: -5 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <Image
              src="/logo-left.svg"
              alt="Left Logo"
              width="268.4px"
              height="200px"
              priority
            />
          </motion.div>
          <div className="text-center">
            <h1 className="text-6xl uppercase font-bold tracking-tighter">
              Tournaments.wtf
            </h1>
            <p className="text-gray-600 text-xl uppercase tracking-wider">
              Better Tournaments Soon
            </p>
            <p className="text-sm uppercase text-gray-500">
              For early access contact nat3#1111 on Discord
            </p>
          </div>
          <motion.div
            initial={{ y: -5 }}
            animate={{ y: 5 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <Image
              src="/logo-right.svg"
              alt="Right Logo"
              width="268.4px"
              height="200px"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
