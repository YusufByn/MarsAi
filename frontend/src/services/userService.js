import { API_URL } from '../config';

export const userService = {


  //je prend tout les user de la tale user
  async getById(id) {
    const response = await fetch(`${API_URL}/api/user/${id}`);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return response.json();
  },
};
