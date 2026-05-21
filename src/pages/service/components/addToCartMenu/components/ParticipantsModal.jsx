import { TextField } from "@mui/material";
import BasicModal from "@/components/basicModal/BasicModal";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { format } from "date-fns";

const REQUIRED_FIELDS = [
  "name",
  "lastName",
  "passportNumber",
  "age",
  "phone",
  "email",
];

export default function ParticipantsModal({ open, setOpen, length, service }) {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      setParticipants(
        Array.from({ length }, () => ({
          name: "",
          lastName: "",
          passportNumber: "",
          age: "",
          phone: "",
          email: "",
        })),
      );
      setIndex(0);
      setError(null);
    }
  }, [open, length]);

  const handleSubmit = () => {
    const hasEmptyFields = participants.some((participant, i) =>
      REQUIRED_FIELDS.some(
        (field) => !participant[field] || participant[field].trim() === "",
      ),
    );

    if (hasEmptyFields) {
      setError("Please complete all fields for every participant");
      return;
    }

    setError(null);
    setOpen(false);

    const [hours, minutes] = service.date.time.split(":").map(Number);

    const fullDate = new Date(
      service.date.date.getFullYear(),
      service.date.date.getMonth(),
      service.date.date.getDate(),
      hours,
      minutes,
    );

    dispatch(
      addToCart({
        ...{
          id: service.id,
          shopId: service.Shop.id,
          price: service.price,
          name: service.name,
          image: service.Images[0],
          date: fullDate.toISOString(),
          quantity: length,
        },
        participants,
      }),
    );
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setParticipants((prevParticipants) => {
      const updatedParticipants = [...prevParticipants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [name]: value,
      };
      return updatedParticipants;
    });
  };

  const handleNext = () => {
    const current = participants[index];

    const hasEmpty = REQUIRED_FIELDS.some(
      (field) => !current[field] || current[field].trim() === "",
    );

    if (hasEmpty) {
      setError("Complete all fields before continuing");
      return;
    }

    setError(null);
    setIndex((prev) => prev + 1);
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className=" bg-main-100 dark:bg-main-900 py-4 rounded shadow text-main-0 dark:text-main-1000">
        <h2>Who are going to go?</h2>
        <form className="flex flex-col w-full gap-4 p-4">
          <TextField
            label="Name"
            placeholder="Name"
            name="name"
            value={participants[index]?.name || ""}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="Lastname"
            placeholder="Lastname"
            name="lastName"
            value={participants[index]?.lastName || ""}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="Passport Number"
            placeholder="Passport Number"
            name="passportNumber"
            value={participants[index]?.passportNumber || ""}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="Age"
            placeholder="Age"
            name="age"
            value={participants[index]?.age || ""}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="Phone"
            placeholder="Phone"
            name="phone"
            value={participants[index]?.phone || ""}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="E-mail"
            placeholder="E-mail"
            name="email"
            value={participants[index]?.email || ""}
            onChange={(e) => handleChange(e)}
          />
          {error && <p className="text-red-500 dark:text-500">{error}</p>}
        </form>
        <div className="flex justify-between items-center px-4 py-2">
          <button
            className="button"
            onClick={() => {
              setError(null);
              setIndex(index - 1);
            }}
            disabled={index === 0}
          >
            Back
          </button>
          <span>
            {index + 1}/{length}
          </span>
          {index + 1 === length ? (
            <button className="button" onClick={handleSubmit}>
              Finish
            </button>
          ) : (
            <button className="button" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </BasicModal>
  );
}
