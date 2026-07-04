export default function TermsForShops() {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col w-full max-w-4xl text-left items-center p-4 bg-main-50 dark:bg-main-950 rounded shadow">
      <h1 className="text-2xl">
        Terms and Conditions for Becoming a Store User
      </h1>
      <p className="flex self-end font-bold">
        Effective Date: {getTodayDate()}
      </p>
      <p className="mt-4 flex-w-full">
        By transitioning from a regular user to a store user ("Store Owner") on
        our platform, you agree to the following terms and conditions. These
        terms apply in addition to our general Terms of Service and Privacy
        Policy. Please read them carefully.
      </p>
      <ol className="flex flex-col gap-2 mt-8 max-w-full ml-2 ">
        <li>
          <span className="font-bold">Account Eligibility</span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>You must be at least 18 years old to create a store.</li>
            <li>
              You are responsible for ensuring that all information provided is
              accurate and up to date.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Store Management</span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>
              As a Store Owner, you agree to provide services or products as
              described in your store profile with honesty and integrity.
            </li>
            <li>
              You are responsible for managing your store, including updating
              your listings, handling customer inquiries, and ensuring timely
              delivery of services or products.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Prohibited Activities</span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>
              Misrepresentation of products or services, fraudulent activity, or
              any behavior violating local laws is strictly prohibited.
            </li>
            <li>
              Violation of these terms may result in the suspension or
              termination of your store.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">
            Compliance with Legal and Tax Obligations
          </span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>
              You are solely responsible for complying with applicable laws,
              regulations, and tax obligations in relation to your store
              operations.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Termination</span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>
              We reserve the right to suspend or terminate your store if you
              violate these terms or engage in activities that harm the platform
              or its users.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Acceptance</span>
          <ul className="flex flex-col gap-1 ml-4 list-disc">
            <li>
              By proceeding, you confirm that you have read, understood, and
              agreed to these terms and conditions, and you also agree with our
              cancellation and refund policies.
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
}
