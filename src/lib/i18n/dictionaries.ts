import type { Locale } from "@/lib/domain/types";

/**
 * Diccionarios del sitio.
 *
 * `es` es el idioma de referencia: su forma define el tipo `Dictionary`, así que
 * agregar una clave en español obliga a traducirla en `en` y `pt` — el
 * typechecker no deja pasar un diccionario incompleto.
 *
 * Las claves están agrupadas por sección de la página, no por tipo de palabra.
 */
export const es = {
  nav: {
    links: ["Propiedades", "Alquileres", "Terrenos", "Seguros", "Estudio"],
    tagline: ["Propiedades", "Terrenos", "Alquileres", "Seguros"],
    cta: "WhatsApp",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  hero: {
    location: "Ushuaia - Tierra del Fuego",
    badge: "Propiedades · Terrenos · Seguros",
    badgeCount: "ACTIVOS",
    line1: "Todo lo que necesitás,",
    line2: "en un solo lugar.",
    sub: "Propiedades, terrenos, alquileres y seguros con atención personalizada.",
    ctaPrimary: "Ver propiedades",
    ctaSecondary: "Escribime",
    stats: {
      properties: "PROPIEDADES",
      years: "AÑOS",
      response: "RESPUESTA",
    },
  },
  search: {
    action: "Buscar",
    operations: {
      venta: "Venta",
      alquiler: "Alquiler",
      terreno: "Terrenos",
      temporario: "Temporario",
    },
    fields: {
      location: { label: "UBICACIÓN", placeholder: "Ciudad, barrio o zona" },
      kind: { label: "TIPO DE PROPIEDAD", placeholder: "Todas" },
      budget: { label: "PRESUPUESTO", placeholder: "Sin tope" },
    },
  },
  services: {
    kicker: "QUÉ HACEMOS",
    title: "Un estudio que cubre todo el ciclo de la propiedad",
    unit: "SERVICIOS",
    items: {
      venta: {
        title: "Venta",
        desc: "Tasación, publicación y negociación hasta la firma. Acompañamos toda la operación.",
        cta: "Ver en venta",
      },
      alquiler: {
        title: "Alquiler",
        desc: "Contratos, garantías y administración mensual. Sin sorpresas para ninguna de las partes.",
        cta: "Ver alquileres",
      },
      terreno: {
        title: "Terrenos",
        desc: "Lotes y fracciones con documentación verificada y asesoramiento para construir.",
        cta: "Ver terrenos",
      },
      seguro: {
        title: "Seguros",
        desc: "Hogar, incendio, robo y garantía de alquiler. Cotizamos con varias compañías.",
        cta: "Cotizar seguro",
      },
    },
  },
  properties: {
    kicker: "DESTACADAS",
    title: "Propiedades seleccionadas",
    views: { grid: "Grilla", list: "Lista" },
    insuredBadge: "Con seguro",
    photoPlaceholder: "Sin foto todavía",
    empty: "No hay propiedades publicadas en esta operación por ahora.",
    // Etiqueta del tipo de propiedad. Las claves son el enum `PropertyKind`.
    kinds: {
      casa: "Casa",
      departamento: "Departamento",
      ph: "PH",
      estudio: "Monoambiente",
      lote: "Lote",
      campo: "Campo",
      cabana: "Cabaña",
      local: "Local",
      oficina: "Oficina",
    },
  },
  insuranceTeaser: {
    text: "¿También necesitás un seguro? Cotizamos hogar, alquiler, vida y más con varias compañías.",
    cta: "Ver coberturas",
  },
  insurance: {
    kicker: "COBERTURAS",
    title: "Cobertura de seguro a tu medida",
    sub: "No vendemos una póliza suelta: cotizamos con varias compañías la cobertura que realmente corresponde a la propiedad y al tipo de contrato.",
    cta: "Consultar por WhatsApp",
  },
  studio: {
    kicker: "EL ESTUDIO",
    title: "Quién te atiende, de punta a punta",
    bio: [
      "Soy Matías Dip, Martillero Público y Corredor Inmobiliario, y Productor Asesor de Seguros. Trabajo asesorando operaciones inmobiliarias de principio a fin: desde la búsqueda o comercialización de una propiedad hasta la escritura. Al mismo tiempo, mi actividad como Productor Asesor de Seguros me permite resolver también las coberturas vinculadas a cada operación, sin necesidad de recurrir a distintos intermediarios.",
      "Nací en San Miguel, Buenos Aires, y vivo en Tierra del Fuego desde 2012. También residí en Río Grande entre 2015 y 2021, una experiencia que me permitió conocer de cerca las particularidades de ambas ciudades y su mercado.",
      "Como Productor Asesor de Seguros, trabajo con Allianz, Federación Patronal, La Caja, San Cristóbal, Mercantil Andina y Swiss Medical, lo que me permite comparar distintas opciones y asesorar a cada cliente según lo que realmente necesita.",
      "Mi forma de trabajar es simple: cada operación recibe mi atención directa y un seguimiento personalizado, que te acompañe durante todo el proceso.",
    ],
    credentials: {
      broker: "Martillero Público, Corredor Inmobiliario y Perito Judicial",
      brokerLicence: "Mat. 28 · CMTyC TDF",
      insurance: "Productor Asesor de Seguros",
      insuranceLicence: "Mat. 106134 · SSN",
    },
    location: "Ushuaia, Tierra del Fuego",
    photoAlt: "Retrato de Matías Dip",
  },
  contact: {
    kicker: "CONTACTO",
    title: "Escribinos y lo resolvemos por WhatsApp",
    sub: "Sin formularios ni esperas. Contanos qué buscás y te respondemos el mismo día, con las opciones que realmente encajan.",
    intents: {
      comprar: "Quiero comprar",
      alquilar: "Busco alquiler",
      terreno: "Tengo un terreno",
      seguro: "Necesito un seguro",
      tasar: "Quiero tasar",
    },
    waTitle: "Matías Dip",
    waStatus: "Responde en el día",
    waSample: {
      from: "Hola, busco un dos ambientes en el Centro hasta $400.000.",
      reply: "¡Hola! Tengo tres opciones que encajan. ¿Te paso fotos y las visitamos esta semana?",
    },
    waNumberLabel: "ESCRIBINOS A",
    waCta: "Abrir WhatsApp",
    waNote: "Te respondemos dentro de las 24 horas hábiles.",
  },
  listing: {
    title: "Propiedades",
    kicker: "CATÁLOGO",
    // {count} se reemplaza por el número de resultados.
    resultsOne: "1 propiedad",
    resultsMany: "{count} propiedades",
    filters: "Filtros",
    clear: "Limpiar",
    apply: "Ver resultados",
    all: "Todas",
    operation: "Operación",
    kind: "Tipo de propiedad",
    city: "Ubicación",
    price: "Precio hasta",
    noPriceLimit: "Sin tope",
    insuredOnly: "Sólo con seguro incluido",
    sort: "Ordenar",
    sortOptions: {
      recent: "Más recientes",
      priceAsc: "Menor precio",
      priceDesc: "Mayor precio",
    },
    emptyTitle: "No encontramos propiedades con esos filtros",
    emptySub: "Probá ampliando la búsqueda o escribinos y te buscamos nosotros.",
    emptyCta: "Consultar por WhatsApp",
    activeFilters: "Filtros activos",
  },
  property: {
    backToList: "Volver a propiedades",
    // Ficha técnica. Las claves se corresponden con `PropertyFacts`.
    facts: {
      title: "FICHA TÉCNICA",
      rooms: "Ambientes",
      bedrooms: "Dormitorios",
      bathrooms: "Baños",
      coveredArea: "Superficie cubierta",
      totalArea: "Superficie total",
      floor: "Piso",
      parking: "Cochera",
      code: "Código",
      operation: "Operación",
      kind: "Tipo",
    },
    yes: "Sí",
    no: "No",
    description: "Sobre esta propiedad",
    descriptionPending: "El estudio todavía no cargó la descripción de esta propiedad.",
    location: "Ubicación",
    mapPending: "Mapa próximamente",
    highlights: "Características",
    insuranceTitle: "Cobertura sugerida",
    insuranceSub:
      "Cotizamos esta cobertura junto con la operación, con varias compañías.",
    insuranceNone: "Todavía no asignamos una cobertura a esta propiedad.",
    insuranceAsk: "Consultar por esta cobertura",
    similar: "Propiedades similares",
    similarEmpty: "No hay otras propiedades parecidas publicadas por ahora.",
    ctaTitle: "¿Te interesa esta propiedad?",
    ctaSub: "Escribinos y coordinamos una visita esta semana.",
    ctaButton: "Consultar por WhatsApp",
    galleryPending: "Fotos próximamente",
    photoCount: "fotos",
    notFoundTitle: "No encontramos esta propiedad",
    notFoundSub:
      "Puede que se haya vendido, alquilado o dado de baja. Mirá el resto de las publicaciones.",
    notFoundCta: "Ver propiedades",
    share: "Compartir",
    shareCopied: "Enlace copiado",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · Mat. 28 CMTyC TDF · Mat. 106134 SSN",
    instagram: "@matiasdip.immo",
    terms: "Términos",
    privacy: "Privacidad",
  },
} as const;

/**
 * Afloja los literales de un objeto a `string` conservando su forma.
 *
 * Hace falta porque `es` está declarado `as const`: sin esto el tipo exigiría
 * que la traducción inglesa dijera literalmente "Ver propiedades". Lo que
 * queremos heredar del español es la ESTRUCTURA —qué claves existen y cómo
 * anidan—, no los textos.
 */
type Loose<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Loose<U>[]
    : { readonly [K in keyof T]: Loose<T[K]> };

/**
 * Forma que todo diccionario debe cumplir, derivada del español.
 * Es readonly en profundidad: los textos se leen, nunca se mutan en runtime.
 */
export type Dictionary = Loose<typeof es>;

export const en: Dictionary = {
  nav: {
    links: ["Properties", "Rentals", "Land", "Insurance", "Firm"],
    tagline: ["Properties", "Land", "Rentals", "Insurance"],
    cta: "WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    location: "Ushuaia - Tierra del Fuego",
    badge: "Properties · Land · Insurance",
    badgeCount: "LIVE",
    line1: "Everything you need,",
    line2: "in one place.",
    sub: "Properties, land, rentals and insurance with personal attention.",
    ctaPrimary: "Browse properties",
    ctaSecondary: "Message me",
    stats: {
      properties: "LISTINGS",
      years: "YEARS",
      response: "RESPONSE",
    },
  },
  search: {
    action: "Search",
    operations: {
      venta: "For sale",
      alquiler: "For rent",
      terreno: "Land",
      temporario: "Short stay",
    },
    fields: {
      location: { label: "LOCATION", placeholder: "City, neighbourhood or area" },
      kind: { label: "PROPERTY TYPE", placeholder: "All types" },
      budget: { label: "BUDGET", placeholder: "No limit" },
    },
  },
  services: {
    kicker: "WHAT WE DO",
    title: "One firm across the whole property cycle",
    unit: "SERVICES",
    items: {
      venta: {
        title: "Sales",
        desc: "Valuation, listing and negotiation through to signing. We handle the full transaction.",
        cta: "View listings",
      },
      alquiler: {
        title: "Rentals",
        desc: "Contracts, guarantees and monthly management. No surprises on either side.",
        cta: "View rentals",
      },
      terreno: {
        title: "Land",
        desc: "Lots and parcels with verified paperwork and guidance on building.",
        cta: "View land",
      },
      seguro: {
        title: "Insurance",
        desc: "Home, fire, theft and rent guarantee. We quote across several carriers.",
        cta: "Get a quote",
      },
    },
  },
  properties: {
    kicker: "FEATURED",
    title: "Selected properties",
    views: { grid: "Grid", list: "List" },
    insuredBadge: "Insured",
    photoPlaceholder: "No photo yet",
    empty: "No properties listed under this operation right now.",
    kinds: {
      casa: "House",
      departamento: "Apartment",
      ph: "Townhouse",
      estudio: "Studio",
      lote: "Plot",
      campo: "Land",
      cabana: "Cabin",
      local: "Retail unit",
      oficina: "Office",
    },
  },
  insuranceTeaser: {
    text: "Need insurance too? We quote home, rental, life cover and more across several carriers.",
    cta: "See coverage",
  },
  insurance: {
    kicker: "COVERAGE",
    title: "Insurance coverage tailored to you",
    sub: "We do not sell a policy in isolation: we quote across carriers for the cover the property and the contract actually call for.",
    cta: "Ask on WhatsApp",
  },
  studio: {
    kicker: "THE FIRM",
    title: "Who you deal with, start to finish",
    bio: [
      "I'm Matías Dip, a licensed Real Estate Broker (Martillero Público y Corredor Inmobiliario) and Insurance Producer. I handle real estate deals from start to finish: from finding or listing a property through to the closing. As an Insurance Producer, I also take care of the cover tied to each deal, so you don't need to go through separate intermediaries.",
      "I was born in San Miguel, Buenos Aires, and have lived in Tierra del Fuego since 2012. I also lived in Río Grande between 2015 and 2021, which let me get to know both cities and their markets up close.",
      "As an Insurance Producer, I work with Allianz, Federación Patronal, La Caja, San Cristóbal, Mercantil Andina and Swiss Medical, which lets me compare options and advise each client on what they actually need.",
      "My approach is simple: every deal gets my direct attention and personal follow-up, all the way through.",
    ],
    credentials: {
      broker: "Real Estate Broker and Judicial Expert (Martillero Público, Corredor Inmobiliario y Perito Judicial)",
      brokerLicence: "Lic. 28 · CMTyC TDF",
      insurance: "Licensed Insurance Producer",
      insuranceLicence: "Lic. 106134 · SSN",
    },
    location: "Ushuaia, Tierra del Fuego",
    photoAlt: "Portrait of Matías Dip",
  },
  contact: {
    kicker: "CONTACT",
    title: "Message us and we sort it on WhatsApp",
    sub: "No forms, no waiting. Tell us what you are after and we reply the same day with options that actually fit.",
    intents: {
      comprar: "I want to buy",
      alquilar: "Looking to rent",
      terreno: "I own land",
      seguro: "I need insurance",
      tasar: "I want a valuation",
    },
    waTitle: "Matías Dip",
    waStatus: "Replies same day",
    waSample: {
      from: "Hi, looking for a one-bedroom downtown under $400,000.",
      reply: "Hello! I have three that fit. Shall I send photos and book viewings this week?",
    },
    waNumberLabel: "WRITE TO US AT",
    waCta: "Open WhatsApp",
    waNote: "We reply within 24 business hours.",
  },
  listing: {
    title: "Properties",
    kicker: "CATALOGUE",
    resultsOne: "1 property",
    resultsMany: "{count} properties",
    filters: "Filters",
    clear: "Clear",
    apply: "See results",
    all: "All",
    operation: "Operation",
    kind: "Property type",
    city: "Location",
    price: "Price up to",
    noPriceLimit: "No limit",
    insuredOnly: "Insured only",
    sort: "Sort",
    sortOptions: {
      recent: "Most recent",
      priceAsc: "Lowest price",
      priceDesc: "Highest price",
    },
    emptyTitle: "No properties match these filters",
    emptySub: "Try widening the search, or message us and we will look for you.",
    emptyCta: "Ask on WhatsApp",
    activeFilters: "Active filters",
  },
  property: {
    backToList: "Back to properties",
    facts: {
      title: "SPECIFICATIONS",
      rooms: "Rooms",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      coveredArea: "Covered area",
      totalArea: "Total area",
      floor: "Floor",
      parking: "Parking",
      code: "Reference",
      operation: "Operation",
      kind: "Type",
    },
    yes: "Yes",
    no: "No",
    description: "About this property",
    descriptionPending: "The firm has not added a description for this property yet.",
    location: "Location",
    mapPending: "Map coming soon",
    highlights: "Features",
    insuranceTitle: "Suggested cover",
    insuranceSub: "We quote this cover alongside the deal, across several carriers.",
    insuranceNone: "We have not assigned a cover to this property yet.",
    insuranceAsk: "Ask about this cover",
    similar: "Similar properties",
    similarEmpty: "No similar properties are listed at the moment.",
    ctaTitle: "Interested in this property?",
    ctaSub: "Message us and we will arrange a viewing this week.",
    ctaButton: "Ask on WhatsApp",
    galleryPending: "Photos coming soon",
    photoCount: "photos",
    notFoundTitle: "We could not find this property",
    notFoundSub:
      "It may have been sold, rented or taken down. Have a look at the rest of our listings.",
    notFoundCta: "Browse properties",
    share: "Share",
    shareCopied: "Link copied",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · Lic. 28 CMTyC TDF · Lic. 106134 SSN",
    instagram: "@matiasdip.immo",
    terms: "Terms",
    privacy: "Privacy",
  },
};

export const pt: Dictionary = {
  nav: {
    links: ["Imóveis", "Aluguéis", "Terrenos", "Seguros", "Escritório"],
    tagline: ["Imóveis", "Terrenos", "Aluguéis", "Seguros"],
    cta: "WhatsApp",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  hero: {
    location: "Ushuaia - Tierra del Fuego",
    badge: "Imóveis · Terrenos · Seguros",
    badgeCount: "ATIVOS",
    line1: "Tudo o que você precisa,",
    line2: "em um só lugar.",
    sub: "Imóveis, terrenos, aluguéis e seguros com atendimento personalizado.",
    ctaPrimary: "Ver imóveis",
    ctaSecondary: "Fale comigo",
    stats: {
      properties: "IMÓVEIS",
      years: "ANOS",
      response: "RESPOSTA",
    },
  },
  search: {
    action: "Buscar",
    operations: {
      venta: "Venda",
      alquiler: "Aluguel",
      terreno: "Terrenos",
      temporario: "Temporada",
    },
    fields: {
      location: { label: "LOCALIZAÇÃO", placeholder: "Cidade, bairro ou região" },
      kind: { label: "TIPO DE IMÓVEL", placeholder: "Todos" },
      budget: { label: "ORÇAMENTO", placeholder: "Sem limite" },
    },
  },
  services: {
    kicker: "O QUE FAZEMOS",
    title: "Um escritório para todo o ciclo do imóvel",
    unit: "SERVIÇOS",
    items: {
      venta: {
        title: "Venda",
        desc: "Avaliação, anúncio e negociação até a assinatura. Acompanhamos toda a operação.",
        cta: "Ver à venda",
      },
      alquiler: {
        title: "Aluguel",
        desc: "Contratos, garantias e administração mensal. Sem surpresas para nenhuma das partes.",
        cta: "Ver aluguéis",
      },
      terreno: {
        title: "Terrenos",
        desc: "Lotes e frações com documentação verificada e assessoria para construir.",
        cta: "Ver terrenos",
      },
      seguro: {
        title: "Seguros",
        desc: "Residencial, incêndio, roubo e garantia de aluguel. Cotamos com várias seguradoras.",
        cta: "Cotar seguro",
      },
    },
  },
  properties: {
    kicker: "DESTAQUES",
    title: "Imóveis selecionados",
    views: { grid: "Grade", list: "Lista" },
    insuredBadge: "Com seguro",
    photoPlaceholder: "Sem foto ainda",
    empty: "Não há imóveis publicados nesta operação no momento.",
    kinds: {
      casa: "Casa",
      departamento: "Apartamento",
      ph: "Sobrado",
      estudio: "Quitinete",
      lote: "Lote",
      campo: "Terreno",
      cabana: "Chalé",
      local: "Loja",
      oficina: "Escritório",
    },
  },
  insuranceTeaser: {
    text: "Também precisa de um seguro? Cotamos residencial, aluguel, vida e mais com várias seguradoras.",
    cta: "Ver coberturas",
  },
  insurance: {
    kicker: "COBERTURAS",
    title: "Cobertura de seguro sob medida",
    sub: "Não vendemos uma apólice solta: cotamos com várias seguradoras a cobertura que o imóvel e o contrato realmente exigem.",
    cta: "Consultar no WhatsApp",
  },
  studio: {
    kicker: "O ESCRITÓRIO",
    title: "Quem cuida de você, do início ao fim",
    bio: [
      "Sou Matías Dip, Corretor de Imóveis licenciado (Martillero Público y Corredor Inmobiliario) e Corretor de Seguros licenciado. Trabalho assessorando operações imobiliárias do início ao fim: desde a busca ou divulgação de um imóvel até a escritura. Ao mesmo tempo, minha atividade como Corretor de Seguros me permite resolver também as coberturas ligadas a cada operação, sem precisar recorrer a intermediários diferentes.",
      "Nasci em San Miguel, Buenos Aires, e moro em Tierra del Fuego desde 2012. Também morei em Río Grande entre 2015 e 2021, uma experiência que me permitiu conhecer de perto as particularidades das duas cidades e seu mercado.",
      "Como Corretor de Seguros, trabalho com Allianz, Federación Patronal, La Caja, San Cristóbal, Mercantil Andina e Swiss Medical, o que me permite comparar diferentes opções e assessorar cada cliente de acordo com o que realmente precisa.",
      "Minha forma de trabalhar é simples: cada operação recebe minha atenção direta e um acompanhamento pessoal, que te acompanha durante todo o processo.",
    ],
    credentials: {
      broker: "Corretor de Imóveis licenciado e Perito Judicial (Martillero Público, Corredor Inmobiliario y Perito Judicial)",
      brokerLicence: "Reg. 28 · CMTyC TDF",
      insurance: "Corretor de Seguros licenciado",
      insuranceLicence: "Reg. 106134 · SSN",
    },
    location: "Ushuaia, Tierra del Fuego",
    photoAlt: "Retrato de Matías Dip",
  },
  contact: {
    kicker: "CONTATO",
    title: "Fale conosco e resolvemos pelo WhatsApp",
    sub: "Sem formulários nem esperas. Conte o que procura e respondemos no mesmo dia, com as opções que realmente encaixam.",
    intents: {
      comprar: "Quero comprar",
      alquilar: "Procuro aluguel",
      terreno: "Tenho um terreno",
      seguro: "Preciso de seguro",
      tasar: "Quero avaliar",
    },
    waTitle: "Matías Dip",
    waStatus: "Responde no mesmo dia",
    waSample: {
      from: "Olá, procuro um dois quartos no Centro até $400.000.",
      reply: "Olá! Tenho três opções que encaixam. Envio fotos e marcamos visitas esta semana?",
    },
    waNumberLabel: "ESCREVA PARA",
    waCta: "Abrir WhatsApp",
    waNote: "Respondemos em até 24 horas úteis.",
  },
  listing: {
    title: "Imóveis",
    kicker: "CATÁLOGO",
    resultsOne: "1 imóvel",
    resultsMany: "{count} imóveis",
    filters: "Filtros",
    clear: "Limpar",
    apply: "Ver resultados",
    all: "Todos",
    operation: "Operação",
    kind: "Tipo de imóvel",
    city: "Localização",
    price: "Preço até",
    noPriceLimit: "Sem limite",
    insuredOnly: "Somente com seguro",
    sort: "Ordenar",
    sortOptions: {
      recent: "Mais recentes",
      priceAsc: "Menor preço",
      priceDesc: "Maior preço",
    },
    emptyTitle: "Não encontramos imóveis com esses filtros",
    emptySub: "Tente ampliar a busca, ou fale conosco e procuramos para você.",
    emptyCta: "Consultar no WhatsApp",
    activeFilters: "Filtros ativos",
  },
  property: {
    backToList: "Voltar aos imóveis",
    facts: {
      title: "FICHA TÉCNICA",
      rooms: "Cômodos",
      bedrooms: "Quartos",
      bathrooms: "Banheiros",
      coveredArea: "Área construída",
      totalArea: "Área total",
      floor: "Andar",
      parking: "Garagem",
      code: "Código",
      operation: "Operação",
      kind: "Tipo",
    },
    yes: "Sim",
    no: "Não",
    description: "Sobre este imóvel",
    descriptionPending: "O escritório ainda não cadastrou a descrição deste imóvel.",
    location: "Localização",
    mapPending: "Mapa em breve",
    highlights: "Características",
    insuranceTitle: "Cobertura sugerida",
    insuranceSub: "Cotamos esta cobertura junto com a operação, com várias seguradoras.",
    insuranceNone: "Ainda não atribuímos uma cobertura a este imóvel.",
    insuranceAsk: "Consultar sobre esta cobertura",
    similar: "Imóveis semelhantes",
    similarEmpty: "Não há imóveis semelhantes publicados no momento.",
    ctaTitle: "Tem interesse neste imóvel?",
    ctaSub: "Fale conosco e agendamos uma visita esta semana.",
    ctaButton: "Consultar no WhatsApp",
    galleryPending: "Fotos em breve",
    photoCount: "fotos",
    notFoundTitle: "Não encontramos este imóvel",
    notFoundSub:
      "Pode ter sido vendido, alugado ou removido. Veja o resto das publicações.",
    notFoundCta: "Ver imóveis",
    share: "Compartilhar",
    shareCopied: "Link copiado",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · Reg. 28 CMTyC TDF · Reg. 106134 SSN",
    instagram: "@matiasdip.immo",
    terms: "Termos",
    privacy: "Privacidade",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { es, en, pt };

/** Devuelve el diccionario del idioma pedido. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
