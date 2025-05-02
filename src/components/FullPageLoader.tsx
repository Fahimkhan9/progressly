import { motion } from 'framer-motion';

export default function FullPageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gray bg-opacity-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
      />
    </motion.div>
  
  );
}
