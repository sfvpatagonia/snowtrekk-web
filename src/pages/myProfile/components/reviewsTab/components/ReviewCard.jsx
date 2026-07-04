import { Link } from "react-router-dom";
import AcUnitIcon from "@mui/icons-material/AcUnit";

export default function ReviewCard({ review }) {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < review.score; i++) {
      stars.push(
        <AcUnitIcon className="text-main-600 dark:text-main-400" key={i} />,
      );
    }
    for (let i = 5; i > 0 + review.score; i--) {
      stars.push(<AcUnitIcon key={i} color="disabled" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col rounded shadow-lg w-full bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000">
      <div className="flex flex-col gap-2 p-4 w-full border-b border-main-600 dark:border-main-400 sm:flex-row">
        <Link
          to={`${review.Service && `/service/${review.Service.id}`}`}
          className="flex justify-center items-center h-full w-[150px] rounded-sm overflow-hidden bg-main-100 dark:bg-main-900 min-w-[150px]"
        >
          <img
            className="w-full aspect-square object-cover"
            src={review.Service && review.Service.Images[0].url}
            alt="service"
          />
        </Link>
        <div className="flex flex-col gap-2 w-full items-start">
          <div className="flex gap-2 items-baseline w-full flex-wrap">
            <Link
              to={`${review.Service && `/service/${review.Service.id}`}`}
              className="text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
            >
              {review.Service && review.Service.name}
            </Link>
            {review.Service &&
              (review.Service.destinations.length > 1 ? (
                <>
                  <Link
                    to={`/destination/${review.Service.firstDestination.id}`}
                    className="text-xs text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
                  >
                    at {review.Service.firstDestination.name}
                  </Link>
                  <Link
                    to={`/destination/${review.Service.lastDestination.id}`}
                    className="text-xs text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
                  >
                    to {review.Service.lastDestination.name}
                  </Link>
                </>
              ) : (
                <Link
                  to={`/destination/${review.Service.destinations[0].id}`}
                  className="text-xs text-main-0 dark:text-main-1000 hover:text-green-700 duration-200 ease-in border-b border-transparent hover:border-green-700"
                >
                  at {review.Service.destinations[0].name}
                </Link>
              ))}
          </div>
          <div className="flex flex-col  lg:flex-row w-full justify-between gap-2">
            <div className="flex flex-col w-1/3 gap-1 min-w-[200px]">
              <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
                <p className="font-bold ">Sold by:</p>
                <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                  {review.Service.Shop.name}
                </p>
              </div>
              <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
                <p className="font-bold ">Price:</p>
                <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                  U$D {review.orderService.purchasedPrice}
                </p>
              </div>
              <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
                <p className="font-bold ">Difficulty:</p>
                <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                  {review.Service.difficulty}
                </p>
              </div>
              <div className="flex w-full gap-2 text-main-0 dark:text-main-1000">
                <p className="font-bold ">Average score:</p>
                <p className="bg-main-100 dark:bg-main-900 flex-1 text-right px-2 rounded">
                  {review.Service.averageScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex p-4 w-full items-start">
        <div className="flex text-main-0 dark:text-main-1000 bg-main-100 dark:bg-main-900 p-4 w-full rounded">
          {review.review}
        </div>
        <div className="flex flex-col items-center justify-start w-1/3">
          <div>{renderStars()}</div>
          <div className="text-main-0 dark:text-main-1000 text-xl">
            {review.score} / 5
          </div>
        </div>
      </div>
    </div>
  );
}
