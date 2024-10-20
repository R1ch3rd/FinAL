import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-10 mt-8 ">
  <div className="container mx-auto text-gray-400 flex justify-between items-center">
    <p>&copy; 2024 FinAL. All rights reserved.</p>
    <div className="flex space-x-4">
      <a href="/terms" className="hover:text-white">Terms</a>
      <a href="/privacy" className="hover:text-white">Privacy</a>
      <a href="/contact" className="hover:text-white">Contact Us</a>
    </div>
  </div>
</footer>

  );
};

export default Footer;
