import { NavItemType } from "@/types";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? process.env.DEV_URL : process.env.PRO_URL,
});

export const navItems: NavItemType[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/techs", label: "Techs" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export const adminNavItems: NavItemType[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/techs", label: "Techs" },
  { path: "/projects", label: "Projects" },
  { path: "/dashboard", label: "Dashboard" },
];

export const myImage =
  "data:image/jpeg;base64,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";

export const techs = [
  {
    index: 0,
    url: "data:image/png;base64,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",
    label: "HTML",
    category: "frontend",
  },
  {
    index: 1,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3uofg6_aMoy5uheSBSnaNkvx23X5lsA5az_PWbkXzv57pIxQk1rmmsOas35M1PlmAL4E&usqp=CAU",
    label: "CSS",
    category: "frontend",
  },
  {
    index: 2,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeaIXExN_CMJjcREMSRAadT9ODmpyOq0wgBZmYBWZ-xyGgu182SE5mexmDpylBWYNaiwc&usqp=CAU",
    label: "JavaScript",
    category: "frontend",
  },
  {
    index: 3,
    url: "https://thumbs.dreamstime.com/b/letter-t-s-ts-logo-design-template-minimal-monogram-initial-based-logotype-trendy-company-identity-314698301.jpg",
    label: "TypeScript",
    category: "frontend",
  },
  {
    index: 4,
    url: "https://www.svgrepo.com/show/327388/logo-react.svg",
    label: "ReactJS",
    category: "frontend",
  },
  {
    index: 5,
    url: "https://www.svgrepo.com/show/368858/nextjs.svg",
    label: "NextJS",
    category: "fullstack",
  },
  {
    index: 6,
    url: "https://cdn.icon-icons.com/icons2/2622/PNG/512/brand_nodejs_icon_157858.png",
    label: "NodeJS",
    category: "backend",
  },
  {
    index: 7,
    url: "https://lh5.googleusercontent.com/proxy/KTMTgxEwIkK5PtvXhl3qRBO_BB797q_ixPFFLP4lLCImNbufF5V6bRvVbBMHSuQ8rF4IiMBjIOW539IuELV-Ir5X7ppI40BUOkd4ytO87v9gDRIgWsm_UXt84aMVd_6v8_pPt_ZACSm-km9RlQ",
    label: "ExpressJS",
    category: "backend",
  },
  {
    index: 8,
    url: "https://cdn.icon-icons.com/icons2/3913/PNG/512/mongodb_logo_icon_248434.png",
    label: "MongoDB",
    category: "backend",
  },
  {
    index: 9,
    url: "https://brandslogos.com/wp-content/uploads/images/large/postgresql-inc-logo-black-and-white.png",
    label: "PostgresSQL",
    category: "backend",
  },
  {
    index: 10,
    url: "https://git-scm.com/images/logos/logomark-black@2x.png",
    label: "Git",
    category: "VCS",
  },
];
