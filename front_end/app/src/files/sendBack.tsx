import axios from 'axios';

const sendBack = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du backend', error);
  }
  return;
};

export default sendBack;