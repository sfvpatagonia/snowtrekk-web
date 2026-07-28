import { Tooltip } from "@mui/material";

const ShopDetails = ({ shop }) => {
  console.log(shop);
  return (
    <div className="space-y-4 text-black dark:text-white">
      <div className="grid grid-cols-2  gap-4 p-4">
        <div className="flex flex-row gap-2 justify-end lg:justify-center bg-main-50 dark:bg-main-950 p-2 rounded ">
          <b>Name</b>
          <p>{shop.name}</p>
        </div>

        <div className="flex flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap">
          <b>Email</b>
          <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
            {shop.email}
          </p>
        </div>

        <div className="flex flex-row gap-2 justify-end lg:justify-center bg-main-50 dark:bg-main-950 p-2 rounded">
          <b>Legal Name</b>
          <p>{shop.legalName}</p>
        </div>

        <div className="flex flex-row gap-2 lg:justify-center bg-main-50 dark:bg-main-950 p-2 rounded">
          <b>Website</b>
          <p>{shop.website || "---"}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-left pl-4">Users</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {shop.users.map((user) => (
          <Tooltip key={user.id} title={`${user.email} `} placement="top">
            <div
              key={user.id}
              className="flex flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap"
            >
              <p className="max-w-full whitespace-nowrap overflow-hidden text-ellipsis font-bold">
                {user.name + " " + user.lastName}
              </p>
            </div>
          </Tooltip>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-left pl-4">Description</h2>

      <div className="bg-main-50 dark:bg-main-950 p-4 rounded text-left overflow-auto max-h-60">
        <p className="whitespace-pre-wrap">{shop.description}</p>
      </div>
    </div>
  );
};

export default ShopDetails;
