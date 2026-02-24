import { API_URL, authHeaders } from '../config';

export const userService = {


  //je prend tout les user de la tale user
  async getById(id) {
    const response = await fetch(`${API_URL}/api/user/${id}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('User not found');
    }
    return response.json();
  },
};
