import { Search, FileStack } from "lucide-react";

export const MAX_FREE_COUNTS = 3;

export const tools = [
  {
    label: 'Rettskildesøk',
    icon: Search,
    href: '/search?categories%5BhierarchicalCategories.lvl0%5D%5B0%5D=Rettsavgjørelser',
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    label: 'Interntsøk',
    icon: FileStack,
    href: '/internal',
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
  },
];
