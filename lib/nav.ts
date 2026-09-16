export interface NavLink {
  href: string;
  label: string;
}

export interface NavLinkGroup {
  heading: string;
  links: NavLink[];
}

export interface NavMenu {
  key: string;
  label: string;
  groups: NavLinkGroup[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    key: "classes",
    label: "Classes",
    groups: [
      {
        heading: "Classes",
        links: [
          { href: "/classes", label: "All Classes" },
          { href: "/classes/beginners-tai-chi", label: "Beginners Tai Chi" },
          { href: "/classes/tai-chi-improvers", label: "Tai Chi Improvers" },
          { href: "/classes/tai-chi-push-hands", label: "Tai Chi Push Hands" },
          { href: "/classes/applied-tai-chi", label: "Applied Tai Chi" },
        ],
      },
      {
        heading: "Specialty",
        links: [
          { href: "/classes/corporate", label: "Corporate Classes" },
          { href: "/classes/private", label: "Private 1:1 Lessons" },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About",
    groups: [
      {
        heading: "About",
        links: [
          { href: "/about", label: "About Us" },
          { href: "/locations", label: "Locations" },
          { href: "/prices", label: "Prices" },
        ],
      },
    ],
  },
];

// Flat lists for the mobile menu, which lists everything in one column per section.
export const PROGRAM_LINKS: NavLink[] = NAV_MENUS.find((menu) => menu.key === "classes")!.groups.flatMap(
  (group) => group.links,
);
export const ABOUT_LINKS: NavLink[] = NAV_MENUS.find((menu) => menu.key === "about")!.groups.flatMap(
  (group) => group.links,
);
