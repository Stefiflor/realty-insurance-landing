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
    cta: "WhatsApp",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  hero: {
    badge: "Ventas · Alquileres · Terrenos · Seguros",
    badgeCount: "ACTIVOS",
    line1: "Tu próxima propiedad,",
    line2: "con todo resuelto.",
    sub: "Compra, alquiler, inversión en terrenos y la cobertura que corresponde. Un solo estudio de la búsqueda a la escritura.",
    ctaPrimary: "Ver propiedades",
    ctaSecondary: "Escribinos",
    stats: {
      properties: "PROPIEDADES",
      years: "AÑOS",
      response: "RESPUESTA",
    },
    floatLabel: "COBERTURA INCLUIDA",
    floatText: "74% de nuestras operaciones cierran con seguro contratado.",
    imagePlaceholder: "[ FOTO DE PORTADA ]",
  },
  ticker: [
    "VENTAS",
    "ALQUILERES",
    "TERRENOS",
    "SEGURO DE HOGAR",
    "GARANTÍA DE ALQUILER",
    "TASACIONES",
    "ADMINISTRACIÓN",
    "INVERSIONES",
  ],
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
    photoPlaceholder: "[ FOTO ]",
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
  insurance: {
    kicker: "COBERTURAS",
    title: "El seguro que va con tu operación",
    sub: "No vendemos una póliza suelta: cotizamos con varias compañías la cobertura que realmente corresponde a la propiedad y al tipo de contrato.",
    cta: "Consultar por WhatsApp",
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
      from: "Hola, busco un dos ambientes en Palermo hasta $400.000.",
      reply: "¡Hola! Tengo tres opciones que encajan. ¿Te paso fotos y las visitamos esta semana?",
    },
    waNumberLabel: "ESCRIBINOS A",
    waCta: "Abrir WhatsApp",
    waNote: "Te respondemos dentro de las 24 horas hábiles.",
    numberPending: "[TU NÚMERO]",
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
    mapPending: "[ MAPA ]",
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
    galleryPending: "[ FOTOS DE LA PROPIEDAD ]",
    photoCount: "fotos",
    notFoundTitle: "No encontramos esta propiedad",
    notFoundSub:
      "Puede que se haya vendido, alquilado o dado de baja. Mirá el resto de las publicaciones.",
    notFoundCta: "Ver propiedades",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · [MATRÍCULA]",
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
    cta: "WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    badge: "Sales · Rentals · Land · Insurance",
    badgeCount: "LIVE",
    line1: "Your next property,",
    line2: "fully covered.",
    sub: "Buying, renting, land investment and the right insurance. One firm from the first search to the deed.",
    ctaPrimary: "Browse properties",
    ctaSecondary: "Message us",
    stats: {
      properties: "LISTINGS",
      years: "YEARS",
      response: "RESPONSE",
    },
    floatLabel: "COVERAGE INCLUDED",
    floatText: "74% of our deals close with insurance already in place.",
    imagePlaceholder: "[ COVER PHOTO ]",
  },
  ticker: [
    "SALES",
    "RENTALS",
    "LAND",
    "HOME INSURANCE",
    "RENT GUARANTEE",
    "VALUATIONS",
    "MANAGEMENT",
    "INVESTMENT",
  ],
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
    photoPlaceholder: "[ PHOTO ]",
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
  insurance: {
    kicker: "COVERAGE",
    title: "The policy that fits the deal",
    sub: "We do not sell a policy in isolation: we quote across carriers for the cover the property and the contract actually call for.",
    cta: "Ask on WhatsApp",
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
      from: "Hi, looking for a one-bedroom in Palermo under $400,000.",
      reply: "Hello! I have three that fit. Shall I send photos and book viewings this week?",
    },
    waNumberLabel: "WRITE TO US AT",
    waCta: "Open WhatsApp",
    waNote: "We reply within 24 business hours.",
    numberPending: "[YOUR NUMBER]",
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
    mapPending: "[ MAP ]",
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
    galleryPending: "[ PROPERTY PHOTOS ]",
    photoCount: "photos",
    notFoundTitle: "We could not find this property",
    notFoundSub:
      "It may have been sold, rented or taken down. Have a look at the rest of our listings.",
    notFoundCta: "Browse properties",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · [LICENCE]",
    instagram: "@matiasdip.immo",
    terms: "Terms",
    privacy: "Privacy",
  },
};

export const pt: Dictionary = {
  nav: {
    links: ["Imóveis", "Aluguéis", "Terrenos", "Seguros", "Escritório"],
    cta: "WhatsApp",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  hero: {
    badge: "Vendas · Aluguéis · Terrenos · Seguros",
    badgeCount: "ATIVOS",
    line1: "Seu próximo imóvel,",
    line2: "com tudo resolvido.",
    sub: "Compra, aluguel, investimento em terrenos e a cobertura adequada. Um só escritório da busca até a escritura.",
    ctaPrimary: "Ver imóveis",
    ctaSecondary: "Fale conosco",
    stats: {
      properties: "IMÓVEIS",
      years: "ANOS",
      response: "RESPOSTA",
    },
    floatLabel: "COBERTURA INCLUÍDA",
    floatText: "74% das nossas operações fecham com seguro contratado.",
    imagePlaceholder: "[ FOTO DE CAPA ]",
  },
  ticker: [
    "VENDAS",
    "ALUGUÉIS",
    "TERRENOS",
    "SEGURO RESIDENCIAL",
    "GARANTIA DE ALUGUEL",
    "AVALIAÇÕES",
    "ADMINISTRAÇÃO",
    "INVESTIMENTOS",
  ],
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
    photoPlaceholder: "[ FOTO ]",
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
  insurance: {
    kicker: "COBERTURAS",
    title: "O seguro certo para a sua operação",
    sub: "Não vendemos uma apólice solta: cotamos com várias seguradoras a cobertura que o imóvel e o contrato realmente exigem.",
    cta: "Consultar no WhatsApp",
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
      from: "Olá, procuro um dois quartos em Palermo até $400.000.",
      reply: "Olá! Tenho três opções que encaixam. Envio fotos e marcamos visitas esta semana?",
    },
    waNumberLabel: "ESCREVA PARA",
    waCta: "Abrir WhatsApp",
    waNote: "Respondemos em até 24 horas úteis.",
    numberPending: "[SEU NÚMERO]",
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
    mapPending: "[ MAPA ]",
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
    galleryPending: "[ FOTOS DO IMÓVEL ]",
    photoCount: "fotos",
    notFoundTitle: "Não encontramos este imóvel",
    notFoundSub:
      "Pode ter sido vendido, alugado ou removido. Veja o resto das publicações.",
    notFoundCta: "Ver imóveis",
  },
  footer: {
    licence: "MD ESTUDIO INMOBILIARIO · [REGISTRO]",
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
