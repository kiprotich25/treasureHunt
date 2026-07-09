// Footer.jsx — Simple pirate-themed footer
import { motion } from "framer-motion";

const Footer = () => (
  <motion.footer
    className="text-center py-6 px-4 mt-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
  >
    <div className="flex items-center justify-center gap-3 text-amber-700/50 dark:text-amber-600/40 text-xs font-adventure tracking-widest uppercase">
      <span>⚜</span>
      <span>KamiLimu Month 3 Learning Journey</span>
      <span>⚜</span>
    </div>
    <p className="text-amber-700/90 dark:text-amber-700/90 text-xs mt-1 font-adventure">
      Made with ❤️ by <a href="https://iankiprotich.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">Kiprotich</a>
    </p>
  </motion.footer>
);

export default Footer;
