import { default as axios } from 'axios';

const protocol = 'http';
const domainName = '192.168.100.4';

export const Api = axios.create({
  baseURL: `${protocol}://${domainName}/Mobiles/backend/public/api/`,
});

export const Img = "http://192.168.100.4/Mobiles/Backend/public/storage/Images/";


export interface FoodResponse {
  id: number;
  Name: string;
  Image: string;
  Description: string;
  Price: number;
  idFoodGroupFK: number;
}