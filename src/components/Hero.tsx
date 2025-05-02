'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTasks, FaUsers, FaRocket, FaChartLine, FaCheckCircle, FaBell } from 'react-icons/fa';
import heroimg from '@/assets/heroimg.svg'
const features = [
  {
    icon: <FaTasks className="text-primary text-3xl" />,
    title: 'Task Management',
    description: 'Create, assign, and prioritize tasks seamlessly with drag & drop boards.',
  },
  {
    icon: <FaUsers className="text-primary text-3xl" />,
    title: 'Team Collaboration',
    description: 'Stay connected with mentions, comments, and real-time updates.',
  },
  {
    icon: <FaRocket className="text-primary text-3xl" />,
    title: 'Agile Sprint Planning',
    description: 'Organize sprints, epics, and story points like a true agile pro.',
  },
  {
    icon: <FaChartLine className="text-primary text-3xl" />,
    title: 'Insights & Reports',
    description: 'Track project progress, team velocity, and performance metrics.',
  },
  {
    icon: <FaCheckCircle className="text-primary text-3xl" />,
    title: 'Automated Workflows',
    description: 'Automate routine tasks and approvals to save time and reduce errors.',
  },
  {
    icon: <FaBell className="text-primary text-3xl" />,
    title: 'Smart Notifications',
    description: 'Never miss a beat with personalized and actionable alerts.',
  },
];
export default function HeroSection() {
  return (
  <>
    <section className="bg-white py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <motion.h1
            className="text-5xl lg:text-6xl font-bold text-[#0c0b52] mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Manage projects <br /> with clarity and speed.
          </motion.h1>

          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            Progressly is your modern work management platform, helping agile teams organize, track, and deliver results efficiently.
          </p>

          <div className="flex gap-4">
            <Link href="/profile">
              <button className="btn bg-[#0c0b52] hover:bg-[#231f84] text-white px-6">
                Get Started
              </button>
            </Link>
            {/* <Link href="/demo">
              <button className="btn btn-outline border-[#0c0b52] text-[#0c0b52] hover:bg-[#0c0b52] hover:text-white">
                View Demo
              </button>
            </Link> */}
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img
            src={heroimg.src}
            alt="Progressly dashboard"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
    <section className="py-24 px-6 bg-base-100 text-base-content">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            className="text-4xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Teams Love <span className="text-primary">Progressly</span>
          </motion.h2>
          <p className="mt-4 text-lg opacity-70 max-w-2xl mx-auto">
            Everything your team needs to move faster and stay aligned — in one powerful workspace.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-xl shadow-xl bg-base-200 hover:scale-105 transition-transform duration-300 border-t-4 border-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="opacity-80 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
       {/* CTA Section */}
       <section className=" py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl text-[#0c0b52] font-bold mb-4">Ready to supercharge your workflow?</h2>
          <p className="mb-6 text-[#0c0b52] text-lg">
            Start using Progressly today — it's free for small teams!
          </p>
          <button className="btn btn-primary text-white text-lg px-8">Sign Up Free</button>
        </motion.div>
      </section>
  </>
  );
}
