import { Link } from "react-router-dom";
import { formatDateMMMMdYYYY } from "@/utils/dateParser";
import giveDefaultImage from "@/utils/profileshoppic";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import ShowReviewModal from "./ShowReviewModal";

export default function PurchaseCard({ purchase }) {
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedIdService, setSelectedIdService] = useState(null);
  const [selectedIdOrderService, setSelectedIdOrderService] = useState(null);
  const [showReview, setShowReview] = useState(null);

  return (
    <li className="flex flex-col rounded shadow-lg w-full bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000">
      <div className="flex justify-between p-4 items-start border-b border-main-600 dark:border-main-400">
        <h3>Purchase number: {purchase.purchaseCode}</h3>
        <span>Date: {formatDateMMMMdYYYY(purchase.createdAt)}</span>
        <span className="capitalize font-bold text-main-600 dark:text-main-400">
          {purchase.status}
        </span>
      </div>
      <ul className="flex flex-col gap-2 p-4 pt-2">
        {purchase.Orders.map((order, index) => (
          <li className="flex w-full py-2 px-0" key={index}>
            <div className="flex justify-center items-center max-w-38 p-2 bg-main-100 dark:bg-main-900 rounded-l-lg">
              <Link to={`/shop/${order.Shop.id}/`}>
                <img
                  className="w-full aspect-square object-contain rounded"
                  src={
                    order.Shop.Image
                      ? order.Shop.Image.url
                      : giveDefaultImage(index)
                  }
                  alt={order.Shop.name}
                />
              </Link>
            </div>
            <div className="flex flex-col gap-2 flex-1 p-2 items-start border rounded-r-lg border-main-100 dark:border-main-900">
              <div className="flex justify-between w-full ">
                <Link to={`/shop/${order.Shop.id}`}>
                  <h3 className="font-bold text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in">
                    {order.Shop.name}
                  </h3>
                </Link>
                <Link
                  className="underline text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in"
                  to={`/shop/${order.Shop.id}/chat/${order.orderNumber}`}
                >
                  {" "}
                  Send a message to the seller
                </Link>
              </div>

              {order.products &&
                order.products.map((product, index) => (
                  <div className="flex flex-col w-full gap-2" key={index}>
                    <div className="flex w-full gap-2">
                      <Link to={`/service/${service.id}`}>
                        <p className="text-main-0 dark:text-main-1000 hover:text-green-600 duration-200 ease-in">
                          {product.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex w-full gap-2">
                      {product.OrderProducts &&
                      product.OrderProducts[0].Reviews.length > 0 ? (
                        <div>
                          <p
                            className="text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in underline cursor-pointer"
                            onClick={() =>
                              setShowReview(product.OrderProducts[0].Reviews[0])
                            }
                          >
                            Raiting:{" "}
                            {product.OrderProducts[0].Reviews[0]?.score}/5
                          </p>
                        </div>
                      ) : (
                        <button
                          className="text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in underline cursor-pointer"
                          onClick={() => {
                            setSelectedIdService(product.id);
                            setSelectedIdOrderService(product.OrderProducts.id);
                            setReviewModal(true);
                          }}
                        >
                          Make a Review
                        </button>
                      )}
                    </div>
                    <div className="flex w-full gap-2 text-sm">
                      <p>
                        {service.OrderService.quantity} x U$D{" "}
                        {service.OrderService.purchasedPrice}
                      </p>
                      <div
                        className="flex-1  border-main-0 dark:border-main-1000 border-dashed border-b"
                        aria-hidden="true"
                      ></div>
                      <p >
                        U$D{" "}
                        {service.OrderService.quantity *
                          service.OrderService.purchasedPrice}
                      </p>
                    </div>
                  </div>
                ))}
              {order.services &&
                order.services.map((service, index) => (
                  <div className="flex flex-col w-full gap-2" key={index}>
                    <div className="flex w-full gap-2">
                      <Link to={`/service/${service.id}`}>
                        <p className="text-main-0 dark:text-main-1000 hover:text-green-600 duration-200 ease-in">
                          {service.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex w-full gap-2">
                      {service &&
                      service.OrderServices[0].Reviews.length > 0 ? (
                        <div>
                          <p
                            className="text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in underline cursor-pointer"
                            onClick={() =>
                              setShowReview(service.OrderServices[0].Reviews[0])
                            }
                          >
                            Raiting:{" "}
                            {service.OrderServices[0].Reviews[0]?.score}/5
                          </p>
                        </div>
                      ) : (
                        <button
                          className="text-green-700 dark:text-green-500 hover:text-main-600 duration-200 ease-in underline cursor-pointer"
                          onClick={() => {
                            setSelectedIdService(service.id);
                            setSelectedIdOrderService(service.OrderService.id);
                            setReviewModal(true);
                          }}
                        >
                          Make a Review
                        </button>
                      )}
                    </div>
                    <div className="flex w-full gap-2 text-sm">
                      <p>
                        {service.OrderService.quantity} x U$D{" "}
                        {service.OrderService.purchasedPrice}
                      </p>
                      <div
                        className="flex-1  border-main-0 dark:border-main-1000 border-dashed border-b"
                        aria-hidden="true"
                      ></div>
                      <p >
                        U$D{" "}
                        {service.OrderService.quantity *
                          service.OrderService.purchasedPrice}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end font-bold ">
        <p className="p-4">Total: U$D {purchase.total}</p>
      </div>
      <ReviewModal
        open={reviewModal}
        setOpen={setReviewModal}
        idService={selectedIdService}
        idOrderService={selectedIdOrderService}
      />
      {showReview && (
        <ShowReviewModal
          open={!!showReview}
          setOpen={() => setShowReview(null)}
          review={showReview}
        />
      )}
    </li>
  );
}
