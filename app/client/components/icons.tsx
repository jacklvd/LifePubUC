import {
  CirclePlus,
  ChevronRightIcon,
  SearchIcon,
  UserIcon,
  BinocularsIcon,
  MegaphoneIcon,
  TicketIcon,
  Search,
  ShoppingCart,
  Bell,
  Heart,
  AlignJustify,
  Calendar,
  ChartColumnDecreasing,
  Settings,
  HelpCircle,
  Newspaper,
  Mic,
  Disc,
  Palette,
  Gamepad2,
  Briefcase,
  Utensils,
  MapPin,
  Check,
  CreditCard,
  Trash,
  ChevronLeft,
  Home,
  Plus,
  Music,
  BriefcaseBusiness,
  Gift,
  MessageCircleHeart,
  Martini,
  Puzzle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LogOut,
  LayoutGrid,
  Settings2,
  ArrowUpDown,
  Clock,
  Info,
  Upload,
  Download,
  LayoutList,
  RefreshCcw,
  BadgeCheck,
  X,
  FilePlus2,
  Pencil,
  MoreVertical,
  Edit,
  Ticket,
  Eye,
  AlertCircle,
  Menu,
  Logs,
  SquareMenu,
  TrendingUp,
} from 'lucide-react'

const ICONS = {
  Search: Search,
  ShoppingCart: ShoppingCart,
  Bell: Bell,
  Heart: Heart,
  AlignJustify: AlignJustify,
  CirclePlus: CirclePlus,
  ChevronRightIcon: ChevronRightIcon,
  UserIcon: UserIcon,
  BinocularsIcon: BinocularsIcon,
  MegaphoneIcon: MegaphoneIcon,
  TicketIcon: TicketIcon,
  SearchIcon: SearchIcon,
  Calendar: Calendar,
  ChartColumnDecreasing: ChartColumnDecreasing,
  Settings: Settings,
  HelpCircle: HelpCircle,
  Newspaper: Newspaper,
  Mic: Mic,
  Disc: Disc,
  Palette: Palette,
  Gamepad2: Gamepad2,
  Briefcase: Briefcase,
  Utensils: Utensils,
  MapPin: MapPin,
  Check: Check,
  CreditCard: CreditCard,
  Trash: Trash,
  ChevronLeft: ChevronLeft,
  Home: Home,
  Plus: Plus,
  Music: Music,
  BriefcaseBusiness: BriefcaseBusiness,
  Gift: Gift,
  MessageCircleHeart: MessageCircleHeart,
  Martini: Martini,
  Puzzle: Puzzle,
  ChevronDown: ChevronDown,
  ChevronRight: ChevronRight,
  ChevronUp: ChevronUp,
  LogOut: LogOut,
  LayoutGrid: LayoutGrid,
  Settings2: Settings2,
  ArrowUpDown: ArrowUpDown,
  Clock: Clock,
  Info: Info,
  Upload: Upload,
  Download: Download,
  LayoutList: LayoutList,
  RefreshCcw: RefreshCcw,
  BadgeCheck: BadgeCheck,
  X: X,
  FilePlus2: FilePlus2,
  Pencil: Pencil,
  MoreVertical: MoreVertical,
  Edit: Edit,
  Ticket: Ticket,
  Eye: Eye,
  AlertCircle: AlertCircle,
  Menu: Menu,
  Logs: Logs,
  SquareMenu: SquareMenu,
  TrendingUp: TrendingUp,
} as const

export type IconNames = keyof typeof ICONS

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconNames
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucidIcon = ICONS[name] || ICONS.Search
  return <LucidIcon {...props} />
}
