import axios from 'axios';

const sendBack = async () => {
  try {
    const response = await axios.get('URL_DU_BACKEND/api/data');
    console.log(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du backend', error);
  }
};

export default sendBack;