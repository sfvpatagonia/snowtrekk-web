import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { Link } from "react-router-dom";

const ConditionalAccordion = ({
  condition,
  children,
  redirectTo,
  place,
  name,
}) => {
  if (condition) {
    return (
      <div className="flex w-full px-1 gap-4">
        <Accordion
          classes={{
            root: "!bg-main-100 dark:!bg-main-950 w-full",
          }}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon color="primary" />}
            aria-controls={`${place}-content`}
            id={`${place}-header`}
          >
            <h2 className="text-xl whitespace-nowrap text-ellipsis max-w-full text-main-0 dark:text-main-1000">
              {name}
            </h2>
          </AccordionSummary>
          <AccordionDetails
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Link
              to={redirectTo}
              className="flex lg:hidden  rounded-md bg-main-50 dark:bg-main-900 justify-center items-center h-[52px] bg-[linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))] p-4 gap-2 text-main-0 dark:text-main-1000 shadow-md shadow-main-0/10 duration-300 ease-in-out hover:outline outline-transparent hover:outline-green-700"
            >
              <p className="whitespace-nowrap">go to {name}</p>
              <ExitToAppIcon color="primary" />
            </Link>
            {children}
          </AccordionDetails>
        </Accordion>
        <Link
          to={redirectTo}
          className="hidden lg:flex  rounded-md bg-main-100 dark:bg-main-950 justify-center items-center h-[52px] bg-[linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))] p-4 gap-2 text-main-0 dark:text-main-1000 shadow-md shadow-main-0/10 duration-300 ease-in-out hover:outline outline-transparent hover:outline-green-700"
        >
          <p className="whitespace-nowrap">See more</p>
          <ExitToAppIcon color="primary" />
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col my-2 px-1 w-full max-w-full gap-4">
        {children}
      </div>
    );
  }
};

export default ConditionalAccordion;
