import { Edit } from "@mui/icons-material";

export default function Policy({ name, label, policy, setOpenPoliciesModal }) {
  return (
    <div className="flex w-full flex-col md:flex-row">
      <h3 className="text-main-600 dark:text-main-400 text-left w-[300px]">
        {label}
      </h3>
      {policy ? (
        <pre className="flex text-main-0 dark:text-main-1000 bg-main-100 dark:bg-main-900 p-4 rounded w-full overflow-hidden justify-between text-left text-wrap">
          {policy}
          <span
            className="cursor-pointer text-green-600 hover:text-main-600 hover:dark:text-main-400 duration-300 ease-in"
            onClick={() =>
              setOpenPoliciesModal({
                isOpen: true,
                name,
                label,
                prev: policy,
              })
            }
          >
            <Edit />
          </span>
        </pre>
      ) : (
        <div className="flex flex-col items-center justify-center bg-main-100 dark:bg-main-900 w-full rounded">
          <p className="flex text-main-0 dark:text-main-1000 bg-main-100 dark:bg-main-900 p-4 rounded w-full overflow-hidden justify-between text-left text-wrap">
            You have not loaded this policy yet.
            <button
              onClick={() =>
                setOpenPoliciesModal({
                  isOpen: true,
                  name,
                  label,
                })
              }
            >
              <p className="underline text-green-700 dark:text-green-500 cursor-pointer duration-200 ease-in hover:text-main-600 dark:hover:text-main-400">
                Add this policy
              </p>
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
