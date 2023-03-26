import { prismaClient } from './db';
import HTTPError from './error';

export default async function deleteStay(userId, stay) {
  const { uuid } = stay;

  try {
    // Using deleteMany() to be able to enforce user ID
    const response = await prismaClient.stay.deleteMany({
      where: {
        uuid,
        userId,
      },
    });

    // If no records updated, most likely invalid params
    if (!response.count) throw new HTTPError(404, 'Not Found');

    return response;
  } catch (error) {
    throw error;
  }
}
