import BasicModal from "@/components/basicModal/BasicModal";
import { formatDateMMMMdYYYY } from "@/utils/dateParser";
import AcUnitIcon from "@mui/icons-material/AcUnit";

export default function ShowReviewModal({ open, setOpen, review }) {

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex min-h-[150px] flex-col gap-4 w-full rounded overflow-x-hidden bg-main-100 dark:bg-main-900 ">
        <div className="flex justify-between items-center px-4 pt-4 text-main-0 dark:text-main-1000">
          <h3 className="  font-bold whitespace-nowrap ">Your review</h3>
          <p className="w-full text-end py-2">
            {formatDateMMMMdYYYY(review.createdAt)}
          </p>
        </div>
        <div className="flex flex-col w-full g-4 p-4 text-left bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000">
          <p className="bg-main-100 dark:bg-main-900 p-4  rounded-sm">
            {review.review || "No comment provided"}
          </p>

          <label htmlFor="rating" className="mt-4">
            Rating:
          </label>
          <div className="flex gap-1 py-2">
            {[...Array(5)].map((star, index) => (
              <AcUnitIcon
                key={index}
                className={`text-[#333] ${
                  review.score > index ? "text-main-600 dark:text-main-400" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </BasicModal>
  );
}
