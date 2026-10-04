export type ProductCategory = "Soft Drinks" | "Flavoured Drinks" | "Soda"

export type Product = {
  id: string
  name: string
  flavour: string
  category: ProductCategory
  description: string
  packSizes: string
  color: string
  accent: string
  format: "bottle" | "can"
  featured: boolean
}

export const company = {
  name: "D Dynamic Soda",
  phone: "[Add business phone]",
  email: "[Add business email]",
  address: "[Add verified business address]",
  hours: "[Add business hours]",
  serviceAreas: "[Add confirmed service areas and supply information]",
  story:
    "D Dynamic Soda is building a vibrant beverage range for everyday refreshment, social occasions, and business partners. Replace this editable introduction with the company’s verified story.",
  mission:
    "To create memorable refreshment through distinctive flavour, dependable service, and energetic brand experiences.",
  vision:
    "To grow alongside customers, retailers, wholesalers, and distributors as a trusted beverage partner.",
}

export const products: Product[] = [
  {
    id: "citrus-burst",
    name: "Citrus Burst",
    flavour: "Citrus concept",
    category: "Soft Drinks",
    description:
      "A bright, citrus-inspired sample product created to demonstrate the catalogue layout.",
    packSizes: "Pack sizes to be confirmed",
    color: "#F1B933",
    accent: "#FFF0B7",
    format: "bottle",
    featured: true,
  },
  {
    id: "berry-wave",
    name: "Berry Wave",
    flavour: "Mixed berry concept",
    category: "Flavoured Drinks",
    description:
      "A bold berry-inspired sample product ready to be replaced with verified product details.",
    packSizes: "Pack sizes to be confirmed",
    color: "#C84972",
    accent: "#F8CAD9",
    format: "can",
    featured: true,
  },
  {
    id: "lime-fizz",
    name: "Lime Fizz",
    flavour: "Lime concept",
    category: "Soda",
    description:
      "A crisp lime-inspired sample product showing how flavour families can be presented.",
    packSizes: "Pack sizes to be confirmed",
    color: "#87B848",
    accent: "#DDF1BD",
    format: "bottle",
    featured: true,
  },
  {
    id: "tropical-glow",
    name: "Tropical Glow",
    flavour: "Tropical concept",
    category: "Flavoured Drinks",
    description:
      "A sunlit tropical sample product for visual demonstration only, with editable copy.",
    packSizes: "Pack sizes to be confirmed",
    color: "#EF7E42",
    accent: "#FFD8B9",
    format: "can",
    featured: false,
  },
  {
    id: "classic-soda",
    name: "Classic Soda",
    flavour: "Unflavoured concept",
    category: "Soda",
    description:
      "A clean soda-water sample listing. Replace with the company’s confirmed specification.",
    packSizes: "Pack sizes to be confirmed",
    color: "#55A9B7",
    accent: "#C9EEF1",
    format: "bottle",
    featured: false,
  },
  {
    id: "ruby-pop",
    name: "Ruby Pop",
    flavour: "Red fruit concept",
    category: "Soft Drinks",
    description:
      "An energetic red-fruit sample product created as an editable catalogue placeholder.",
    packSizes: "Pack sizes to be confirmed",
    color: "#D9473F",
    accent: "#FFC7C1",
    format: "can",
    featured: false,
  },
]

export const navigation = [
  ["Home", "home"],
  ["About Us", "about"],
  ["Products", "products"],
  ["Manufacturing & Quality", "manufacturing"],
  ["Become a Distributor", "distributor"],
  ["Contact", "contact"],
] as const
