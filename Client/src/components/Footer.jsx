import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface p-10 mt-8 ">
  <div className="container mx-auto text-ink-muted flex justify-between items-center">
    <p>&copy; 2024 FinAI. All rights reserved.</p>
    <div className="flex space-x-4">
      <a href="/terms" className="hover:text-ink">Terms</a>
      <a href="/privacy" className="hover:text-ink">Privacy</a>
      <a href="https://github.com/R1ch3rd/FinAL" className="hover:text-ink">Contact Us</a>
    </div>
  </div>
</footer>

  );
};

export default Footer;
