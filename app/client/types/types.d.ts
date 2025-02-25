interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: string;
}

interface User {
  fullName: string;
  email: string;
  password: string;
  universityId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Item {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: {
    amount: number;
  };
  images: string[];
  status: string;
  views: number;
}

interface Category {
  title: string,
  url: string
}