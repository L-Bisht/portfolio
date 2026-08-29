import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { ContactData, SocialIcon } from "../../data/contact";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const SOCIAL_ICONS: Record<SocialIcon, React.ReactNode> = {
  github: <Github size={16} strokeWidth={1.75} />,
  linkedin: <Linkedin size={16} strokeWidth={1.75} />,
  twitter: <Twitter size={16} strokeWidth={1.75} />,
};

function SocialIconComponent({ icon }: { icon: SocialIcon }) {
  return <>{SOCIAL_ICONS[icon]}</>;
}

interface ContactProps {
  data: ContactData;
}

const Contact = ({ data }: ContactProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-200";

  return (
    <section
      id="contact"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-400/10 dark:bg-sky-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-500/8 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px flex-1 max-w-8 bg-sky-400/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-400">
            Contact
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            {data.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl">
            {data.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-5 gap-8"
        >
          {/* Form — 3 cols */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-5 p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell me about your project..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 shadow-lg shadow-sky-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : "Send Message"}
            </motion.button>

            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-3 rounded-xl text-sm font-medium ${submitStatus === "success"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
              >
                {submitStatus === "success"
                  ? "Message sent successfully! I'll be in touch soon."
                  : "Something went wrong. Please try again."}
              </motion.div>
            )}
          </motion.form>

          {/* Info — 2 cols */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 flex flex-col gap-5"
          >
            {/* Email card */}
            <a
              href={`mailto:${data.email}`}
              className="group p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-lg dark:hover:shadow-sky-500/10 hover:border-sky-400/30 transition-all duration-300"
            >
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-sky-400 mb-2">
                Email
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-200 break-all">
                {data.email}
              </div>
            </a>

            {/* Location card */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-fuchsia-400 mb-2">
                Location
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {data.location}
              </div>
            </div>

            {/* Social links */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-violet-400 mb-4">
                Connect
              </div>
              <div className="space-y-3">
                {data.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <span className="flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
                      <SocialIconComponent icon={link.icon} />
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
