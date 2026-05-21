import { useEffect, useState } from "react";
import styles from "./recommendations.module.css";
import { useSelector } from "react-redux";
import ServiceCard from "../serviceCard/ServiceCard";
import logo from "@/assets/ski.png";
import exampleRecomedations from "@/utils/services.json";

export default function Recommendations() {
  const user = useSelector((state) => state.user);
  const [recommendations, setRecommendations] = useState([]);

  //   const exampleRecomedations = [
  //     {
  //       id: "a001",
  //       name: "Clase Semiexclusiva Ski + Equipo en Catedral",
  //       description: `SKITOP offers you the best Ski and Snowboard classes at Cerro Catedral in San Carlos de Bariloche. With the best instructors you can learn and have fun in the mountains. You will have the full day rental of equipment for the specialty you choose provided by El refugio Rental. The SEMI EXCLUSIVE group class is given for private groups of a minimum of 4 students and a maximum of 6.

  // Ideal class to take your first steps in the snow! Our Skitop Catedral school accompanies you in the experience.`,
  //       price: 69.99,
  //       discount: null, //Discount in percentage
  //       fixedDiscount: null, //Discount in dollars
  //       duration: 120, //in minutes
  //       transportIncluded: false, //If transport is included transport price must be null
  //       transport: 20000, //The value of the transport, the user has to pay separately
  //       averageScore: 4.5,
  //       difficulty: "Easy", // Very Easy, Easy, Medium, Hard, Professional
  //       cancellation: "Flexible", //Flexible, 30 days, 60 days, No refunds
  //       minimumParticipants: 1, //The minimum number of participants
  //       maximumParticipants: 10, //The max quantity of participants the client can buy
  //       pricePerParticipant: 1, //The price per participant frecuently is the same as minimum participants,
  //       isAd: true,
  //       ageLimit: 13, // If null, no age limit
  //       frecuency: "Mon - Fri",
  //       availableSchedules: ["10:00", "14:00"],
  //       categories: ["Ski", "Winter Activities", "Ski Center", "Ski School"],
  //       firstDestination: {
  //         name: "Cerro Catedral",
  //       },
  //       lastDestination: null,
  //       destinations: null,
  //       languages: ["English", "Spanish", "Portuguese"],
  //       images: [
  //         "https://latitur.com/uploads/media/cactus_product_tours_by_locals/1327.info@bastiondelmanso.com.ar/11942/thumb_11942_cactus_product_tours_by_locals_large.jpeg.webp",
  //       ], //The service must have at least one image
  //       schedule: [],
  //       includes: [], //what it includes
  //       notIncludes: [], //what it not includes
  //       FAQ: [], //Frecuently asked questions
  //       paymentMethods: [
  //         "Cash",
  //         "Credit Card",
  //         "Bank Transfer",
  //         "Mercado Pago",
  //         "Paypal",
  //         // apple pay, google pay, payu, etc
  //       ],
  //       shop: {
  //         name: "El Refugio Rental",
  //         logo,
  //         description:
  //           "El refugio Rental is the best Ski and Snowboard school in the country",
  //         cancellationPolicy:
  //           "lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, voluptate!",
  //       },
  //     },
  //     {
  //       id: "a002",
  //       name: "Clase Exclusiva Snowboard 3hs 1 alumno en Catedral",
  //       description: `SKITOP offers you the best Ski and Snowboard classes at Cerro Catedral in San Carlos de Bariloche. With the best instructors you can learn and have fun in the mountains. You will have the full day rental of equipment for the specialty you choose provided by El refugio Rental. The SEMI EXCLUSIVE group class is given for private groups of a minimum of 4 students and a maximum of 6.

  // Ideal class to take your first steps in the snow! Our Skitop Catedral school accompanies you in the experience.`,
  //       price: 59.99,
  //       discount: 10,
  //       fixedDiscount: null,
  //       duration: 180,
  //       transportIncluded: false,
  //       transport: 20000,
  //       averageScore: 4.3,
  //       difficulty: "Easy",
  //       cancellation: "Flexible",
  //       minimumParticipants: 1,
  //       maximumParticipants: 10, //The max quantity of participants the client can buy
  //       pricePerParticipant: 1, //The price per participant frecuently is the same as minimum participants,
  //       ageLimit: 5, // If null, no age limit
  //       isAd: false,
  //       frecuency: "Mon - Sun",
  //       availableSchedules: ["10:00", "14:00"],
  //       categories: ["Snowboard", "Winter Activities", "Snowboard School"],
  //       firstDestination: {
  //         name: "Cerro Catedral",
  //       },
  //       lastDestination: null,
  //       destinations: null,
  //       languages: ["English", "Spanish", "Portuguese"],
  //       images: [
  //         "https://latitur.com/uploads/media/cactus_product_tours_by_locals/1327.info@bastiondelmanso.com.ar/11898/thumb_11898_cactus_product_tours_by_locals_large.jpeg.webp",
  //       ], //The service must have at least one image
  //       schedule: [],
  //       includes: [], //what it includes
  //       notIncludes: [], //what it not includes
  //       FAQ: [], //Frecuently asked questions
  //       paymentMethods: [
  //         "Cash",
  //         "Credit Card",
  //         "Bank Transfer",
  //         "Mercado Pago",
  //         "Paypal",
  //         // apple pay, google pay, payu, etc
  //       ],
  //       shop: {
  //         name: "El Refugio Rental",
  //         logo,
  //         description:
  //           "El refugio Rental is the best Ski and Snowboard school in the country",
  //         cancellationPolicy:
  //           "lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, voluptate!",
  //       },
  //     },
  //     {
  //       id: "a003",
  //       name: "Trekking desde Cerro Catedral al Refugio Frey",
  //       description: `Few are those who have been to Patagonia and have left without visiting Frey. A classic refuge at the foot of a lagoon, where climbers and hikers from all over the world come, attracted by the mysticism and the essence of the mountain spirit.

  // We will go to the base of Cerro Catedral, one of the most important ski centers in South America. Here we will begin to walk the path that will take us to the Van Titter stream, passing through the burned forest that is recovering. Once in the stream canyon, the trail continues with a steeper slope. Here we will find the particular sound of the water that will accompany us until we reach the Piedritas refuge (it does not have services). From here, after a brief rest for body and soul, we will continue our last hour of ascent until we reach the Frey refuge. This is located in a glacial cirque, at the foot of the Toncek lagoon, and surrounded by granite needles, sought by climbers from all over the world. Total elevation gain of 900m.

  // Optional: One night at Frey's Cabin and/or a traverse of Cathedral Ridge with lift access.`,
  //       price: 49.99,
  //       discount: null, //Discount in percentage
  //       fixedDiscount: 10, //Discount in dollars
  //       duration: 60 * 7, //in minutes
  //       transportIncluded: false, //If transport is included transport price must be null
  //       transport: 36, //The value of the transport, the user has to pay separately
  //       averageScore: 4.9,
  //       difficulty: "Medium", // Very Easy, Easy, Medium, Hard, Professional
  //       cancellation: "15 days", //Flexible, 30 days, 60 days, No refunds
  //       minimumParticipants: 2, //The minimum number of participants
  //       maximumParticipants: 20, //The max quantity of participants the client can buy
  //       pricePerParticipant: 1, //The price per participant frecuently is the same as minimum participants,
  //       ageLimit: 10, // If null, no age limit
  //       frecuency: "Mon Wed  Sat Sun",
  //       availableSchedules: ["09:00"],
  //       categories: ["Trekking"],
  //       firstDestination: {
  //         name: "Cerro Catedral",
  //       },
  //       lastDestination: {
  //         name: "Refugio Frey",
  //       },
  //       destinations: [{ name: "Cerro Catedral" }, { name: "Refugio Frey" }],
  //       languages: ["English", "Spanish", "Portuguese"],
  //       images: [
  //         "https://latitur.com/uploads/media/cactus_product_tours_by_locals/143.info@guiandopatagonia.com/1958/thumb_1958_cactus_product_tours_by_locals_large.jpeg.webp",
  //       ], //The service must have at least one image
  //       schedule: [],
  //       includes: [], //what it includes
  //       notIncludes: [], //what it not includes
  //       FAQ: [], //Frecuently asked questions
  //       paymentMethods: [
  //         "Cash",
  //         "Credit Card",
  //         "Bank Transfer",
  //         "Mercado Pago",
  //         "Paypal",
  //         // apple pay, google pay, payu, etc
  //       ],
  //       shop: {
  //         name: "El Refugio Rental",
  //         logo,
  //         description:
  //           "El refugio Rental is the best Ski and Snowboard school in the country",
  //         cancellationPolicy:
  //           "lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, voluptate!",
  //       },
  //     },
  //   ];

  useEffect(() => {
    //fetch
    setRecommendations(exampleRecomedations);
  }, []);

  return (
    <article className={styles.container}>
      <h3 className={styles.title}>Activities you may like</h3>
      <div className={styles.cardContainer}>
        {recommendations.map((recomendation, index) => (
          <ServiceCard key={index} item={recomendation} />
        ))}
        {exampleRecomedations.map((recomendation, index) => (
          <ServiceCard key={index} item={recomendation} />
        ))}
        {exampleRecomedations.map((recomendation, index) => (
          <ServiceCard key={index} item={recomendation} />
        ))}
      </div>
    </article>
  );
}
