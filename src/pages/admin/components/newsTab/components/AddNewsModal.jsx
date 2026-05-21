import { useState } from "react";
import TextField from "@mui/material/TextField";
import BasicModal from "@/components/basicModal/BasicModal";
import newNews from "@/services/newNews";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Autocomplete,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
} from "@mui/material";
import UploadImage from "@/components/UploadImage";
import updateNews from "@/services/updateNews";
import setImages from "@/services/setImages";

const AddNewsModal = ({
  open,
  setOpen,
  refreshData,
  setError,
  setMessage,
  editData,
  setEditData,
  destinations,
  areas,
  cities,
  regions,
  countries,
  activities,
}) => {
  const [tags, setTags] = useState({
    country: countries,
    region: regions,
    area: areas,
    city: cities,
    destination: destinations,
    activity: activities,
  });
  const initialState = {
    title: "",
    content: "",
    featuredUrl: "",
    subtitle: "",
    Images: [],
    tags: {
      country: [],
      region: [],
      area: [],
      city: [],
      destination: [],
      activity: [],
    },
  };
  const [news, setNews] = useState(editData || initialState);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (news.title === "") {
      return setError("The news must to have a title");
    }
    if (news.contain === "") {
      return setError("The news must to have a content");
    }

    const formData = new FormData();

    formData.append("title", news.title);
    formData.append("content", news.content);
    formData.append("featuredUrl", news.featuredUrl);
    formData.append("subtitle", news.subtitle);

    news.Images.forEach((element) => {
      formData.append("image", element);
    });

    const formattedTags = Object.keys(news.tags).reduce((acc, key) => {
      acc[key] = news.tags[key].map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      return acc;
    }, {});

    news.tags = formattedTags;

    formData.append("tags", JSON.stringify(formattedTags));

    if (editData) {
      updateNews(news).then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setImages({ id: editData.id, type: "news" }, formData).then(() => {
          if (!data.ok) {
            return setError(data.message);
          }
        });

        setOpen(false);
        setMessage(data.message);
        refreshData();
      });
      setLoading(false);
    } else {
      newNews(formData).then((data) => {
        if (!data.ok) {
          return setError(data.message);
        }
        setOpen(false);
        setMessage(data.message);
        refreshData();
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderMultipleSelect = (label, name) => (
    <Autocomplete
      multiple={true}
      disableCloseOnSelect
      limitTags={1}
      renderTags={(value, getTagProps) => (
        <Chip
          {...getTagProps}
          variant="filled"
          label={value.length}
          classes={{ filled: "!bg-main-600 dark:!bg-main-400" }}
        />
      )}
      ListboxProps={{
        style: {
          textAlign: "left",
        },
      }}
      sx={{ width: 300, maxWidth: "100%" }}
      id={`id-tags`}
      options={tags[name]}
      value={news?.tags[name] || []}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(e, newValue) => {
        setNews((prev) => ({
          ...prev,
          tags: {
            ...prev?.tags,
            [name]: newValue,
          },
        }));
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={option.id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Select ${label} Tags`}
          placeholder={`${label} Tags`}
        />
      )}
    />
  );

  return (
    <BasicModal
      open={open}
      setOpen={() => {
        setOpen(false);
        setNews(initialState);
        setEditData(null);
      }}
    >
      <div className="absolute flex flex-col items-center justify-center px-12 py-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-main-100 dark:bg-main-900 rounded-lg gap-4">
        <h3 className="text-2xl text-main-0 dark:text-main-1000 font-bold">
          {editData ? "Edit" : "Add"} News
        </h3>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 items-center"
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <TextField
                label="Title"
                name="title"
                value={news.title}
                onChange={handleChange}
                sx={{ width: 300 }}
              />
              <TextField
                label="Subtitle"
                name="subtitle"
                value={news.subtitle}
                onChange={handleChange}
                sx={{ width: 300 }}
              />
              <TextField
                label="Featured URL"
                name="featuredUrl"
                value={news.featuredUrl}
                onChange={handleChange}
                sx={{ width: 300 }}
              />
              <TextField
                label="Content"
                name="content"
                value={news.content}
                onChange={handleChange}
                sx={{ width: 300 }}
                multiline
                rows={7}
              />
            </div>

            <FormControl sx={{ width: 300, display: "flex", gap: "10px" }}>
              {renderMultipleSelect("Country", "country")}
              {renderMultipleSelect("Area", "area")}
              {renderMultipleSelect("Region", "region")}
              {renderMultipleSelect("City", "city")}
              {renderMultipleSelect("Destination", "destination")}
              {renderMultipleSelect("Activity", "activity")}
            </FormControl>
          </div>
          <UploadImage
            currentImages={editData?.Images || []}
            setEditData={setNews}
          />
          <button
            className="button"
            type="submit"
            style={{ color: "white", backgroundColor: "#ff2dd1" }}
          >
            {loading ? (
              <CircularProgress />
            ) : editData ? (
              "Edit News"
            ) : (
              "Add News"
            )}
          </button>
        </form>
      </div>
    </BasicModal>
  );
};
export default AddNewsModal;
