import { Link } from "react-router-dom";
import defaultImg from "@/assets/bonfire.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import shopService from "@/services/shop";
import { selectShop } from "@/redux/shopSlice";
import EditShopModal from "./components/EditShopModal";
import AddUsersModal from "./components/AddUsersModal";
import PoliciesModal from "./components/PoliciesModal";
import { Edit } from "@mui/icons-material";
import DescriptionModal from "./components/DescriptionModal";
import ImageModal from "./components/ImageModal";
import { Skeleton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function ShopTab({ updateQuery }) {
  const user = useSelector((state) => state.user);
  const shopRedux = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  const [shop, setShop] = useState(null);
  const [openAddUsersModal, setOpenAddUsersModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [openPoliciesModal, setOpenPoliciesModal] = useState("");
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    shopService
      .getShopById(shopRedux.id, user.token)
      .then((data) => {
        if (data.ok) {
          setShop(data.body.shop);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [isUpdated]);

  if (loading) {
    return (
      <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
        <Link
          className="button"
          style={{ alignSelf: "start" }}
          to="/my-shop"
          onClick={() => dispatch(selectShop({ id: null, name: "" }))}
        >
          Back to select shop
        </Link>
        <div className="w-full max-w-[1024px] flex flex-col gap-4 ">
          <Skeleton variant="rounded" height={400} width={"100%"} />
          <Skeleton variant="rounded" height={200} width={"100%"} />
          <Skeleton variant="rounded" height={200} width={"100%"} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
        <Link
          className="button"
          style={{ alignSelf: "start" }}
          to="/my-shop"
          onClick={() => dispatch(selectShop({ id: null, name: "" }))}
        >
          Back to select shop
        </Link>
        <p className="text-red-600 w-full text-left text-lg py-8 px-2">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center gap-4 max-w-full overflow-hidden py-4  ">
      <Link
        className="button"
        style={{ alignSelf: "start" }}
        to="/my-shop"
        onClick={() => dispatch(selectShop({ id: null, name: "" }))}
      >
        Back to select shop
      </Link>
      {shop?.status !== "active" && (
        <div className="bg-main-200 dark:bg-main-600 text-black dark:text-white p-4 rounded w-full max-w-[1024px] flex  gap-1 shadow items-center">
          <InfoIcon className="" />
          <p className=" w-full text-left text-lg py-1 px-2">
            Your shop is currently {shop?.status}. Please check your{" "}
            <span
              className="font-bold underline cursor-pointer hover:text-green-600 dark:hover:text-green-500 duration-200 ease-in"
              onClick={() => updateQuery("billing")}
            >
              billing section
            </span>
          </p>
        </div>
      )}

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
        <h1 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
          Shop information
        </h1>
        <div className="flex flex-col md:flex-row gap-2 flex-wrap">
          <div className="flex flex-1 bg-main-100 dark:bg-main-900 rounded overflow-hidden relative max-w-full justify-center aspect-square border border-main-600 dark:border-main-400 p-2">
            <img
              className="w-full object-contain"
              src={shop?.Image?.url || defaultImg}
              alt="profile"
            />
            <Edit
              className="absolute top-2 right-2 cursor-pointer text-green-600 hover:text-main-600 hover:dark:text-main-400 duration-300 ease-in"
              onClick={() => setOpenImageModal(true)}
            />
          </div>
          <div className="flex flex-wrap flex-1 md:flex-2 xl:px-2  flex-col xl:flex-row p-4">
            <div className="flex flex-col text-start w-full xl:w-1/2 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">Shop Name</p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.name}
              </span>
            </div>
            <div className="flex flex-col text-start w-full xl:w-1/2 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">Legal Name</p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.legalName || "---"}
              </span>
            </div>
            <div className="flex flex-col text-start w-full xl:w-1/2 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">Email</p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.email}
              </span>
            </div>
            <div className="flex flex-col text-start w-full xl:w-1/2 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">Phone</p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.phone}
              </span>
            </div>
            <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">
                Users associated
              </p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.users ? shop.users?.length : "---"}
              </span>
            </div>
            <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
              <p className="text-main-0 dark:text-main-1000">Type</p>
              <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {shop?.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={() => setOpenEditModal(true)}>
            <p className="underline text-green-700 dark:text-green-500 cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400">
              Edit shop information
            </p>
          </button>
          <button onClick={() => setOpenAddUsersModal(true)}>
            <p className="underline text-green-700 dark:text-green-500 cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400">
              Change associated users
            </p>
          </button>
        </div>
      </div>
      <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
          Stadistics
        </h2>
        <div className="flex flex-col md:flex-row gap-2 flex-wrap">
          <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
            <p className="text-main-0 dark:text-main-1000">Sales</p>
            <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {shop?.salesAmount}
            </span>
          </div>
          <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
            <p className="text-main-0 dark:text-main-1000">Average Score</p>
            <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {shop?.Services && shop.Services.length > 0
                ? (() => {
                    const validServices = shop.Services.filter(
                      (service) => service.averageScore !== null,
                    );
                    const totalScore = validServices.reduce(
                      (sum, service) => sum + service.averageScore,
                      0,
                    );
                    return validServices.length > 0
                      ? (totalScore / validServices.length).toFixed(2)
                      : "---";
                  })()
                : "---"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 flex-wrap">
          <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
            <p className="text-main-0 dark:text-main-1000">Services</p>
            <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {shop?.Services?.length || 0}
            </span>
          </div>
          <div className="flex flex-col text-start w-1/3 border-b xl:border-0 border-main-100 dark:border-main-900">
            <p className="text-main-0 dark:text-main-1000">Products</p>
            <span className="text-main-600 dark:text-main-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {shop?.Products?.length || 0}
            </span>
          </div>
        </div>
      </div>
      {/* <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
          Shop policies
        </h2>

        <Policy
          name="termsAndConditions"
          label="Terms & Conditions"
          policy={shop?.ShopPolicy?.termsAndConditions}
          setOpenPoliciesModal={setOpenPoliciesModal}
        />
        <Policy
          name="privacyPolicy"
          label="Privacy Policy"
          policy={shop?.ShopPolicy?.privacyPolicy}
          setOpenPoliciesModal={setOpenPoliciesModal}
        />
        <Policy
          name="returnAndRefund"
          label="Return & Refund Policy"
          policy={shop?.ShopPolicy?.returnAndRefund}
          setOpenPoliciesModal={setOpenPoliciesModal}
        />
        <Policy
          name="shipping"
          label="Shipping Policy"
          policy={shop?.ShopPolicy?.shipping}
          setOpenPoliciesModal={setOpenPoliciesModal}
        />
      </div> */}

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
          Shop description
        </h2>
        {shop?.description ? (
          <pre className="flex text-main-0 dark:text-main-1000 bg-main-100 dark:bg-main-900 p-4 rounded w-full overflow-hidden justify-between text-left text-wrap">
            {shop?.description}{" "}
            <span
              className="cursor-pointer text-green-600 hover:text-main-600 hover:dark:text-main-400 duration-300 ease-in"
              onClick={() => setOpenDescriptionModal(true)}
            >
              <Edit />
            </span>
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center bg-main-100 dark:bg-main-900 w-full rounded">
            <p className="flex text-main-0 dark:text-main-1000 bg-main-100 dark:bg-main-900 p-4 rounded w-full overflow-hidden justify-between text-left text-wrap">
              You have not loaded the shop description yet.
              <button onClick={() => setOpenDescriptionModal(true)}>
                <p className="underline text-green-700 dark:text-green-500 cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400">
                  Add a description
                </p>
              </button>
            </p>
          </div>
        )}
      </div>
      {openEditModal && (
        <EditShopModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          shop={shop}
          onUpdate={() => setIsUpdated((prev) => !prev)}
        />
      )}
      {openAddUsersModal && (
        <AddUsersModal
          open={openAddUsersModal}
          setOpen={setOpenAddUsersModal}
          users={shop?.users}
          setShop={setShop}
          onUpdate={() => setIsUpdated((prev) => !prev)}
        />
      )}
      {openPoliciesModal.isOpen && (
        <PoliciesModal
          open={openPoliciesModal.isOpen}
          setOpen={() =>
            setOpenPoliciesModal({ isOpen: false, name: "", label: "" })
          }
          policy={{
            name: openPoliciesModal.name,
            label: openPoliciesModal.label,
            prev: openPoliciesModal.prev || null,
          }}
          idShop={shop?.id}
        />
      )}
      {openDescriptionModal && (
        <DescriptionModal
          open={openDescriptionModal}
          setOpen={() => setOpenDescriptionModal(false)}
          description={shop?.description}
          idShop={shop?.id}
        />
      )}
      {openImageModal && (
        <ImageModal
          open={openImageModal}
          handleClose={() => setOpenImageModal(false)}
          image={shop?.Image?.url}
          shopId={shop?.id}
        />
      )}
    </main>
  );
}
