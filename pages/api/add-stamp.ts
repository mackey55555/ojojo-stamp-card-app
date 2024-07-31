import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_PIN = '1234'; // 店員が知っているPIN

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lineId, pin } = req.body;

  if (pin !== SECRET_PIN) {
    return res.status(403).json({ message: 'Invalid PIN' });
  }

  try {
    const user = await prisma.user.upsert({
      where: { lineId },
      create: {
        lineId,
        stampCard: {
          create: { stamps: 1 }
        }
      },
      update: {
        stampCard: {
          update: {
            where: { stamps: { lt: 20 } },
            data: { stamps: { increment: 1 } }
          }
        }
      },
      include: { stampCard: true }
    });

    res.status(200).json(user.stampCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add stamp' });
  }
};

export default handler;
