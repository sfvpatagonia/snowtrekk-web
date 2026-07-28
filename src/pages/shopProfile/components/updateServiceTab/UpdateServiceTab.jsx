import { useEffect, useState } from "react";
import BasicModal from "@/components/basicModal/BasicModal";
import { CheckCircleOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import shopService from "@/services/shop";
import ServiceDetailsForm from "./components/ServiceDetailsForm";
import ServiceImageForm from "./components/ServiceImageForm";
import ServiceDestinationsForm from "./components/ServiceDestinationsForm";
import ServiceIncludeForm from "./components/ServiceIncludeForm";
import ServiceFAQForm from "./components/ServiceFAQForm";
import { selectCurrentService } from "@/redux/shopSlice";
import service from "@/services/service";
import LoadingComponent from "@/components/LoadingComponent";
import Header from "@/components/header/Header";
import MenuNavigation from "../MenuNavigation";

export default function UpdateServiceTab() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  const [currentShop, setCurrentShop] = useState(null);
  const [toUpdateService, setToUpdateService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [includes, setIncludes] = useState([]);
  const [notIncludes, setNotIncludes] = useState([]);
  const [faq, setFaq] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [error, setError] = useState(null);
  const [idToUpdateService, setIdToUpdateService] = useState(null);

  const validateFields = (service, images) => {
    if (!service.name || service.name.trim() === "") {
      return "The service name is required.";
    }
    if (!service.description || service.description.trim() === "") {
      return "The service description is required.";
    }
    if (
      (!images || images.length === 0) &&
      imagesToDelete.length === service.Images.length
    ) {
      return "At least one image must be uploaded.";
    }
    if (!service.price || isNaN(service.price) || service.price <= 0) {
      return "The price must be a number greater than 0.";
    }
    if (!service.duration || isNaN(service.duration) || service.duration <= 0) {
      return "The duration must be a number greater than 0.";
    }
    if (!service.categories || service.categories.length === 0) {
      return "At least one category must be selected.";
    }
    // if (!includes || includes.length === 0) {
    //   return "At least one included item must be specified.";
    // }
    // if (!notIncludes || notIncludes.length === 0) {
    //   return "At least one excluded item must be specified.";
    // }
    if (
      !service.minimumParticipants ||
      isNaN(service.minimumParticipants) ||
      service.minimumParticipants < 1
    ) {
      return "The minimum number of participants must be a valid number.";
    }
    if (
      !service.maximumParticipants ||
      isNaN(service.maximumParticipants) ||
      service.maximumParticipants < service.minimumParticipants
    ) {
      return "The maximum number of participants must be greater than or equal to the minimum.";
    }
    if (
      service.transportIncluded &&
      (!service.transport || service.transport.trim() === "")
    ) {
      return "Transportation details must be provided if it is included.";
    }

    return null; // No errors
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setToUpdateService((prevService) => ({ ...prevService, [name]: value }));
  };

  useEffect(() => {
    shopService.getShopById(shop.id, user.token).then((data) => {
      if (data.ok) {
        setCurrentShop(data.body.shop);
      }
    });
    if (shop.currentServiceId) {
      service
        .getServiceById(shop.currentServiceId, user.token)
        .then((data) => {
          if (data.ok) {
            setToUpdateService(data.body.service);
            setFaq(data.body.service.FAQ);
          }
        })
        .finally(() => setLoading(false));
    } else {
      navigate("/my-shop?tab=services");
    }

    return () => {
      dispatch(selectCurrentService(""));
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const validationError = validateFields(toUpdateService, images);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append(`image`, image);
    });
    Object.entries(toUpdateService).forEach(([key, value]) => {
      if (typeof value === "object") value = JSON.stringify(value);
      formData.append(key, value);
    });
    formData.delete("includes");
    formData.delete("notIncludes");
    formData.delete("faq");
    formData.append("includes", JSON.stringify(includes));
    formData.append("notIncludes", JSON.stringify(notIncludes));
    formData.append("faq", JSON.stringify(faq));
    formData.append("idShop", currentShop.id);
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    formData.append("idShop", currentShop.id);

    service
      .updateService(toUpdateService.id, formData, user.token)
      .then((data) => {
        if (data.ok) {
          setIdToUpdateService(data.service.id);
          setConfirmModal(true);
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  // useEffect(() => {
  //   return dispatch(selectCurrentService(null));
  // }, [navigate]);

  const updateQuery = (newQuery) => {
    navigate(`/my-shop?tab=${newQuery}`);
    setActiveTab(newQuery);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!loading && !toUpdateService) {
    return navigate(-1); // Redirect to the desired page
  }

  return (
    <div>
      <Header />
      <div className="flex p-4 bg-main-100 dark:bg-main-900 min-h-[calc(100vh-60px)]">
        <MenuNavigation activeTab={""} updateQuery={updateQuery} />
        <div className="border-r-2 border-main-600 dark:border-main-400 rounded mx-4" />
        <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
          <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow text-main-0 dark:text-main-1000">
            <h1 className="md:block font-bold  text-left w-full max-w-[1024px] mx-auto">
              Edit service
            </h1>

            <p className="text-red-600 w-full text-left text-lg">{error}</p>
            <form className="flex flex-col w-full gap-4">
              <ServiceDetailsForm
                newService={toUpdateService}
                handleChange={handleChange}
                loading={loading}
              />

              <ServiceDestinationsForm
                newService={toUpdateService}
                setNewService={setToUpdateService}
                loading={loading}
              />
              <ServiceIncludeForm
                newService={toUpdateService}
                setNewService={setToUpdateService}
                includes={includes}
                setIncludes={setIncludes}
                notIncludes={notIncludes}
                setNotIncludes={setNotIncludes}
                handleChange={handleChange}
                loading={loading}
              />
              <ServiceImageForm
                images={toUpdateService.Images}
                setImages={setImages}
                imagesToDelete={imagesToDelete}
                setImagesToDelete={setImagesToDelete}
              />
              <ServiceFAQForm
                service={toUpdateService}
                setService={setToUpdateService}
                setFaq={setFaq}
              />

              <div className="flex justify-end p-4">
                <button
                  className="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
            <BasicModal open={confirmModal} setOpen={setConfirmModal}>
              <div className="flex flex-col items-center justify-center gap-1 p-2">
                <CheckCircleOutlined color="success" fontSize="inherit" />

                <p>Service updated succesfully</p>
                <button
                  className="button"
                  onClick={() => {
                    navigate(`/my-shop/add-availability`);
                  }}
                >
                  Ok
                </button>
              </div>
            </BasicModal>
          </div>
        </main>
      </div>
    </div>
  );
}
