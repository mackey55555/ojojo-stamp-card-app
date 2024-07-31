import { useEffect, useState } from 'react';
import liff from '@line/liff';
import type { NextPage } from 'next';

interface StampCard {
  id: number;
  stamps: number;
  createdAt: string;
}

const Home: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [stampCards, setStampCards] = useState<StampCard[]>([]);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID as string;

    if (!liffId) {
      console.error("LIFF ID is not provided");
      return;
    }

    liff.init({ liffId })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile().then(profile => {
            setUserId(profile.userId);
            fetchStampCard(profile.userId);
          });
        } else {
          liff.login();
        }
      })
      .catch(console.error);
  }, []);

  const fetchStampCard = async (lineId: string) => {
    try {
      const res = await fetch(`/api/stamp-card?lineId=${lineId}`);
      const data = await res.json();
      setStampCards(data);
    } catch (error) {
      console.error('Failed to fetch stamp cards:', error);
    }
  };

  const addStamp = async () => {
    const pin = prompt("PINを入力してください:");
    if (!pin) return;

    try {
      const res = await fetch('/api/add-stamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lineId: userId, pin })
      });
      const data = await res.json();
      setStampCards(data);
    } catch (error) {
      console.error('Failed to add stamp:', error);
    }
  };

  return (
    <div>
      <h1>スタンプカード</h1>
      <div onClick={addStamp}>
        {stampCards.map(card => (
          <div key={card.id}>
            <p>スタンプ数: {card.stamps}</p>
            <p>作成日: {new Date(card.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
