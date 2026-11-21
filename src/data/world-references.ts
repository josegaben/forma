export interface GlobalDesignDirectory {
  name: string;
  url: string;
  category:
    | "Curated Galleries"
    | "Color Science & Palettes"
    | "SaaS & Landings"
    | "Product & Flows"
    | "Components & Motion"
    | "Typography & Brand"
    | "Brutalist & Indie"
    | "Agent & OSS Specs";
}

export const GLOBAL_DESIGN_DIRECTORIES: GlobalDesignDirectory[] = [
  // Curated Galleries
  { name: "Awwwards", url: "https://www.awwwards.com", category: "Curated Galleries" },
  { name: "Godly.website", url: "https://godly.website", category: "Curated Galleries" },
  { name: "A1.gallery", url: "https://www.a1.gallery", category: "Curated Galleries" },
  { name: "SiteInspire", url: "https://www.siteinspire.com", category: "Curated Galleries" },
  { name: "Curated.design", url: "https://www.curated.design", category: "Curated Galleries" },
  { name: "Minimal.gallery", url: "https://minimal.gallery", category: "Curated Galleries" },
  { name: "DeadSimpleSites", url: "https://deadsimplesites.com", category: "Curated Galleries" },
  { name: "DarkModeDesign", url: "https://www.darkmodedesign.com", category: "Curated Galleries" },
  { name: "The FWA", url: "https://thefwa.com", category: "Curated Galleries" },
  { name: "CSS Design Awards", url: "https://www.cssdesignawards.com", category: "Curated Galleries" },
  { name: "Maxibestof", url: "https://maxibestof.one", category: "Curated Galleries" },
  { name: "Hoverstat.es", url: "https://www.hoverstat.es", category: "Curated Galleries" },
  { name: "Klikkenthéke", url: "https://klikkentheke.com", category: "Curated Galleries" },
  { name: "Loadmore", url: "https://loadmore.com", category: "Curated Galleries" },
  { name: "Cosmos.so", url: "https://www.cosmos.so", category: "Curated Galleries" },
  { name: "Savee", url: "https://savee.it", category: "Curated Galleries" },

  // SaaS & Landings
  { name: "Landings.dev", url: "https://landings.dev", category: "SaaS & Landings" },
  { name: "Lapa.ninja", url: "https://www.lapa.ninja", category: "SaaS & Landings" },
  { name: "Landingfolio", url: "https://www.landingfolio.com", category: "SaaS & Landings" },
  { name: "SaaSLandingPage", url: "https://saaslandingpage.com", category: "SaaS & Landings" },
  { name: "OnePageLove", url: "https://onepagelove.com", category: "SaaS & Landings" },
  { name: "PageCollective", url: "https://pagecollective.com", category: "SaaS & Landings" },
  { name: "Footer.design", url: "https://www.footer.design", category: "SaaS & Landings" },
  { name: "CTA.gallery", url: "https://www.cta.gallery", category: "SaaS & Landings" },
  { name: "Navbar.gallery", url: "https://www.navbar.gallery", category: "SaaS & Landings" },
  { name: "PricingPages.design", url: "https://pricingpages.design", category: "SaaS & Landings" },
  { name: "BentoGrids", url: "https://bentogrids.com", category: "SaaS & Landings" },
  { name: "OGimage.gallery", url: "https://www.ogimage.gallery", category: "SaaS & Landings" },

  // Product & Flows
  { name: "Mobbin", url: "https://mobbin.com", category: "Product & Flows" },
  { name: "Refero.design", url: "https://refero.design", category: "Product & Flows" },
  { name: "NicelyDone", url: "https://nicelydone.club", category: "Product & Flows" },
  { name: "Screenlane", url: "https://screenlane.com", category: "Product & Flows" },
  { name: "Webframe.xyz", url: "https://webframe.xyz", category: "Product & Flows" },
  { name: "SaaSInterface", url: "https://saasinterface.com", category: "Product & Flows" },
  { name: "Scrnshts", url: "https://scrnshts.club", category: "Product & Flows" },
  { name: "Component.gallery", url: "https://component.gallery", category: "Product & Flows" },

  // Components & Motion
  { name: "Rare UI", url: "https://www.rareui.com", category: "Components & Motion" },
  { name: "21st.dev", url: "https://21st.dev", category: "Components & Motion" },
  { name: "Origin UI", url: "https://originui.com", category: "Components & Motion" },
  { name: "Motion Primitives", url: "https://motion-primitives.com", category: "Components & Motion" },
  { name: "Vaul (Drawer)", url: "https://vaul.emilkowal.ski", category: "Components & Motion" },
  { name: "Sonner (Toast)", url: "https://sonner.emilkowal.ski", category: "Components & Motion" },
  { name: "cmdk (Command)", url: "https://cmdk.paco.me", category: "Components & Motion" },
  { name: "Paper Shaders", url: "https://shaders.paper.design", category: "Components & Motion" },
  { name: "Unicorn Studio", url: "https://www.unicorn.studio", category: "Components & Motion" },
  { name: "SVGL Logos", url: "https://svgl.app", category: "Components & Motion" },
  { name: "Phosphor Icons", url: "https://phosphoricons.com", category: "Components & Motion" },
  { name: "Magic UI", url: "https://magicui.design", category: "Components & Motion" },
  { name: "Aceternity UI", url: "https://ui.aceternity.com", category: "Components & Motion" },
  { name: "Cult UI", url: "https://www.cult-ui.com", category: "Components & Motion" },
  { name: "Skiper UI", url: "https://skiper-ui.com", category: "Components & Motion" },
  { name: "Codrops", url: "https://tympanus.net/codrops", category: "Components & Motion" },
  { name: "Emil Kowalski", url: "https://emilkowal.ski", category: "Components & Motion" },
  { name: "Rauno Freiberg", url: "https://rauno.me", category: "Components & Motion" },

  // Typography & Brand
  { name: "Typewolf", url: "https://www.typewolf.com", category: "Typography & Brand" },
  { name: "Fonts In Use", url: "https://fontsinuse.com", category: "Typography & Brand" },
  { name: "Rebrand.gallery", url: "https://rebrand.gallery", category: "Typography & Brand" },
  { name: "Brand Archive", url: "https://brandarchive.xyz", category: "Typography & Brand" },
  { name: "P de Pablo", url: "https://pdepablo.com", category: "Typography & Brand" },
  { name: "Resiz.es", url: "https://resiz.es", category: "Typography & Brand" },

  // Brutalist & Indie
  { name: "Httpster", url: "https://httpster.net", category: "Brutalist & Indie" },
  { name: "Brutalist Websites", url: "https://brutalistwebsites.com", category: "Brutalist & Indie" },
  { name: "Are.na", url: "https://www.are.na", category: "Brutalist & Indie" },

  // Agent & OSS Specs
  { name: "treg.to", url: "https://treg.to", category: "Agent & OSS Specs" },
  { name: "unslop-ui", url: "https://github.com/felipebasurto/unslop-ui", category: "Agent & OSS Specs" },
  { name: "awesome-design-md", url: "https://github.com/VoltAgent/awesome-design-md", category: "Agent & OSS Specs" },
  { name: "forma-xray", url: "https://github.com/josegaben/forma-xray", category: "Agent & OSS Specs" },

  // Color Science & Palettes
  { name: "Realtime Colors", url: "https://www.realtimecolors.com", category: "Color Science & Palettes" },
  { name: "Happy Hues", url: "https://www.happyhues.co", category: "Color Science & Palettes" },
  { name: "Radix Colors", url: "https://www.radix-ui.com/colors", category: "Color Science & Palettes" },
  { name: "OKLCH.fyi", url: "https://oklch.fyi", category: "Color Science & Palettes" },
  { name: "OKLCH Picker", url: "https://oklch.com", category: "Color Science & Palettes" },
  { name: "Atmos.style", url: "https://atmos.style", category: "Color Science & Palettes" },
  { name: "Huemint", url: "https://huemint.com", category: "Color Science & Palettes" },
  { name: "Sanzo Wada Colors", url: "https://wada-sanzo-colors.com", category: "Color Science & Palettes" },
  { name: "Coolors", url: "https://coolors.co", category: "Color Science & Palettes" },
  { name: "Color Hunt", url: "https://colorhunt.co", category: "Color Science & Palettes" },
  { name: "UI Colors", url: "https://uicolors.app", category: "Color Science & Palettes" },
  { name: "Adobe Leonardo", url: "https://leonardocolor.io", category: "Color Science & Palettes" },
  { name: "Khroma", url: "https://www.khroma.co", category: "Color Science & Palettes" },
  { name: "Pigment", url: "https://pigment.shapefactory.co", category: "Color Science & Palettes" },
  { name: "2Colors", url: "https://2colors.colorion.co", category: "Color Science & Palettes" },
  { name: "Colorffy", url: "https://colorffy.com", category: "Color Science & Palettes" },
  { name: "SupaPalette", url: "https://www.supapalette.com", category: "Color Science & Palettes" },
  { name: "Culori", url: "https://culorijs.org", category: "Color Science & Palettes" },
];
