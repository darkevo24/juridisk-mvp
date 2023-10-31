import { Search } from "lucide-react";

export const MAX_FREE_COUNTS = 3;

export const tools = [
  {
    label: 'Rettskildesøk',
    icon: Search,
    href: '/search?categories%5BhierarchicalCategories.lvl0%5D%5B0%5D=Rettsavgjørelser',
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];
