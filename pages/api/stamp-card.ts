import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query;

  if (typeof lineId !== 'string') {
    return res.status(400).json({ message: 'Invalid lineId' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { lineId },
      include: {
        stampCard: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.stampCard);
  } catch (error) {
    console.error('Error fetching stamp cards:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default handler;
