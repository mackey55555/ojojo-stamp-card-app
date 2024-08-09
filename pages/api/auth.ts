import { NextApiRequest, NextApiResponse } from 'next';
import liff from '@line/liff';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });

    if (!liff.isLoggedIn()) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const profile = await liff.getProfile();
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate' });
  }
};

export default handler;
