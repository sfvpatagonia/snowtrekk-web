const SA_COUNTRIES = ['AR', 'CL', 'CO', 'PE', 'UY', 'BO', 'PY', 'EC', 'VE', 'GY', 'SR'];
const EU_FR = ['FR', 'MC', 'BE', 'LU'];
const EU_DE = ['DE', 'AT', 'LI'];
const EU_IT = ['IT', 'SM', 'VA'];
const NA_COUNTRIES = ['US', 'CA', 'MX'];

export const REGION_DATA = {
  SA: {
    lang: 'es',
    headline: 'Tu próxima aventura en la nieve',
    subheadline: 'Los mejores destinos de ski del mundo al alcance de tu mano.',
    destinations: ['Bariloche', 'Las Leñas', 'Valle Nevado'],
    cta: { plan: 'Planificar viaje', free: 'Empezar gratis', business: 'Registrar mi negocio', advertise: 'Anunciar' },
    nav: { destinations: 'Destinos', business: 'Para negocios', advertise: 'Publicidad' },
  },
  BR: {
    lang: 'pt',
    headline: 'Sua próxima aventura na neve',
    subheadline: 'Os melhores destinos de ski do mundo na ponta dos dedos.',
    destinations: ['Bariloche', 'Las Leñas', 'Valle Nevado'],
    cta: { plan: 'Planejar viagem', free: 'Começar grátis', business: 'Registrar meu negócio', advertise: 'Anunciar' },
    nav: { destinations: 'Destinos', business: 'Para negócios', advertise: 'Publicidade' },
  },
  FR: {
    lang: 'fr',
    headline: 'Votre prochaine aventure dans la neige',
    subheadline: 'Les meilleures stations de ski au monde à portée de main.',
    destinations: ['Chamonix', 'Courchevel', 'Méribel'],
    cta: { plan: 'Planifier mon voyage', free: 'Commencer gratuitement', business: 'Enregistrer mon entreprise', advertise: 'Faire de la pub' },
    nav: { destinations: 'Destinations', business: 'Pour les entreprises', advertise: 'Publicité' },
  },
  DE: {
    lang: 'de',
    headline: 'Dein nächstes Abenteuer im Schnee',
    subheadline: 'Die besten Skigebiete der Welt auf Knopfdruck.',
    destinations: ['Innsbruck', 'Zermatt', 'Kitzbühel'],
    cta: { plan: 'Reise planen', free: 'Kostenlos starten', business: 'Mein Unternehmen registrieren', advertise: 'Werben' },
    nav: { destinations: 'Reiseziele', business: 'Für Unternehmen', advertise: 'Werbung' },
  },
  IT: {
    lang: 'it',
    headline: 'La tua prossima avventura sulla neve',
    subheadline: 'Le migliori destinazioni sciistiche del mondo a portata di mano.',
    destinations: ["Cortina d'Ampezzo", 'Val Gardena', 'Sestriere'],
    cta: { plan: 'Pianifica il viaggio', free: 'Inizia gratis', business: 'Registra la mia attività', advertise: 'Pubblicizza' },
    nav: { destinations: 'Destinazioni', business: 'Per le aziende', advertise: 'Pubblicità' },
  },
  JP: {
    lang: 'ja',
    headline: '雪の冒険があなたを待っている',
    subheadline: '世界最高のスキーリゾートを、あなたの手元に。',
    destinations: ['ニセコ', '北海道', 'ルスツ'],
    cta: { plan: '旅を計画する', free: '無料で始める', business: 'ビジネス登録', advertise: '広告掲載' },
    nav: { destinations: '目的地', business: 'ビジネス向け', advertise: '広告' },
  },
  NA: {
    lang: 'en',
    headline: 'Your next snow adventure starts here',
    subheadline: "The world's best ski destinations, at your fingertips.",
    destinations: ['Aspen', 'Vail', 'Whistler'],
    cta: { plan: 'Plan my trip', free: 'Get started free', business: 'Register my business', advertise: 'Advertise' },
    nav: { destinations: 'Destinations', business: 'For businesses', advertise: 'Advertising' },
  },
  DEFAULT: {
    lang: 'en',
    headline: 'Your next snow adventure starts here',
    subheadline: "The world's best ski destinations, at your fingertips.",
    destinations: ['Bariloche', 'Chamonix', 'Aspen'],
    cta: { plan: 'Plan my trip', free: 'Get started free', business: 'Register my business', advertise: 'Advertise' },
    nav: { destinations: 'Destinations', business: 'For businesses', advertise: 'Advertising' },
  },
};

export function getRegionData(countryCode) {
  if (!countryCode) return REGION_DATA.DEFAULT;
  const c = countryCode.toUpperCase();
  if (c === 'BR') return REGION_DATA.BR;
  if (SA_COUNTRIES.includes(c)) return REGION_DATA.SA;
  if (EU_FR.includes(c)) return REGION_DATA.FR;
  if (EU_DE.includes(c)) return REGION_DATA.DE;
  if (EU_IT.includes(c)) return REGION_DATA.IT;
  if (c === 'JP') return REGION_DATA.JP;
  if (NA_COUNTRIES.includes(c)) return REGION_DATA.NA;
  return REGION_DATA.DEFAULT;
}
