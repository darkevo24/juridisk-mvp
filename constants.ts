import { Search, FileStack, FolderClosed } from "lucide-react";

export const MAX_FREE_COUNTS = 3;

export const tools = [
  {
    label: 'Rettskildesøk',
    icon: Search,
    href: '/search',
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
  {
    label: "Filbehandling",
    icon: FolderClosed,
    href: "/files",
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
];
