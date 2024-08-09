import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { lineId, pin } = req.body;

    if (pin !== '1234') {
      return res.status(403).json({ message: 'PIN is incorrect' });
    }

    try {
      let user = await prisma.user.upsert({
        where: { lineId },
        update: {},
        create: { lineId },
      });

      const existingCard = await prisma.stampCard.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!existingCard || existingCard.stamps >= 20) {
        const newCard = await prisma.stampCard.create({
          data: {
            userId: user.id,
            stamps: 1,
          },
        });

        return res.json(newCard);
      }

      const updatedCard = await prisma.stampCard.update({
        where: { id: existingCard.id },
        data: {
          stamps: { increment: 1 },
        },
      });

      return res.json(updatedCard);
    } catch (error: any) { // 修正ポイント: error の型を any とする
      console.error('スタンプ追加中にエラーが発生しました:', error);
      return res.status(500).json({ message: '内部サーバーエラー', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'メソッドが許可されていません' });
  }
};

export default handler;
