import defaultImage1 from "@/assets/bonfire.png";
import defaultImage2 from "@/assets/ski.png";
import defaultImage3 from "@/assets/snowflake.png";
import defaultImage4 from "@/assets/snowmobile.png";
import defaultImage5 from "@/assets/google.png";
import defaultImage6 from "@/assets/earmuffs.png";
import defaultImage from "@/assets/beanie.png";
const giveDefaultImage = (type) => {
  switch (type) {
    case 1:
      return defaultImage1;
    case 2:
      return defaultImage2;
    case 3:
      return defaultImage3;
    case 4:
      return defaultImage4;
    case 5:
      return defaultImage5;
    case 6:
      return defaultImage6;
    default:
      return defaultImage;
  }
};

export default giveDefaultImage;
