export interface IPost {
  id: number;
  title: string;
  excerpt: string;
  county: string; // В API Skillbox именно такое написание поля
  city: string;
  photo: string;
}