import { TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useEffect, useState } from "react";
import reviewsService from "@/services/reviews";
import { useSelector } from "react-redux";

export default function ReviewModal({
  open,
  setOpen,
  idService,
  idOrderService,
}) {
  const [error, setError] = useState(null);
  const [review, setReview] = useState({
    comment: "",
    rating: 0,
  });
  const user = useSelector((state) => state.user);

  useEffect(() => {
    return () => {
      setReview({
        review: "",
        rating: 0,
      });
      setError(null);
    };
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewsService
      .createReview(
        idService,
        { ...review, idOrderService: idOrderService },
        user.token
      )
      .then((data) => {
        if (data.ok) {
          setOpen(false);
          setReview({ comment: "", rating: 0 });
        } else {
          setError(data.message);
        }
      });
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex min-h-[150px] flex-col gap-4 w-full rounded overflow-x-hidden bg-main-100 dark:bg-main-900 ">
        <div className="flex justify-between items-center px-4 pt-4 text-main-0 dark:text-main-1000">
          <h3 className="  font-bold whitespace-nowrap ">
            Leave a review for this service
          </h3>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <form
          className="flex flex-col w-full gap-2 p-4 text-left bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-full">
            <TextField
              id="comment"
              name="comment"
              label="Review"
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              multiline
              rows={4}
              variant="outlined"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="rating">Rating:</label>
            <div className="flex gap-1 py-2">
              {[...Array(5)].map((star, index) => (
                <AcUnitIcon
                  key={index}
                  className={`text-[#333] cursor-pointer hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in ${
                    review.rating > index ? "text-green-600" : ""
                  }`}
                  onClick={() => setReview({ ...review, rating: index + 1 })}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end w-full">
            <button type="submit" className={"button"}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </BasicModal>
  );
}
