import type { IconNames } from '@/components/icons'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const FIELD_NAMES = {
  fullName: 'Full name',
  email: 'Email',
  universityId: 'University ID Number',
  password: 'Password',
}

export const FIELD_TYPES = {
  fullName: 'text',
  email: 'email',
  universityId: 'text',
  password: 'password',
}

export const eventTabs = [
  'All',
  'For you',
  'Online',
  'Today',
  'This weekend',
  'Music',
  'Food & Drink',
  'Charity & Cause',
]

export const navbarIcons: {
  name: IconNames
  className: string
  route: string
  title: string
}[] = [
  // {
  //   name: "Heart",
  //   className: "h-6 w-6",
  //   title: "Favorite",
  //   route: "/"
  // },
  // {
  //   name: "Bell",
  //   className: "h-6 w-6",
  //   title: "Notification",
  //   route: "/"
  // },
  {
    name: 'Plus',
    className: 'h-6 w-6',
    title: 'Events',
    route: '/organization/onboarding',
  },
  {
    name: 'LayoutGrid',
    className: 'h-6 w-6',
    title: 'Categories',
    route: '/categories',
  },
]

export const eventSideBarIcons: {
  name: IconNames
  className: string
  route: string
}[] = [
  {
    name: 'Home',
    className: 'bg-blue-100 text-blue-600',
    route: '/organization/home',
  },
  {
    name: 'Calendar',
    className: 'text-grey-500 hover:bg-grey-100',
    route: '/organization/events',
  },
  {
    name: 'Newspaper',
    className: 'text-grey-500 hover:bg-grey-100',
    route: '/organization/orders',
  },
  {
    name: 'ChartColumnDecreasing',
    className: 'text-grey-500 hover:bg-grey-100',
    route: '/organization/reports',
  },
  {
    name: 'Settings',
    className: 'text-grey-500 hover:bg-grey-100',
    route: '/organization/settings',
  },

  {
    name: 'FilePlus2',
    className: 'text-grey-500 hover:bg-grey-100',
    route: '/organization/items',
  },
]

export const landingPageIcons: { name: IconNames; title: string }[] = [
  {
    name: 'Music',
    title: 'Music',
  },
  {
    name: 'Gamepad2',
    title: 'Hobbies',
  },
  {
    name: 'Palette',
    title: 'Visual Arts',
  },
  {
    name: 'Martini',
    title: 'Nightlife',
  },
  {
    name: 'BriefcaseBusiness',
    title: 'Business',
  },
  {
    name: 'Utensils',
    title: 'Food & Drink',
  },
  {
    name: 'MessageCircleHeart',
    title: 'Dating & Social',
  },
  {
    name: 'Gift',
    title: 'Holidays',
  },
]

export const eventsTemp = [
  {
    title:
      'Grown and Sophisticated "All White" Cruise Cincinnati Music Festival',
    date: 'Sat, Jul 26',
    time: '2:30 PM',
    venue: 'River Queen Riverboat',
    price: 'From $35.00',
    organizer: 'YOLLO Group Services, Inc',
    followers: '1.5k followers',
    promoted: true,
    image:
      'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
  },
  {
    title: 'Taxonomia',
    date: 'Wed, Mar 26',
    time: '3:30 PM',
    venue: 'Taft Research Center',
    price: 'Free',
    organizer: 'Taft Research Center',
    followers: '27 followers',
    promoted: false,
    image:
      'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
  },
  {
    title: 'Artful Healing',
    date: 'Saturday',
    time: '1:00 PM',
    venue: 'Artsville',
    price: 'Free',
    organizer: 'Meaningful Connections LLC',
    followers: '11 followers',
    promoted: false,
    image:
      'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
  },
  {
    title: 'YWCA Hamilton presents EnVogue',
    date: 'Sat, Mar 8',
    time: '8:00 PM',
    venue: 'Champion Mill Conference Center',
    price: 'From $75.00',
    organizer: '',
    followers: '',
    promoted: true,
    image:
      'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
  },
]

export const carouselSlides = [
  {
    title: 'COMEDY AT THE CLUB',
    subtitle: "WE'VE GOT JUST THE THING.",
    cta: 'Make plans now',
    features: [
      {
        title: 'STAND-UP SHOWCASES',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-orange-500',
      },
      {
        title: 'POP STAR DANCE PARTIES',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-red-500',
      },
    ],
  },
  {
    title: 'NIGHTLIFE EVENTS',
    subtitle: 'EXPERIENCE THE CITY AFTER DARK.',
    cta: 'Discover events',
    features: [
      {
        title: 'DJ NIGHTS',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-blue-500',
      },
      {
        title: 'THEMED PARTIES',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-purple-500',
      },
    ],
  },
  {
    title: 'WEEKEND SPECIALS',
    subtitle: 'MAKE YOUR WEEKEND MEMORABLE.',
    cta: 'Browse events',
    features: [
      {
        title: 'FOOD FESTIVALS',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-green-500',
      },
      {
        title: 'LIVE PERFORMANCES',
        image:
          'https://lh6.googleusercontent.com/IwFt4lo146o-2nclE0kryTiPcKIj0_14J3QeumW8obmsrqOW3Z-WxkA2dXhS0YKtovQ54fx1PJSa0KHeKLeK-_i3vWpaRR9Sic96YqYOr7l47BI0aUupHAYXh_K2bwbuuNnxLByd',
        bgColor: 'bg-yellow-500',
      },
    ],
  },
]
