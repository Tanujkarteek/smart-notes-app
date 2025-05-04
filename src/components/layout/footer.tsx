import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Smart Notes App. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
