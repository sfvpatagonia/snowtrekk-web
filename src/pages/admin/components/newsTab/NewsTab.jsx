import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import AddNewsModal from "./components/AddNewsModal";
import AdminConfirmationModal from "../adminConfirmationModal/AdminConfirmationModal";
import AdminErrorModal from "../adminErrorModal/AdminErrorModal";
import AdminChoiceModal from "../AdminChoiceModal";
import AdminTable from "../adminTable/AdminTable";
import getNews from "@/services/getNews";
import deleteNews from "@/services/deleteNews";
import { useSelector } from "react-redux";
import changeVisibility from "@/services/changeVisibility";

const NewsTab = ({ darkMode, active }) => {
  const PAGE_SIZE = Math.floor((window.innerHeight - 200) / 37.5);
  const [news, setNews] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [choiceModal, setChoiceModal] = useState(null);
  const destinationsRedux = useSelector((state) => state.destinations);
  const citiesRedux = useSelector((state) => state.cities);
  const areasRedux = useSelector((state) => state.areas);
  const countriesRedux = useSelector((state) => state.countries);
  const regionsRedux = useSelector((state) => state.regions);
  const activitiesRedux = useSelector((state) => state.activities);
  const destinations = destinationsRedux.destinations;
  const cities = citiesRedux.cities;
  const areas = areasRedux.areas;
  const countries = countriesRedux.countries;
  const regions = regionsRedux.regions;
  const activities = activitiesRedux.activities;

  const loadingdGrid = new Array(PAGE_SIZE + 2).fill(<Skeleton height={37} />);

  const columns = [
    {
      field: "title",
    },
    {
      field: "content",
    },
    {
      field: "Images",
    },
    {
      field: "updatedAt",
    },
  ];

  useEffect(() => {
    if (shouldFetch) {
      setLoading(true);
      getNews().then((data) => {
        const newsData = data.body.news;
        setNews(newsData);
        setLoading(false);
      });
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const refreshData = () => {
    setShouldFetch(true);
  };

  const handleVisibility = (id) => {
    const index = news.findIndex((singleNews) => singleNews.id === id);
    changeVisibility({ id, field: "isVisible", type: "news" }).then((data) => {
      if (!data.ok) {
        return setError(data.message);
      }
      setMessage(data.message);
      news[index].isVisible = !news[index].isVisible;
      setNews([...news]);
    });
  };

  const handleEdit = (id) => {
    const index = news.findIndex((singleNews) => singleNews.id === id);
    setEditData(news[index]);
    setAddModal(true);
  };

  const handleDelete = (id) => {
    setChoiceModal(id);
  };

  return (
    <div className="flex flex-col gap-4 items-end w-full overflow-auto py-4">
      <div className="flex gap-2">
        <button className="button" onClick={() => setAddModal(true)}>
          Add News
        </button>
      </div>
      <Box sx={{ height: "90%", width: "100%" }}>
        {loading ? (
          loadingdGrid.map((loading, index) => <div key={index}>{loading}</div>)
        ) : (
          <AdminTable
            rows={news}
            columns={columns}
            pageSize={PAGE_SIZE}
            darkMode={darkMode}
            filter={null}
            columnsVisibility={{ isVisible: false }}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleVisibility={handleVisibility}
          />
        )}
      </Box>
      {addModal && (
        <AddNewsModal
          open={addModal}
          setOpen={setAddModal}
          refreshData={refreshData}
          setError={setError}
          setMessage={setMessage}
          editData={editData}
          setEditData={setEditData}
          destinations={destinations}
          cities={cities}
          areas={areas}
          countries={countries}
          regions={regions}
          activities={activities}
        />
      )}
      <AdminConfirmationModal
        open={message !== ""}
        setOpen={() => setMessage("")}
        message={message}
      />

      <AdminErrorModal
        open={error !== null}
        setOpen={() => setError(null)}
        error={error}
      />
      <AdminChoiceModal
        open={choiceModal !== null}
        setOpen={() => setChoiceModal(null)}
        message={"Are you sure you want to delete this news?"}
        actionFunction={() =>
          deleteNews(choiceModal).then((data) => {
            if (data.ok) {
              setMessage(data.message);
              setNews(
                news.filter((singleNews) => singleNews.id !== choiceModal)
              );
              setShouldFetch(true);
            } else {
              setError(data.message);
            }
            setChoiceModal(null);
          })
        }
      />
    </div>
  );
};

export default NewsTab;
