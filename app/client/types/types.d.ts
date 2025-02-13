interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
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
  title: string,
  description: string,
  price: number, 
  amount: number

}

interface Category {
  title: string,
  url: string
}