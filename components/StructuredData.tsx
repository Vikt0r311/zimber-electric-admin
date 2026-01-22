export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: 'Zimber Electric',
    description: 'Professzionális villanyszerelő szolgáltatás Komárom-Esztergom vármegyében',
    telephone: '+36307093948',
    email: 'info@zimber-electric.hu',
    areaServed: [
      'Tatabánya',
      'Komárom',
      'Tata',
      'Oroszlány',
      'Komárom-Esztergom vármegye',
    ],
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-24:00',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: ['https://www.facebook.com/zimberelectric'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Villanyszerelési Szolgáltatások',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Teljes villamos hálózat kiépítés',
            description:
              'Családi házak és lakások új villamos hálózatának professzionális kiépítése',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hálózat korszerűsítés',
            description: 'Régi villamos hálózatok modernizálása, hibajavítás',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LED világítás beépítés',
            description: 'Energiahatékony LED szalagok és fényforrások telepítése',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
