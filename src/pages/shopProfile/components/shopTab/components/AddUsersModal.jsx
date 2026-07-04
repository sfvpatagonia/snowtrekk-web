import { useState } from "react";
import BasicModal from "@/components/basicModal/BasicModal";
import {
  TextField,
} from "@mui/material";
import shop from "@/services/shop";
import { useSelector } from "react-redux";

export default function AddUsersModal({ open, setOpen, users, setShop }) {
  const [input, setInput] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState("");
  const user = useSelector((state) => state.user);
  const shopRedux = useSelector((state) => state.shop);
  const handleAddUser = () => {
    setLoading(true);
    setError(null);

    if (newUser.trim() === "") {
      setError("Please enter a valid email");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(newUser)) {
      setError("Please enter a valid email");
      return;
    }

    shop
      .addUserToShop(shopRedux.id, newUser, user.token)
      .then((data) => {
        if (data.ok) {
          setShop((prev) => ({
            ...prev,
            users: [
              ...prev.users,
              {
                email: newUser,
                id: data.body.addedUserToShop.idUser,
                UsersShop: { role: "operator" },
              },
            ],
          }));

          setInput(false);
          setNewUser("");
        } else {
          setError(data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMakeAdmin = (userId) => {
    setLoading(true);
    setError(null);

    shop
      .makeAdmin(shopRedux.id, userId, user.token)
      .then((data) => {
        if (data.ok) {
          setShop((prev) => ({
            ...prev,
            users: prev.users.map((user) =>
              user.id === userId
                ? { ...user, UsersShop: { role: "admin" } }
                : user
            ),
          }));
        } else {
          setError(data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMakeOperator = (userId) => {
    setLoading(true);
    setError(null);
    shop
      .removeAdmin(shopRedux.id, userId, user.token)
      .then((data) => {
        if (data.ok) {
          setShop((prev) => ({
            ...prev,
            users: prev.users.map((user) =>
              user.id === userId
                ? { ...user, UsersShop: { role: "operator" } }
                : user
            ),
          }));
        } else {
          setError(data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveUser = (userId) => {
    setLoading(true);
    setError(null);
    shop
      .removeUserFromShop(shopRedux.id, userId, user.token)
      .then((data) => {
        if (data.ok) {
          setShop((prev) => ({
            ...prev,
            users: prev.users.filter((user) => user.id !== userId),
          }));
        } else {
          setError(data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <div className="flex flex-col w-full max-w-[800px] p-4 gap-8 bg-main-100 dark:bg-main-900 rounded">
        <h2 className="text-main-0 dark:text-main-1000 text-2xl">
          Associated Users to this shop
        </h2>
        <div>
          <ul className="flex flex-col gap-2">
            {users?.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center w-full rounded gap-4 shadow p-2 bg-main-50 dark:bg-main-950 text-main-0 dark:text-main-1000"
              >
                <div>
                  <p>{user.email}</p>
                  {/* <p className={styles.userRole}>
                    {user.UsersShop.role === "creator"
                      ? "Creator"
                      : user.UsersShop.role === "admin"
                      ? "Admin"
                      : "User"}
                  </p> */}
                </div>
                {user.UsersShop.role === "creator" ? (
                  <p>Creator</p>
                ) : (
                  <div className="flex gap-2 px-2">
                    <button
                      className={`button `}
                      onClick={() => handleRemoveUser(user.id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                    {user.UsersShop.role === "admin" ? (
                      <button
                        className={`button `}
                        onClick={() => handleMakeOperator(user.id)}
                        disabled={loading}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        className={`button`}
                        onClick={() => handleMakeAdmin(user.id)}
                        disabled={loading}
                      >
                        Make Admin
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}

            {input && (
              <div className="flex gap-2 py-4">
                <TextField
                  size="small"
                  label="New user email"
                  variant="outlined"
                  value={newUser}
                  sx={{ width: "100%" }}
                  disabled={loading}
                  onChange={(e) => setNewUser(e.target.value)}
                />
              </div>
            )}
            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-center p-4">
              <button
                className={`button`}
                disabled={loading}
                onClick={() => {
                  if (input) {
                    handleAddUser();
                  } else {
                    setInput(true);
                  }
                }}
              >
                Add user
              </button>
            </div>
          </ul>
        </div>
      </div>
    </BasicModal>
  );
}
