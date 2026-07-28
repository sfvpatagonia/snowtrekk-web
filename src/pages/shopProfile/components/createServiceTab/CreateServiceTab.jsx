import { useEffect, useState } from "react";
import BasicModal from "@/components/basicModal/BasicModal";
import { CheckCircleOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import shopService from "@/services/shop";
import ServiceDetailsForm from "./components/ServiceDetailsForm";
import ServiceImageForm from "./components/ServiceImageForm";
import ServiceDestinationsForm from "./components/ServiceDestinationsForm";
import ServiceIncludeForm from "./components/ServiceIncludeForm";
import ServiceFAQForm from "./components/ServiceFAQForm";
import service from "@/services/service";

export default function CreateServiceTab() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);

  const initialState = {
    name: "",
    description: "",
    price: "",
    duration: "",
    difficulty: "",
    transporIncluded: false,
    transport: "",
    ageLimit: "",
    cancellation: "",
    categories: [],
    firstDestination: "",
    lastDestination: "",
    destinations: [],
    availableSchedules: [],
    faq: [],
    languages: [],
    paymentMethod: [],
    includes: "",
    notIncludes: "",
    frequency: [],
    minimumParticipants: "",
    maximumParticipants: "",
    pricePerParticipant: "",
  };
  const [currentShop, setCurrentShop] = useState(null);
  const [newService, setNewService] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [includes, setIncludes] = useState([]);
  const [notIncludes, setNotIncludes] = useState([]);
  const [faq, setFaq] = useState([]);
  const [images, setImages] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [error, setError] = useState(null);
  const [idNewService, setIdNewService] = useState(null);

  const validateFields = (service, images, includes, notIncludes) => {
    if (!service.name || service.name.trim() === "") {
      return "The service name is required.";
    }
    if (!service.description || service.description.trim() === "") {
      return "The service description is required.";
    }
    if (!images || images.length === 0) {
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
    setNewService((prevService) => ({ ...prevService, [name]: value }));
  };

  useEffect(() => {
    shopService.getShopById(shop.id, user.token).then((data) => {
      if (data.ok) {
        setCurrentShop(data.body.shop);
      }
    });

    // if (shop.currentServiceId) {
    //   service.getServiceById(shop.currentServiceId, user.token).then((data) => {
    //     console.log(data);
    //     if (data.ok) {
    //       setNewService(data.body.service);
    //       console.log(data.body.service);
    //     }
    //   });
    // }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const validationError = validateFields(
      newService,
      images,
      includes,
      notIncludes
    );
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append(`image`, image);
    });
    Object.entries(newService).forEach(([key, value]) => {
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

    service
      .createService(formData, user.token)
      .then((data) => {
        if (data.ok) {
          setIdNewService(data.service.id);
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

  return (
    <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
      <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow text-main-0 dark:text-main-1000">
        <h1 className="md:block font-bold  text-left w-full max-w-[1024px] mx-auto">
          Create a new service
        </h1>
        <p className="text-left text-sm">
          Please create your new services using the form below. Fill out the
          required fields to define the details of your service, and don't
          forget to add the items that are included or not included.
        </p>
        <p className="text-red-600 text-lg text-left">{error}</p>
        <form className="flex flex-col gap-4 w-full">
          <ServiceDetailsForm
            newService={newService}
            handleChange={handleChange}
            loading={loading}
          />

          <ServiceDestinationsForm
            newService={newService}
            setNewService={setNewService}
          />
          <ServiceIncludeForm
            newService={newService}
            setNewService={setNewService}
            includes={includes}
            setIncludes={setIncludes}
            notIncludes={notIncludes}
            setNotIncludes={setNotIncludes}
            handleChange={handleChange}
            loading={loading}
          />
          <ServiceImageForm setImages={setImages} />
          <ServiceFAQForm
            service={newService}
            setService={setNewService}
            faq={faq}
            setFaq={setFaq}
          />

          <div className="flex justify-end p-4">
            <button
              className="button"
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>

        <BasicModal open={confirmModal} setOpen={setConfirmModal}>
          <div className="flex flex-col items-center justify-center gap-1 p-2">
            <CheckCircleOutlined color="success" fontSize="inherit" />

            <p>Service created succesfully</p>
            <button
              className="button"
              onClick={() =>
                navigate(`/my-shop?tab=add-availabity?service=${idNewService}`)
              }
            >
              Ok
            </button>
          </div>
        </BasicModal>
      </div>
    </main>
  );
}
