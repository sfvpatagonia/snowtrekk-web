import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "@/assets/logoST.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Suggestion from "./components/Suggestion";
import EmailModal from "./components/EmailModal";
import { useSelector } from "react-redux";

const Footer = () => {
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    const isUserEmpty = !user || Object.keys(user).length === 0 || !user.id;

    if (!userEmail && isUserEmpty) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
    }
  }, [user]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="flex flex-col bg-[#444] z-10">
      <Suggestion />
      <EmailModal open={isModalOpen} handleClose={handleCloseModal} />

      <div className="flex flex-col sm:flex-row w-full gap-12 sm:gap-0 max-w-7xl mx-auto justify-evenly p-16">
        <ul className="flex flex-col gap-4 text-left">
          <h3 className="uppercase text-xl font-bold text-main-1000 mb-2">
            Legal
          </h3>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/faq"}
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/cancellation-policy"}
            >
              Cancellation policy
            </Link>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/privacy-policy"}
            >
              Privacy policy
            </Link>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/terms-and-conditions"}
            >
              Terms & Conditions
            </Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-4 text-left">
          <h3 className="uppercase text-xl font-bold text-main-1000 mb-2">
            Join us
          </h3>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/about-us"}
            >
              About us
            </Link>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={"/legal/contact-us"}
            >
              Contact us
            </Link>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={user.id ? "/my-profile?tab=create-shop" : "/login"}
              reloadDocument
            >
              I want to sell
            </Link>
          </li>
        </ul>
        <div className="flex flex-col gap-4 text-left">
          <h3 className="uppercase text-xl font-bold text-main-1000 mb-2">
            Social media
          </h3>
          <ul className="flex gap-2">
            <li>
              <Link
                className="text-main-1000 hover:text-green-700 duration-300 ease-in "
                to={
                  "https://www.facebook.com/p/snowtrekonline-100066494778085/"
                }
              >
                <FacebookIcon fontSize="large" />
              </Link>
            </li>
            <li>
              <Link
                className="text-main-1000 hover:text-green-700 duration-300 ease-in "
                to={"https://www.instagram.com/p/CkRbKLoJ6qW/"}
              >
                <InstagramIcon fontSize="large" />
              </Link>
            </li>
            {/* <li>
              <Link
                className="text-main-1000 hover:text-green-700 duration-300 ease-in "
                to={"/i-want-to-sell"}
              >
                <YouTubeIcon fontSize="large" />
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="px-16 py-12 sm:py-6  border-t-4 border-main-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 w-full max-w-7xl mx-auto justify-between items-center">
          <img src={logo} className="w-60" />

          <p className="text-main-1000">Copyright© 1999 - 2026 Snowtrekk</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
