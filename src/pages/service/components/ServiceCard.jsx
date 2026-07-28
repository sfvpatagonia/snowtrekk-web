import { register } from "swiper/element/bundle";
import "swiper/css";
import "swiper/css/autoplay";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import favoritesFunctions from "@/services/favorites";
import { format } from "date-fns";

const ServiceCard = ({ service }) => {
  register();
  const user = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);

  const getDuration = () => {
    if (service.duration < 60) {
      return `${service.duration} min`;
    }
    return `${Math.floor(service.duration / 60)} h ${
      service.duration % 60
    } min`;
  };

  useEffect(() => {
    if (user.token) {
      favoritesFunctions
        .checkIsFavorite(service.id, user.token)
        .then((data) => {
          if (data.ok) {
            setIsFavorite(data.body.isFavorite);
          }
        });
    }
  }, []);

  const handleClick = () => {
    favoritesFunctions.setFavorite(service.id, user.token).then((data) => {
      if (data.ok) {
        setIsFavorite(data.isFavorite);
      }
    });
  };

  return (
    <section className="relative flex flex-col max-w-5xl shadow rounded w-full bg-main-100 dark:bg-main-900">
      <div className="flex absolute top-4 right-4 z-40" onClick={handleClick}>
        {isFavorite ? (
          <StarIcon
            className="text-main-600 dark:text-main-400 text-xl cursor-pointer transition duration-300 ease-linear hover:text-main-400 hover:dark:text-main-600"
            fontSize="large"
          />
        ) : (
          <StarBorderIcon
            className="text-main-1000 text-xl cursor-pointer transition duration-300 ease-linear hover:text-main-600 hover:dark:text-main-400"
            fontSize="large"
          />
        )}
      </div>
      <swiper-container
        loop="true"
        slidesPerView={1}
        autoplay="true"
        updateOnWindowResize="true"
      >
        {service.Images?.map((img, index) => {
          return (
            <swiper-slide key={index}>
              <img
                src={img.url}
                className="block w-full aspect-[16/7] object-cover border-b-3 border-main-600 dark:border-main-400 transition-transform duration-300 ease-in-out"
                width={600}
                height={400}
              />
            </swiper-slide>
          );
        })}
      </swiper-container>
      <div className="flex flex-col p-4 bg-main-50 dark:bg-main-950 rounded-b text-right text-main-0 dark:text-main-1000">
        <div className="flex justify-start items-baseline gap-2">
          <h1 className="text-main-600 dark:text-main-400 text-xl w-1/2 ">
            {service.name}
          </h1>
          <h2 className="bg-main-100 dark:bg-main-900 text-start flex-1 p-1 rounded mr-12 ">
            {service.firstDestination
              ? service.firstDestination.name
              : service.destinations[0].name}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row p-0 md:px-4 gap-2 lg:px-12 lg:gap-1">
          <div className="flex flex-col w-full gap-1">
            <div className="flex gap-2">
              <p className="font-bold flex-1">Activity:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.categories.map((cat) => cat.name).join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Duration:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {getDuration()}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Frequency:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.frequency}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Schedule :</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.Availabilities && service.Availabilities.length > 0
                  ? [
                      ...new Set(
                        service.Availabilities.flatMap((schedule) =>
                          schedule.turnosDisponibles.map((t) =>
                            format(new Date(t.startAt), "HH:mm"),
                          ),
                        ),
                      ),
                    ].join(", ")
                  : "Unavailable"}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Price:</p>
              {service.discount && (
                <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                  <span className="text-gray-500 line-through px-2">
                    {service.price}
                  </span>
                  U$D
                  {(
                    service.price -
                    service.price * (service.discount / 100)
                  ).toFixed(2)}
                </p>
              )}
              {service.fixedDiscount && (
                <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                  <span className="text-gray-500 line-through px-2">
                    {service.price}
                  </span>
                  U$D {service.price - service.fixedDiscount}
                </p>
              )}
              {!service.discount && !service.fixedDiscount && (
                <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                  U$D {service.price}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Difficulty:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.difficulty}
              </p>
            </div>
            {service.lastDestination && (
              <div className="flex gap-2">
                {" "}
                <p className="font-bold flex-1">Ends at:</p>
                <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                  {service.lastDestination.name}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="flex gap-2">
              {" "}
              <p className="font-bold flex-1">Calification:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.averageScore || "---"}
              </p>
            </div>
            {/* <div className="flex gap-2">
              <p className="font-bold flex-1">Sold:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.sold || 0}
              </p>
            </div> */}
            <div className="flex gap-2">
              <p className="font-bold flex-1">Ages:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.ageLimit && `+${service.ageLimit} years`}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Participants:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.minimumParticipants !== null &&
                  `${service.minimumParticipants}`}
                {" - "}
                {service.maximumParticipants !== null
                  ? `${service.maximumParticipants} people maximum`
                  : "No limit"}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Transport:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.transport && `U$D ${service.transport}`}
                {"  "}
                {service.transportIncluded ? "Included" : "Not included"}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold flex-1">Languages:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.languages && service.languages.length > 0
                  ? service.languages.map((language) => language).join(", ")
                  : "No Especified"}
              </p>
            </div>

            <div className="flex gap-2">
              <p className="font-bold flex-1">Cancellation:</p>
              <p className="flex-1 text-start bg-main-100 dark:bg-main-900 pl-2 rounded">
                {service.cancellationPolicy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCard;
