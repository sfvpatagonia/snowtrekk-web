import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function CancellationPolicyPage() {
  return (
    <>
      <Header />

      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new4.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main className="flex flex-col w-full overflow-hidden gap-6 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6 p-6 rounded-lg text-main-0 dark:text-main-1000 text-left">
          {/* TITLE */}
          <section className="text-center py-6">
            <h1 className="text-3xl font-black text-main-600 dark:text-main-400 uppercase">
              Cancellation & Refund Policy
            </h1>
            <p className="mt-2 font-semibold text-main-0 dark:text-main-1000">
              Snowtrekk
            </p>
            <p className="text-sm opacity-70 mt-1">Last updated: 27/11/2025</p>
          </section>

          {/* CONTENT */}
          <section className="flex flex-col gap-6 text-main-0 dark:text-main-1000 text-sm leading-relaxed">
            <p>
              This Cancellation and Refund Policy applies to all purchases made
              through
              <strong> Snowtrekk</strong>. By making a purchase on our platform,
              you agree to the terms described below. Snowtrekk acts as a
              technological intermediary between buyers and independent vendors.
            </p>

            {/* 1 */}
            <h2 className="text-lg font-bold">1. General Conditions</h2>
            <p>
              Cancellation and refund conditions depend on the individual vendor
              offering the product or service. Each vendor is responsible for
              clearly stating their own cancellation rules prior to purchase.
            </p>

            {/* 2 */}
            <h2 className="text-lg font-bold">2. Services and Experiences</h2>
            <ul className="list-disc ml-6">
              <li>
                Cancellations may be allowed up to a specific time before the
                activity.
              </li>
              <li>Late cancellations may result in partial or no refunds.</li>
              <li>No-shows are generally non-refundable.</li>
              <li>
                Weather or safety-related cancellations may qualify for
                rescheduling or refunds.
              </li>
            </ul>

            {/* 3 */}
            <h2 className="text-lg font-bold">3. Product Purchases</h2>
            <ul className="list-disc ml-6">
              <li>
                Physical products may be subject to return within legal
                timeframes.
              </li>
              <li>Products must be unused and in original packaging.</li>
              <li>Return shipping costs may apply.</li>
            </ul>

            {/* 4 */}
            <h2 className="text-lg font-bold">4. Digital Products</h2>
            <p>
              Digital products, vouchers, or downloadable content are generally
              non-refundable once delivered unless the product is defective.
            </p>

            {/* 5 */}
            <h2 className="text-lg font-bold">5. Refund Processing</h2>
            <ul className="list-disc ml-6">
              <li>
                Approved refunds are processed using the original payment
                method.
              </li>
              <li>Processing times depend on the payment provider.</li>
              <li>Snowtrekk is not responsible for bank processing delays.</li>
            </ul>

            {/* 6 */}
            <h2 className="text-lg font-bold">6. Vendor Responsibility</h2>
            <p>
              Vendors are solely responsible for honoring their cancellation and
              refund policies in accordance with Argentine Consumer Protection
              Law (Law No. 24.240).
            </p>

            {/* 7 */}
            <h2 className="text-lg font-bold">7. Platform Intervention</h2>
            <p>
              Snowtrekk may intervene as a mediator in disputes but is not
              responsible for issuing refunds unless it acted as the direct
              seller.
            </p>

            {/* 8 */}
            <h2 className="text-lg font-bold">8. Force Majeure</h2>
            <p>
              No refunds will be issued for cancellations caused by force
              majeure events such as natural disasters, strikes, pandemics,
              government restrictions, or other unavoidable circumstances.
            </p>

            {/* 9 */}
            <h2 className="text-lg font-bold">9. Fraud and Abuse</h2>
            <p>
              Snowtrekk reserves the right to deny refunds in cases of suspected
              fraud, abuse, or violation of platform policies.
            </p>

            {/* 10 */}
            <h2 className="text-lg font-bold">10. Policy Modifications</h2>
            <p>
              Snowtrekk reserves the right to modify this policy at any time.
              Changes will become effective upon publication on the platform.
            </p>

            {/* 11 */}
            <h2 className="text-lg font-bold">11. Applicable Law</h2>
            <p>
              This policy is governed by the laws of the Argentine Republic,
              including Consumer Protection Law No. 24.240.
            </p>

            {/* 12 */}
            <h2 className="text-lg font-bold">12. Contact</h2>
            <p>
              For any cancellation or refund requests, contact:
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
