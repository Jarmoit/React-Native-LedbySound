import axios from 'axios';

const API_KEY = process.env.DOG_API_KEY as string;

export const theDogApi = axios.create({
  baseURL: 'https://api.thedogapi.com/v1',
  headers: {
    'x-api-key': API_KEY
  }
});
