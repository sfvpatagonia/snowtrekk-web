import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import defaultImg from "@/assets/bonfire.png";
import { formatDateMMMMdYYYY } from "@/utils/dateParser";
import EditUserModal from "../editUserModal/EditUserModal";
import { Edit } from "@mui/icons-material";
import PasswordModal from "../passwordModal/PasswordModal";
import ImageModal from "./components/ImageModal";
import { Skeleton } from "@mui/material";

export default function InformationTab({ user, loading, error }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  if (loading) {
    return (
      <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
        <div className="max-w-[1024px] w-full mx-auto">
          {error ? (
            <p className="text-red-600 w-full text-left text-lg py-8 px-2">
              {error}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              <Skeleton variant="rounded" height={500} />
              <Skeleton variant="rounded" height={200} />
            </ul>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
      <div className="flex flex-col gap-4 w-full bg-main-50 dark:bg-main-950 max-w-[1024px] p-4 rounded shadow-lg">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 ">
          Personal information
        </h2>
        <div className="flex gap-2 flex-col sm:flex-row flex-wrap ">
          <div className="relative flex flex-1 bg-main-100 dark:bg-main-900 rounded aspect-square p-2 max-w-full justify-center border border-main-600 dark:border-main-400">
            <img
              className="w-full aspect-square rounded"
              src={user?.Images[0]?.url || defaultImg}
              alt="profile"
            />
            <Edit
              className="absolute top-4 right-4 text-green-700 cursor-pointer hover:text-green-600 duration-200 ease-in "
              onClick={() => setOpenImageModal(true)}
            />
          </div>
          <div className="flex flex-wrap  flex-2 p-4">
            <p className="flex flex-col text-start w-1/2 text-main-0 dark:text-main-1000">
              Full name
              <span className="text-main-600 dark:text-main-400 text-ellipsis whitespace-nowrap overflow-hidden">
                {user.name + " " + user.lastName}
              </span>
            </p>
            <p className="flex flex-col pl-2 text-start w-1/2 text-main-0 dark:text-main-1000">
              Birthday
              <span className="text-main-600 dark:text-main-400 text-ellipsis whitespace-nowrap overflow-hidden">
                {user.birthDate ? formatDateMMMMdYYYY(user.birthDate) : "---"}
              </span>
            </p>
            <p className="flex flex-col text-start w-1/2 text-main-0 dark:text-main-1000 ">
              Email
              <span className="text-main-600 dark:text-main-400 text-ellipsis whitespace-nowrap overflow-hidden">
                {user.email}
              </span>
            </p>
            <p className="flex flex-col text-start pl-2 w-1/2 text-main-0 dark:text-main-1000">
              Phone
              <span className="text-main-600 dark:text-main-400">
                {user.phone}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <Link
            className="underline text-green-700 dark:text-green-500 hover:text-green-500 dark:hover:text-green-700 duration-300 ease-in"
            onClick={() => setOpenEditModal(true)}
          >
            Edit personal information
          </Link>
          <Link
            className="underline text-green-700 dark:text-green-500 hover:text-green-500 dark:hover:text-green-700 duration-300 ease-in"
            onClick={() => setOpenPasswordModal(true)}
          >
            Change password
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full bg-main-50 dark:bg-main-950 max-w-[1024px] p-4 rounded shadow-lg text-left">
        <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 ">
          Stadistics
        </h2>
        <div className="flex gap-2 flex-col sm:flex-row flex-wrap ">
          <p className="flex flex-col text-start w-1/3 text-main-0 dark:text-main-1000">
            Purchases
            <span className="text-main-600 dark:text-main-400">
              {user.purchases && user.purchases}
            </span>
          </p>
          <p className="flex flex-col text-start w-1/3 text-main-0 dark:text-main-1000">
            Favorites
            <span className="text-main-600 dark:text-main-400">
              {user.favorites && user.favorites}
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row flex-wrap ">
          <p className="flex flex-col text-start w-1/3 text-main-0 dark:text-main-1000">
            Reviews done
            <span className="text-main-600 dark:text-main-400">
              {user.reviews && user.reviews}
            </span>
          </p>
          {/* <p className={styles.label}>
            Claims
            <span className={styles.value}>
              {user.claims ? user.claims.length : 0}
            </span>
          </p> */}
        </div>
      </div>
      {/* <Recommendations /> */}

      <EditUserModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        user={user}
      />
      <PasswordModal
        open={openPasswordModal}
        setOpen={setOpenPasswordModal}
        user={user}
      />
      {openImageModal && (
        <ImageModal
          open={openImageModal}
          handleClose={() => setOpenImageModal(false)}
          image={user?.Image?.url}
        />
      )}
    </main>
  );
}
