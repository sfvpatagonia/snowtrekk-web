import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FeedIcon from "@mui/icons-material/Feed";
import StarIcon from "@mui/icons-material/Star";
import ReviewsIcon from "@mui/icons-material/Reviews";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StoreIcon from "@mui/icons-material/Store";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/redux/userSlice";
import userService from "@/services/user";

export default function MenuNavigation({ activeTab, updateQuery }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await userService.logout();
    dispatch(logout());
    navigate("/");
  };

  const renderOptions = (option, index) => {
    let IconComponent = null;

    switch (option) {
      case "Information":
        IconComponent = FeedIcon;
        break;
      case "Purchases":
        IconComponent = ShoppingBagIcon;
        break;
      case "Favorites":
        IconComponent = StarIcon;
        break;
      case "Reviews":
        IconComponent = ReviewsIcon;
        break;
      // case "Claims":
      //   IconComponent = LiveHelpIcon;
      //   break;
      default:
        break;
    }

    return (
      <li key={index}>
        <button
          className={`button text-sm gap-2 sm:w-full ${
            activeTab === option.toLowerCase() && "!bg-green-700"
          }`}
          onClick={() => updateQuery(option.toLowerCase())}
        >
          {IconComponent && <IconComponent />}
          <span className="hidden sm:block">{option}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="sticky flex flex-col md:w-50 top-4 p-2 md:p-6 rounded-lg h-max bg-main-50 dark:bg-main-950 gap-4 shadow-lg ">
      <h1 className="hidden md:block font-bold text-main-0 dark:text-main-1000 ">
        My account
      </h1>
      <ul className="flex flex-col w-full gap-4">
        {["Information", "Purchases", "Favorites", "Reviews"].map(
          (option, index) => renderOptions(option, index)
        )}
        <li>
          {user.hasShop ? (
            <Link className={`button text-sm gap-2`} to={"/my-shop"}>
              <StoreIcon />
              <span className="hidden sm:block">My Shop</span>
            </Link>
          ) : (
            <button
              className={`button text-sm gap-2 w-full ${
                activeTab === "create-shop" && "!bg-green-700"
              }`}
              onClick={() => updateQuery("create-shop")}
            >
              <AddBusinessIcon />
              <span className="hidden sm:block ">I Want To Sell</span>
            </button>
          )}
        </li>
        {user.role === "admin" && (
          <li>
            <Link className={`button text-sm gap-2  `} to={"/admin"}>
              <RocketLaunchIcon />
              <span className="hidden sm:block">Admin Panel</span>
            </Link>
          </li>
        )}
        <li>
          <button
            className={`button text-sm gap-2 sm:w-full`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span className="hidden sm:block">Log Out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
