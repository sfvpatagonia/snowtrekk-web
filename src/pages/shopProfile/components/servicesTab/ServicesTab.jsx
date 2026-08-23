import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import FilterItemsBy from "@/components/FilterItemsBy";
import ServiceTable from "./components/ServiceTable";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import serviceService from "@/services/service";
import { useSelector } from "react-redux";

export default function ServicesTab() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService
      .getServices(shop.id, user.token)
      .then((data) => {
        if (!data.ok) {
          throw new Error(data.message);
        }
        setServices(data.body.services);
        setFilteredServices(data.body.services);

        const categories = Array.from(
          new Map(
            data.body.services
              .flatMap((item) => item.categories) // Aplanar las categorías
              .map((category) => [category.id, category]) // Crear pares [id, category]
          ).values() // Obtener las categorías únicas
        );

        setActivities(categories);
      })
      .catch((error) => {
        console.error(error);

        navigate("/join");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (services.length !== 0) {
      setFilteredServices(
        services.filter((service) => service.name.includes(query))
      );
    }
  }, [query]);

  const filterByCategory = (categories) => {
    if (categories.length === 0 && query === "") {
      setFilteredServices(services);
      return;
    }
    if (categories.length === 0 && query !== "") {
      setFilteredServices(
        services.filter((service) => service.name.includes(query))
      );
      return;
    }
    const filtered = services.filter((service) => {
      return service.categories.some((category) =>
        categories.includes(category.name)
      );
    });
    setFilteredServices(filtered);
  };

  return (
    <main className="flex flex-col flex-1 items-center py-4 gap-2 max-w-full overflow-auto">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-end w-full gap-4 p-4 max-w-[1024px]">
        <TextField
          fullWidth
          placeholder="Search"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          className="flex-1"
        />
        <FilterItemsBy
          title="Category"
          options={activities.map((activity) => activity.name)}
          filterBy={filterByCategory}
        />
        <Link to={`/my-shop?tab=create-service`} reloadDocument>
          <button className="button">
            <AddIcon />
            New Service
          </button>
        </Link>
      </div>

      <ServiceTable
        services={filteredServices}
        setServices={setFilteredServices}
        query={query}
        loading={loading}
      />
    </main>
  );
}
