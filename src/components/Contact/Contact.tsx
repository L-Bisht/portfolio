import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Implement your form submission logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/yourusername" },
    { name: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
    { name: "Twitter", url: "https://twitter.com/yourusername" },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-textSecondary">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-textSecondary mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-primary/50 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-textSecondary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-primary/50 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-textSecondary mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-3 bg-primary/50 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-3 rounded ${
                  submitStatus === "success"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {submitStatus === "success"
                  ? "Message sent successfully!"
                  : "Failed to send message. Please try again."}
              </motion.div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect with me</h3>
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-textSecondary hover:text-secondary transition-colors"
                  >
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Email</h3>
              <a
                href="mailto:your.email@example.com"
                className="text-textSecondary hover:text-secondary transition-colors"
              >
                your.email@example.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <p className="text-textSecondary">Your City, Country</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
