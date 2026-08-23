import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "@/assets/logoST.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Suggestion from "./components/Suggestion";
import EmailModal from "./components/EmailModal";
import { useSelector } from "react-redux";
import newSuggestion from "@/services/newSuggestion";

const CONTACT_EMAIL = "info@snowtrekk.com";

const Footer = () => {
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");

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

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactError("");
    setContactSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactError("No pudimos enviar tu mensaje. Intentá nuevamente.");
      return;
    }

    if (!contactForm.message.trim()) {
      setContactError("No pudimos enviar tu mensaje. Intentá nuevamente.");
      return;
    }

    const contactMessage = contactForm.name.trim()
      ? `${contactForm.name.trim()}: ${contactForm.message.trim()}`
      : contactForm.message.trim();

    const response = await newSuggestion({
      email: contactForm.email.trim(),
      suggestion: `[footer_contact] ${contactMessage}`,
      date: new Date().toISOString(),
    });

    if (response.ok) {
      setContactSuccess("Gracias. Recibimos tu mensaje.");
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setContactOpen(false);
        setContactSuccess("");
      }, 1500);
    } else {
      setContactError("No pudimos enviar tu mensaje. Intentá nuevamente.");
    }
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
            <button
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700 bg-transparent p-0 text-left cursor-pointer"
              type="button"
              onClick={() => setContactOpen(true)}
            >
              Contact us
            </button>
          </li>
          <li>
            <Link
              className="text-main-1000 hover:text-green-700 duration-300 ease-in border-b border-transparent hover:border-green-700"
              to={user.id ? "/my-profile?tab=create-shop" : "/join"}
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
          </ul>
        </div>
      </div>
      {contactOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl border border-main-200 bg-main-50 p-6 text-left text-main-0 shadow-2xl dark:border-main-700 dark:bg-main-950 dark:text-main-1000">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-main-600 dark:text-main-400">Contact us</h3>
                <p className="mt-1 text-sm text-main-900 dark:text-main-100">
                  Contact email: <strong>{CONTACT_EMAIL}</strong>
                </p>
              </div>
              <button
                className="rounded-full bg-main-100 px-3 py-1 text-main-0 hover:bg-main-200 dark:bg-main-900 dark:text-main-1000"
                type="button"
                onClick={() => setContactOpen(false)}
                aria-label="Close contact form"
              >
                x
              </button>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleContactSubmit}>
              <input
                className="rounded border border-main-200 bg-main-1000 px-3 py-2 text-main-0 outline-none focus:border-green-700 dark:border-main-800"
                placeholder="Your name (optional)"
                value={contactForm.name}
                onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
              />
              <input
                className="rounded border border-main-200 bg-main-1000 px-3 py-2 text-main-0 outline-none focus:border-green-700 dark:border-main-800"
                placeholder="Your email"
                type="email"
                value={contactForm.email}
                onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                required
              />
              <textarea
                className="min-h-28 rounded border border-main-200 bg-main-1000 px-3 py-2 text-main-0 outline-none focus:border-green-700 dark:border-main-800"
                placeholder="Message"
                value={contactForm.message}
                onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
                required
              />
              {contactError && <p className="text-sm text-red-600">{contactError}</p>}
              {contactSuccess && <p className="text-sm text-green-700">{contactSuccess}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button className="button" type="button" onClick={() => setContactOpen(false)}>
                  Cancel
                </button>
                <button className="button" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

