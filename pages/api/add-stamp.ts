import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { lineId, pin } = req.body;

    // PINのチェック
    if (pin !== '1234') {
      return res.status(403).json({ message: 'PINが間違っています' });
    }

    try {
      // ユーザーを検索または作成
      const user = await prisma.user.upsert({
        where: { lineId },
        update: {},
        create: { lineId },
      });

      // 最新のスタンプカードを取得
      const existingCard = await prisma.stampCard.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!existingCard || existingCard.stamps >= 20) {
        // もしスタンプカードがないか、スタンプが20個以上なら新しいカードを作成
        const newCard = await prisma.stampCard.create({
          data: {
            userId: user.id,
            stamps: 1, // 新しいカードは1つのスタンプから開始
          },
        });

        return res.json(newCard);
      } else {
        // 既存のスタンプカードにスタンプを追加
        const updatedCard = await prisma.stampCard.update({
          where: { id: existingCard.id },
          data: {
            stamps: existingCard.stamps + 1, // 既存のスタンプ数を1増やす
          },
        });

        return res.json(updatedCard);
      }
    } catch (error) {
      console.error('スタンプ追加中にエラーが発生しました:', error);
      return res.status(500).json({ message: '内部サーバーエラー', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'メソッドが許可されていません' });
  }
};

export default handler;
