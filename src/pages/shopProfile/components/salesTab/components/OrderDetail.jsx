import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function OrderDetail({
  isModalOpen,
  handleCloseModal,
  selectedOrder,
}) {
  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        {selectedOrder && (
          <div className="p-4 text-main-0 dark:text-main-1000">
            <div className="flex justify-between items-center mb-4">
              <p>
                <strong>Order Number:</strong> {selectedOrder.orderNumber} |{" "}
                <strong>Total:</strong> ${selectedOrder.orderTotal.toFixed(2)} |{" "}
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-5 p-4  rounded bg-main-50 dark:bg-main-950 shadow text-left">
              <h2 className="font-bold text-xl mb-3">Client Data:</h2>
              <p>
                <strong>Name:</strong> {selectedOrder.user?.name || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                {selectedOrder.user?.lastName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.user?.phone || "N/A"}
              </p>
            </div>

            <div className="mt-5 p-4  rounded bg-main-50 dark:bg-main-950 shadow text-left">
              <h2 className="font-bold text-xl mb-3">Purchased Services:</h2>
              {selectedOrder.services.map((service, index) => (
                <div
                  key={index}
                  className="p-4 mt-3  bg-main-100 dark:bg-main-900 rounded"
                >
                  <p>
                    <strong>Name:</strong> {service.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {service.description}
                  </p>
                  <p>
                    <strong>Difficulty:</strong> {service.difficulty}
                  </p>
                  <p>
                    <strong>Price:</strong> ${service.price.toFixed(2)}
                  </p>
                  <p>
                    <strong>Duration:</strong> {service.duration} minutes
                  </p>
                  <p>
                    <strong>Transport Included:</strong>{" "}
                    {service.transportIncluded ? "Yes" : "No"}
                  </p>
                  {service.transport ? (
                    <p>
                      <strong>Transport:</strong> {service.transport}
                    </p>
                  ) : (
                    ""
                  )}
                  <p>
                    <strong>Cancelation:</strong> {service.cancelation || "No"}
                  </p>
                  {service.ageLimit ? (
                    <p>
                      <strong>Age Limit:</strong> {service.ageLimit} years
                    </p>
                  ) : (
                    <p>
                      <strong>No Age limit</strong>
                    </p>
                  )}
                  <p>
                    <strong>Includes:</strong> {service.includes.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
      <div className="flex justify-end p-4">
        <button className="button" onClick={handleCloseModal}>
          Close
        </button>
      </div>
    </Dialog>
  );
}
