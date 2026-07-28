export function getTags(
  newsData,
  destinations,
  cities,
  areas,
  countries,
  regions,
  activities
) {
  // Función que busca el valor en las listas según el tipoDeId
  const findValueInList = (id, list) => {
    return list.find((item) => item.id === id) || { name: "Unknown" };
  };

  // Agrupar los tags de acuerdo a su tipoDeId y reemplazar relatedId por el nombre
  newsData.forEach((newsItem) => {
    const newTags = {
      destination: [],
      city: [],
      area: [],
      country: [],
      region: [],
      activity: [],
    };

    newsItem.Tags.forEach((tag) => {
      switch (tag.tipoDeId) {
        case "destination":
          newTags.destination.push(
            findValueInList(tag.relatedId, destinations)
          );
          break;
        case "city":
          newTags.city.push(findValueInList(tag.relatedId, cities));
          break;
        case "area":
          newTags.area.push(findValueInList(tag.relatedId, areas));
          break;
        case "country":
          newTags.country.push(findValueInList(tag.relatedId, countries));
          break;
        case "region":
          newTags.region.push(findValueInList(tag.relatedId, regions));
          break;
        case "activity":
          newTags.activity.push(findValueInList(tag.relatedId, activities));
          break;
        default:
          break;
      }
    });

    // Asignar el nuevo objeto tags con los valores reemplazados al newsItem
    newsItem.Tags = newTags;
  });

  return newsData;
}

export function getTagsNews(
  newsData,
  destinations,
  cities,
  areas,
  countries,
  regions,
  activities
) {
  const findValueInList = (id, list) => {
    return list.find((item) => item.id === id) || { name: "Unknown" };
  };

  // Agrupar los tags de acuerdo a su tipoDeId y reemplazar relatedId por el nombre
  newsData.forEach((newsItem) => {
    const newTags = [];

    newsItem.Tags.forEach((tag) => {
      switch (tag.tipoDeId) {
        case "destination":
          newTags.push(findValueInList(tag.relatedId, destinations));
          break;
        case "city":
          newTags.push(findValueInList(tag.relatedId, cities));
          break;
        case "area":
          newTags.push(findValueInList(tag.relatedId, areas));
          break;
        case "country":
          newTags.push(findValueInList(tag.relatedId, countries));
          break;
        case "region":
          newTags.push(findValueInList(tag.relatedId, regions));
          break;
        case "activity":
          newTags.push(findValueInList(tag.relatedId, activities));
          break;
        default:
          break;
      }
    });

    // Asignar el nuevo objeto tags con los valores reemplazados al newsItem
    newsItem.Tags = newTags;
  });

  return newsData;
}
