const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        
        <h2 className="text-lg font-semibold text-white">
          My Blog
        </h2>

        <p className="text-sm mt-2 md:mt-0">
           © {new Date().getFullYear()} My Blog. All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-white">Home</a>
          {/* <a href="#" className="hover:text-white">About</a> */}
          {/* <a href="#" className="hover:text-white">Contact</a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;