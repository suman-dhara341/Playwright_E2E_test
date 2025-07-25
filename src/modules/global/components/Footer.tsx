import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-blue-100 mt-7 pt-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Logo and Socials */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
              <img src={Logo} alt="Footer Logo" className="w-10 h-auto" />
              <h2 className="text-2xl font-bold">WAZO</h2>
            </div>
            <div className="flex justify-center md:justify-start gap-3">
              <a href="#" aria-label="facebook" className="text-gray-700 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="instagram" className="text-gray-700 hover:text-pink-500">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="twitter" className="text-gray-700 hover:text-sky-500">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="linkedin" className="text-gray-700 hover:text-blue-700">
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-sm mt-4">Address: Somewhere over the rainbow</p>
          </div>

          {/* About */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              magni sint pariatur consequatur perspiciatis voluptas. Lorem ipsum
              dolor sit amet. Lorem ipsum dolor sit amet.
            </p>
          </div>

          {/* Help and Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Get Help</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <Link to="#" className="hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">Terms & Condition</Link>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Contact</h3>
            <p className="text-sm">
              <Link to="mailto:mailme@gmail.com" className="hover:underline">
                admin@gmail.com
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-200 text-center py-4 mt-6">
        <p className="text-sm">
          © 2025 | Wazo Solutions Pvt Ltd. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
