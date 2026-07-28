import { Link } from "react-router-dom";
import SmsIcon from "@mui/icons-material/Sms";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import IceSkatingIcon from "@mui/icons-material/IceSkating";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function MenuNavigation({ activeTab, updateQuery }) {
  //const user = useSelector((state) => state.user);

  // const user = {
  //   hasShop: true,
  //   isAdmin: true,
  // };

  const renderOptions = (option, index) => {
    let IconComponent = null;

    switch (option) {
      case "Shop":
        IconComponent = StoreIcon;
        break;
      case "Products":
        IconComponent = IceSkatingIcon;
        break;
      case "Services":
        IconComponent = SnowboardingIcon;
        break;
      case "Sales":
        IconComponent = EqualizerIcon;
        break;
      case "Chats":
        IconComponent = SmsIcon;
        break;
      case "Billing":
        IconComponent = ReceiptIcon;
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
          disabled={option === "Products"}
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
        {["Shop", "Products", "Services", "Sales", "Chats", "Billing"].map(
          (option, index) => renderOptions(option, index),
        )}
        <li>
          <Link className={`button text-sm gap-2  `} to={"/my-profile"}>
            <ArrowBackIcon />
            <span className="hidden sm:block">Back to profile</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
