import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WebIcon from "@mui/icons-material/Web";
import { useState } from "react";
import BasicModal from "./basicModal/BasicModal";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Close, Language, LocationOn } from "@mui/icons-material";

const ClientLeadCard = ({ client }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (client.isClient) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-start h-full justify-between p-2 w-full min-w-[280px] bg-main-100 dark:bg-main-900 
          rounded-lg shadow-lg `}
        onClick={handleClick}
      >
        <div>
          <div className="flex justify-between w-full mb-1 items-start">
            <h2 className="text-lg font-bold text-ellipsis text-main-600 dark:text-main-400 flex-1 text-left overflow-hidden border-b border-main-400">
              {client.companyName}
            </h2>
            {client.isClient && (
              <div className="flex items-center text-green-700 shrink-0 border border-green-700 rounded-full px-2 py-0.5 cursor-pointer hover:bg-green-500 hover:text-main-1000 duration-200 ease-in">
                <span className="text-xs">Ver más</span>
                <ChevronRightIcon fontSize="small" />
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-col text-start w-full mb-2 ">
            {client.clientActivities[0] && (
              <p className="font-bold text-sm my-1 text-main-0 dark:text-main-1000">
                {client.clientActivities[0].name}
              </p>
            )}
            {client.location && (
              <p className="text-sm my-1 text-main-0 dark:text-main-1000">
                {client.location}
              </p>
            )}
          </div>
        </div>

        {client.instagram ? (
          <Link
            className="flex gap-2 text-main-0 dark:text-main-1000 w-full items-end "
            to={client.instagram}
            target="_blank"
          >
            <InstagramIcon fontSize="small" />{" "}
            <p className="duration-200 ease-in max-w-[calc(100%-30px)] overflow-hidden text-sm text-nowrap text-ellipsis hover:text-green-700">
              {client.instagram}
            </p>
          </Link>
        ) : client.facebook ? (
          <Link
            className="flex gap-2 text-main-0 dark:text-main-1000 w-full items-end "
            to={client.facebook}
            target="_blank"
          >
            <FacebookIcon fontSize="small" />{" "}
            <p className="duration-200 ease-in max-w-[calc(100%-30px)] overflow-hidden text-sm text-nowrap text-ellipsis hover:text-green-700">
              {client.facebook}
            </p>
          </Link>
        ) : (
          client.website && (
            <Link
              className="flex gap-2 text-main-0 dark:text-main-1000 w-full items-end "
              to={client.website}
              target="_blank"
            >
              <WebIcon fontSize="small" />{" "}
              <p className="duration-200 ease-in max-w-[calc(100%-30px)] overflow-hidden text-sm text-nowrap text-ellipsis hover:text-green-700">
                {client.website}
              </p>
            </Link>
          )
        )}
      </div>
      <BasicModal open={modalOpen} setOpen={setModalOpen}>
        <div className="bg-main-100 dark:bg-main-900 rounded-lg w-[400px]">
          <div className="flex justify-between items-center border-b border-main-600 dark:border-main-400 p-4">
            <h2 className="text-2xl font-bold text-main-600 dark:text-main-400">
              {client.companyName}
            </h2>
            <button
              className="text-main-600 dark:text-main-400 cursor-pointer hover:text-red-600 rounded-lg p-1 hover:bg-main-200 duration-300 ease-in"
              onClick={() => setModalOpen(false)}
            >
              <Close />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-4 text-left border-b border-main-600 dark:border-main-400 ">
            {client.responsableName && (
              <div className="flex flex-col">
                <h4 className="text-main-0 dark:text-main-1000">Responsable</h4>
                <p className="text-main-0 dark:text-main-1000">
                  {client.responsableName}
                </p>
              </div>
            )}

            {client.email && (
              <div className="flex flex-col">
                <h4 className="text-main-0 dark:text-main-1000">Email:</h4>
                <a
                  href={`mailto:${client.email}`}
                  className="text-underline text-green-800 dark:text-green-500 hover:text-green-700"
                >
                  {client.email}
                </a>
              </div>
            )}

            {client.phone && (
              <div className="flex flex-col">
                <h4 className="text-main-0 dark:text-main-1000">Phone:</h4>
                <a
                  href={`tel:${client.phone}`}
                  className="text-underline text-green-800 dark:text-green-500 hover:text-green-700"
                >
                  {client.phone}
                </a>
              </div>
            )}

            {client.location && (
              <div className="flex flex-col">
                <h4 className="text-main-0 dark:text-main-1000">Location:</h4>
                <p className="text-main-0 dark:text-main-1000">
                  {client.location}
                </p>
              </div>
            )}

            {client.clientActivities && client.clientActivities.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-main-0 dark:text-main-1000">Activities:</h4>
                <div className="flex flex-wrap gap-2">
                  {client.clientActivities.map((activity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 border-main-600 dark:border-main-400 text-main-600 dark:text-main-400 border rounded-xl"
                    >
                      {activity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {client.clientDestinations &&
              client.clientDestinations.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-main-0 dark:text-main-1000">
                    Destinations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {client.clientDestinations.map((destination, index) => (
                      <span
                        key={index}
                        className="flex items-center bg-main-50 dark:bg-main-950 gap-2 px-2 py-1 border-main-600 dark:border-main-400 text-main-600 dark:text-main-400 border rounded-xl"
                      >
                        <LocationOn fontSize="inherit" /> {destination.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {client.languages && client.languages.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-main-0 dark:text-main-1000">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {client.languages.map((language, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-main-50 dark:bg-main-950 gap-2 px-2 py-1 border-main-600 dark:border-main-400 text-main-600 dark:text-main-400 border rounded-xl"
                    >
                      <Language fontSize="inherit" /> {language.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {client.notes && (
              <div className="flex flex-col gap-2">
                <h4 className="text-main-0 dark:text-main-1000">Notes</h4>
                <p className="flex items-center bg-main-50 dark:bg-main-950 gap-2 p-4 border-main-600 dark:border-main-400 text-main-600 dark:text-main-400 border-l rounded-xl">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 p-4 text-left ">
            {client.instagram && client.instagram !== "" && (
              <Link
                className="flex items-center justify-center text-lg gap-3 p-3 text-main-600 bg-main-50 dark:text-main-400 dark:bg-main-950 border-main-600 dark:border-main-400 px-4 py-2 border rounded-xl duration-300 hover:translate-x-2 hover:border-green-500"
                to={client.instagram}
                target="_blank"
              >
                <InstagramIcon fontSize="inherit" />
                <span>Instagram</span>
              </Link>
            )}

            {client.facebook && client.facebook !== "" && (
              <Link
                className="flex items-center justify-center text-lg gap-3 p-3 text-main-600 bg-main-50 dark:text-main-400 dark:bg-main-950 border-main-600 dark:border-main-400 px-4 py-2 border rounded-xl duration-300 hover:translate-x-2 hover:border-green-500"
                to={client.facebook}
                target="_blank"
              >
                <FacebookIcon fontSize="inherit" />
                <span>Facebook</span>
              </Link>
            )}

            {client.website && client.website !== "" && (
              <Link
                className="flex items-center justify-center text-lg gap-3 p-3 text-main-600 bg-main-50 dark:text-main-400 dark:bg-main-950 border-main-600 dark:border-main-400 px-4 py-2 border rounded-xl duration-300 hover:translate-x-2 hover:border-green-500"
                to={client.website}
                target="_blank"
              >
                <WebIcon fontSize="inherit" />
                <span>Website</span>
              </Link>
            )}
          </div>
        </div>
      </BasicModal>
    </>
  );
};

export default ClientLeadCard;
