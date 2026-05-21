import OrderItemsBy from "@/components/orderItemsBy/OrderItemsBy";
import ReviewCard from "./components/ReviewCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import reviewsServices from "@/services/reviews";
import { Skeleton } from "@mui/material";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    reviewsServices
      .getMyReviews(user.token)
      .then((data) => {
        if (data.ok) {
          setReviews(data.reviews);
        } else {
          setError("An error has occurred. Try again later");
        }
      })
      .finally(() => setLoading(false));
  }, []);


  return (
    <main className="flex flex-col flex-1 items-center gap-2 max-w-full overflow-hidden py-4">
      <OrderItemsBy />
      <h2 className="hidden md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
        My Reviews
      </h2>
      <div className="max-w-[1024px] w-full mx-auto">
        <ul className="flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton variant="rounded" height={250} />
              <Skeleton variant="rounded" height={250} />
              <Skeleton variant="rounded" height={250} />
            </>
          ) : error ? (
            <p className="text-red-600 w-full text-left text-lg py-8 px-2">
              {error}
            </p>
          ) :  reviews.length === 0 ? 
          <h4>
            There are no reviews yet
          </h4>
          :(
            reviews.map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
