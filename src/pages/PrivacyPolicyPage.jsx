import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new4.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main className="flex flex-col w-full overflow-hidden gap-6 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6 p-6 rounded-lg text-main-0 dark:text-main-1000 text-left">
          {/* TITLE */}
          <section className="text-center py-6">
            <h1 className="text-3xl font-black text-main-600 dark:text-main-400 uppercase">
              Privacy Policy
            </h1>
            <p className="mt-2 font-semibold ">Snowtrekk</p>
            <p className="text-sm opacity-70 mt-1">Last updated: 27/11/2025</p>
          </section>

          {/* CONTENT */}
          <section className="flex flex-col gap-6 text-sm leading-relaxed">
            <p>
              This Privacy Policy explains how <strong>Snowtrekk</strong> (“we”,
              “our”, or “us”) collects, uses, and protects your personal data
              when you visit our website, use our mobile application, browse
              destinations, purchase products or services, or register as a
              vendor to sell your own products. By using our platform, you agree
              to the terms described in this Privacy Policy.
            </p>

            {/* 1 */}
            <h2 className="text-lg font-bold">1. Data Controller</h2>
            <p>
              Snowtrekk is responsible for the processing of your personal data.
              Our databases may be registered with the National Registry of
              Personal Data Bases as required by law.
            </p>
            <p>
              Contact email: <strong>info@snowtrekk.com</strong>
            </p>

            {/* 2 */}
            <h2 className="text-lg font-bold">2. Information We Collect</h2>

            <h3 className="font-semibold">2.1 Information You Provide</h3>
            <ul className="list-disc ml-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Account credentials</li>
              <li>Payment and billing information</li>
              <li>Vendor information (if you sell products)</li>
              <li>Messages, reviews, and support communications</li>
            </ul>

            <h3 className="font-semibold">2.2 Automatically Collected Data</h3>
            <ul className="list-disc ml-6">
              <li>IP address</li>
              <li>Browser and device type</li>
              <li>Pages visited, session duration, and interactions</li>
              <li>Cookies and tracking technologies</li>
              <li>Approximate location (if allowed)</li>
            </ul>

            <p>
              Snowtrekk does not intentionally collect sensitive personal data
              as defined by Law 25.326.
            </p>

            {/* 3 */}
            <h2 className="text-lg font-bold">3. Purpose of Data Processing</h2>
            <ul className="list-disc ml-6">
              <li>Provide tourism destination information</li>
              <li>Enable purchases and reservations</li>
              <li>Allow users to sell products on the platform</li>
              <li>Improve navigation and user experience</li>
              <li>Analyze browsing behavior</li>
              <li>Send notifications and support communications</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>

            {/* 4 */}
            <h2 className="text-lg font-bold">
              4. User Rights Under Law 25.326
            </h2>
            <ul className="list-disc ml-6">
              <li>Right of Access</li>
              <li>Right of Rectification</li>
              <li>Right of Update</li>
              <li>Right of Deletion (Supresión)</li>
              <li>Right to Withdraw Consent</li>
              <li>Right to Object to Data Processing</li>
            </ul>

            <p>
              You may exercise these rights by contacting:
              <strong> info@snowtrekk.com</strong>
            </p>

            {/* 5 */}
            <h2 className="text-lg font-bold">5. Data Security</h2>
            <p>
              Snowtrekk applies technical and organizational security measures
              to protect personal data against unauthorized access, loss, or
              misuse.
            </p>

            {/* 6 */}
            <h2 className="text-lg font-bold">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies to improve navigation, personalize content, and
              analyze user behavior. Users may disable cookies in their browser
              settings, although some features may not function correctly.
            </p>

            {/* 7 */}
            <h2 className="text-lg font-bold">7. Data Sharing</h2>
            <p>
              Snowtrekk does not sell personal data. Data may be shared with:
            </p>
            <ul className="list-disc ml-6">
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Hosting services</li>
              <li>Vendors to complete purchases</li>
              <li>Legal authorities when required by law</li>
            </ul>

            {/* 8 */}
            <h2 className="text-lg font-bold">8. International Transfers</h2>
            <p>
              If personal data is transferred outside Argentina, Snowtrekk
              ensures adequate protection in accordance with Article 12 of Law
              25.326.
            </p>

            {/* 9 */}
            <h2 className="text-lg font-bold">9. Minors</h2>
            <p>
              Our platform is not intended for children under 13. Any detected
              data belonging to minors will be deleted immediately.
            </p>

            {/* 10 */}
            <h2 className="text-lg font-bold">10. Policy Updates</h2>
            <p>
              Snowtrekk reserves the right to update this Privacy Policy at any
              time. Continued use of the platform implies acceptance of the
              updated policy.
            </p>

            {/* 11 */}
            <h2 className="text-lg font-bold">11. Contact Information</h2>
            <p>
              For questions regarding this Privacy Policy:
              <br />
              <strong>info@snowtrekk.com</strong>
            </p>

            {/* 12 */}
            <h2 className="text-lg font-bold">12. Data Retention</h2>
            <p>
              Snowtrekk retains personal data only for as long as necessary to
              fulfill the purposes described in this policy, comply with legal
              obligations, resolve disputes, and enforce agreements.
            </p>

            {/* 13 */}
            <h2 className="text-lg font-bold">13. Third-Party Links</h2>
            <p>
              The platform may contain links to third-party websites. Snowtrekk
              is not responsible for their privacy practices or content.
            </p>

            {/* 14 */}
            <h2 className="text-lg font-bold">14. Platform Availability</h2>
            <p>
              Snowtrekk does not guarantee uninterrupted access or error-free
              operation of the platform. Temporary interruptions may occur due
              to maintenance, technical issues, or external factors.
            </p>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
