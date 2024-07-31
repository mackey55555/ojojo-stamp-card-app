import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId } = req.query as { lineId: string };

  try {
    const user = await prisma.user.findUnique({
      where: { lineId },
      include: { stampCard: true }
    });
    res.status(200).json(user ? user.stampCard : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stamp cards' });
  }
};

export default handler;
