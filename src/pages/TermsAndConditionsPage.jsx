import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />

      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new4.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main className="flex flex-col w-full overflow-hidden gap-6 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6 p-6 rounded-lg text-main-0 dark:text-main-1000 text-left">
          {/* TITLE */}
          <section className="text-center py-6">
            <h1 className="text-3xl font-black text-main-600 dark:text-main-400 uppercase">
              Terms and Conditions
            </h1>
            <p className="mt-2 font-semibold text-main-0 dark:text-main-1000">
              Snowtrekk
            </p>
            <p className="text-sm opacity-70 mt-1">Last updated: 27/11/2025</p>
          </section>

          {/* CONTENT */}
          <section className="flex flex-col gap-6 text-main-0 dark:text-main-1000 text-sm leading-relaxed">
            <p>
              Welcome to <strong>Snowtrekk</strong>. These Terms and Conditions
              govern the use of our website, mobile application, and services.
              By accessing or using the platform, you agree to be legally bound
              by these Terms. If you do not agree, you must not use the
              platform.
            </p>

            {/* 1 */}
            <h2 className="text-lg font-bold">1. Purpose of the Platform</h2>
            <p>
              Snowtrekk provides tourism-related information, product and
              service sales, and allows users to register and sell their own
              tourism-related products or services as independent vendors.
              Snowtrekk acts solely as a technological intermediary.
            </p>

            {/* 2 */}
            <h2 className="text-lg font-bold">2. Eligibility</h2>
            <p>
              To use the platform, you must be at least 18 years old and have
              the legal capacity to enter into binding contracts under Argentine
              law.
            </p>

            {/* 3 */}
            <h2 className="text-lg font-bold">3. User Accounts</h2>
            <ul className="list-disc ml-6">
              <li>You must provide accurate and updated information.</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                password.
              </li>
              <li>
                You are responsible for all activities performed under your
                account.
              </li>
              <li>
                Snowtrekk may suspend accounts for violations of these Terms.
              </li>
            </ul>

            {/* 4 */}
            <h2 className="text-lg font-bold">4. Vendor Accounts</h2>
            <ul className="list-disc ml-6">
              <li>
                Vendors are fully responsible for the legality of their products
                and services.
              </li>
              <li>
                Prices, descriptions, images, and availability must be accurate.
              </li>
              <li>
                Vendors must comply with all tax, commercial, and tourism
                regulations.
              </li>
              <li>Snowtrekk is not responsible for vendor fulfillment.</li>
            </ul>

            {/* 5 */}
            <h2 className="text-lg font-bold">5. Purchases</h2>
            <p>
              All purchases made through Snowtrekk generate a direct contractual
              relationship between the buyer and the vendor. Snowtrekk is not
              the seller unless explicitly stated.
            </p>

            {/* 6 */}
            <h2 className="text-lg font-bold">6. Payments</h2>
            <p>
              Payments are processed through third-party payment gateways.
              Snowtrekk does not store credit card information and is not
              responsible for payment processing errors.
            </p>

            {/* 7 */}
            <h2 className="text-lg font-bold">7. Refunds and Cancellations</h2>
            <p>
              Refund and cancellation policies depend on each vendor and the
              product or service purchased. Vendors are required to comply with
              Argentine Consumer Protection Law.
            </p>

            {/* 8 */}
            <h2 className="text-lg font-bold">8. User Conduct</h2>
            <ul className="list-disc ml-6">
              <li>
                No illegal, abusive, fraudulent, or harmful behavior is
                permitted.
              </li>
              <li>No false information or impersonation.</li>
              <li>No system interference, hacking, or data scraping.</li>
            </ul>

            {/* 9 */}
            <h2 className="text-lg font-bold">9. Intellectual Property</h2>
            <p>
              All platform content including design, logos, text, software, and
              multimedia content is the exclusive property of Snowtrekk or its
              licensors and is protected by intellectual property laws.
            </p>

            {/* 10 */}
            <h2 className="text-lg font-bold">10. User Content</h2>
            <p>
              Users retain ownership of the content they upload but grant
              Snowtrekk a non-exclusive, worldwide, royalty-free license to
              display and promote such content for platform operation.
            </p>

            {/* 11 */}
            <h2 className="text-lg font-bold">11. Limitation of Liability</h2>
            <p>
              Snowtrekk is not liable for damages arising from vendor services,
              third-party failures, incorrect product information, service
              interruptions, or force majeure.
            </p>

            {/* 12 */}
            <h2 className="text-lg font-bold">12. Platform Availability</h2>
            <p>
              Snowtrekk does not guarantee uninterrupted service and may perform
              maintenance or system updates without prior notice.
            </p>

            {/* 13 */}
            <h2 className="text-lg font-bold">13. Termination</h2>
            <p>
              Snowtrekk may suspend or terminate user accounts without notice if
              these Terms are violated. Users may delete their accounts at any
              time.
            </p>

            {/* 14 */}
            <h2 className="text-lg font-bold">14. External Links</h2>
            <p>
              Snowtrekk is not responsible for the content or privacy practices
              of third-party websites.
            </p>

            {/* 15 */}
            <h2 className="text-lg font-bold">
              15. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms are governed by the laws of the Argentine Republic.
              Any dispute shall be submitted to the ordinary courts of the City
              of Buenos Aires.
            </p>

            {/* 16 */}
            <h2 className="text-lg font-bold">16. Modifications</h2>
            <p>
              Snowtrekk reserves the right to modify these Terms at any time.
              Changes will be published on the platform and become effective
              immediately.
            </p>

            {/* 17 */}
            <h2 className="text-lg font-bold">17. Contact</h2>
            <p>
              For any questions regarding these Terms and Conditions, contact:
              <br />
              <strong>info@snowtrekk.com</strong>
            </p>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
