import Header from "@/components/header/Header.jsx";
import Footer from "@/components/footer/Footer.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import ServiceCard from "./components/ServiceCard.jsx";
import LoadingComponent from "@/components/LoadingComponent.jsx";
import AddToCartMenu from "./components/addToCartMenu/AddToCartMenu.jsx";
import { MdOutlineCheck, MdOutlineClose } from "react-icons/md";
import service from "@/services/service.js";
import { useSelector } from "react-redux";
import placeholderLogo from "@/assets/ski.png";
import FAQ from "./components/FAQ.jsx";
import Questions from "./components/Questions.jsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Service = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentService, setCurrentService] = useState(null);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    service
      .getServiceById(id, user.token)
      .then((data) => {
        if (!data.ok) {
          throw new Error(data.message);
        }
        setCurrentService(data.body.service);
      })
      .catch((error) => {
        console.error(error);
        navigate("/login");
      })
      .finally(() => setLoading(false));

    //Get molde
    //Get Schedule
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <div className="flex p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-60px)]">
        <AddToCartMenu item={currentService} />

        <div className="hidden md:block border-r-2 border-main-600 dark:border-main-400 rounded mx-4" />
        <main className="flex flex-col flex-1 gap-4 py-4 items-center overflow-hidden relative max-w-5xl mx-auto">
          <ServiceCard service={currentService} />
          <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
            <h3 className="text-xl w-full text-left border-b-2 border-main-600 dark:border-main-400  ">
              Description
            </h3>
            {currentService.description}
          </div>

          {currentService.includes.length !== 0 && (
            <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <div className="flex flex-col flex-1 w-full gap-4">
                  <h2 className="text-xl w-full text-left border-b-2 border-main-600 dark:border-main-400  ">
                    Includes
                  </h2>
                  <ul>
                    {currentService.includes.map((item, index) => {
                      return (
                        <li key={index}>
                          <MdOutlineCheck />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {currentService.notIncludes.length !== 0 && (
                  <div className="flex flex-col flex-1 w-full gap-4">
                    <h2 className="text-xl w-full flex-1 text-left border-b-2 border-main-600 dark:border-main-400  ">
                      Not includes
                    </h2>
                    <ul>
                      {currentService.notIncludes.map((item, index) => {
                        return (
                          <li key={index}>
                            <MdOutlineClose />
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
            <h3 className="text-xl w-full flex-1 text-left border-b-2 border-main-600 dark:border-main-400  ">
            Payment methods
            </h3>
            Arrange with the seller.
            </div> */}
          <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
            <h3 className="text-xl w-full flex-1 text-left border-b-2 border-main-600 dark:border-main-400  ">
              {currentService.Shop.name}
            </h3>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
              <img
                src={currentService.Shop.storeLogo || placeholderLogo}
                alt={currentService.Shop.name}
                className="max-w-38 p-2 object-contain bg-main-100 dark:bg-main-900 rounded"
              />
              <div className="flex flex-col justify-between h-full flex-1">
                <p>{currentService.description}</p>
                <Link
                  to={`/shop/${currentService.Shop.id}`}
                  className="flex gap-1 items-center hover:text-main-600 dark:hover:text-main-400 duration-200 self-end justify-baseline"
                >
                  Go to Shop <ArrowForwardIcon />
                </Link>
              </div>
            </div>
          </div>
          {currentService.FAQ.length !== 0 && <FAQ faqs={currentService.FAQ} />}
          <Questions
            questions={currentService.Questions}
            idService={id}
            setService={setCurrentService}
            service={currentService}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Service;
