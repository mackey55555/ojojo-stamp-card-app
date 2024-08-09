import { useEffect, useState } from 'react';
import liff from '@line/liff';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css'; // CSSモジュールをインポート

interface StampCard {
  id: number;
  stamps: number;
  createdAt: string;
}

const Home: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quote, setQuote] = useState<string>("");
  
  const quotes = [
    "今日の努力が、明日の成功を生む。",
    "失敗は成功の母。",
    "心を込めて生きれば、道は開かれる。",
    "挑戦しなければ、何も得られない。",
    "努力は嘘をつかない。",
    "笑顔は世界を照らす。",
    "明日は今日よりも良くなる。",
    "誠実さは最大の強み。",
    "夢は見るものではなく、叶えるもの。",
    "何事も一歩ずつ。",
    "忍耐は力なり。",
    "一歩一歩が道を作る。",
    "逆境こそが成長のチャンス。",
    "信じる心が力になる。",
    "結果よりも過程が大事。",
    "継続は力なり。",
    "人を幸せにすることで、自分も幸せになる。",
    "希望を持ち続けることが成功の秘訣。",
    "自分を信じて前に進め。",
    "努力の積み重ねが成功を生む。",
    "失敗を恐れずに挑戦しよう。",
    "幸せはいつも心の中に。",
    "毎日が新しい始まり。",
    "目標に向かって全力で進め。",
    "勇気を持って前に進め。",
    "夢は叶うためにある。",
    "過去を振り返らず、未来を見据えよう。",
    "小さな一歩が大きな結果を生む。",
    "誠実さが人を動かす。",
    "人を思いやる心が大切。",
    "どんな困難も乗り越えられる。",
    "未来は自分で切り開くもの。",
    "毎日を大切に生きよう。",
    "心を開けば、道は開ける。",
    "夢を追いかけよう。",
    "目標に向かって進み続けよう。",
    "希望を捨てずに前進しよう。",
    "努力を惜しまずに生きよう。",
    "人を喜ばせることが自分を喜ばせる。",
    "思いやりの心が人を動かす。",
    "信じる力が奇跡を生む。",
    "成功は日々の積み重ねから生まれる。",
    "諦めずに挑戦し続けよう。",
    "夢は見るものではなく、実現するもの。",
    "行動しなければ、何も始まらない。",
    "努力は自分を裏切らない。",
    "希望を持ち続けることが成功の鍵。",
    "人に親切にすれば、幸せが返ってくる。",
    "挑戦し続けることで成長する。",
    "夢は叶うと信じて努力しよう。",
    "未来を見据えて行動しよう。",
    "人に優しく、自分にも優しく。",
    "幸せは自分の心の中にある。",
    "目標に向かって歩み続けよう。",
    "努力を惜しまずに生きよう。",
    "困難は乗り越えるためにある。",
    "信じる心が成功を呼ぶ。",
    "夢を追い続けることが大切。",
    "目標に向かって進み続ける。",
    "日々の努力が大きな成果を生む。",
    "夢は見るものではなく、実現するもの。",
    "希望を持ち続けることで道が開ける。",
    "人に優しく、自分にも優しく。",
    "夢を叶えるために努力しよう。",
    "行動しなければ、何も始まらない。",
    "未来を見据えて前に進もう。",
    "困難は乗り越えるためにある。",
    "成功は日々の努力から生まれる。",
    "信じる心が力になる。",
    "諦めずに挑戦し続けよう。",
    "未来は自分で切り開くもの。",
    "希望を持ち続けることで道が開ける。",
    "目標に向かって進み続けよう。",
    "夢は見るものではなく、実現するもの。",
    "努力を惜しまずに生きよう。",
    "信じる心が成功を呼ぶ。",
    "夢を叶えるために努力しよう。",
    "未来を見据えて行動しよう。",
    "日々の努力が大きな成果を生む。",
    "諦めずに挑戦し続けよう。",
    "人に優しく、自分にも優しく。",
    "夢を追い続けることが大切。",
    "希望を持ち続けることで道が開ける。",
    "困難は乗り越えるためにある。",
    "信じる心が力になる。",
    "成功は日々の努力から生まれる。",
    "夢は見るものではなく、実現するもの。",
    "目標に向かって歩み続けよう。",
    "行動しなければ、何も始まらない。",
    "未来を見据えて前に進もう。",
    "夢を叶えるために努力しよう。",
    "信じる心が成功を呼ぶ。",
    "日々の努力が大きな成果を生む。",
    "未来を見据えて行動しよう。",
    "希望を持ち続けることで道が開ける。"
  ];

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID as string;

    if (!liffId) {
      console.error("LIFF ID is not provided");
      return;
    }

    liff.init({ liffId })
      .then(() => {
        console.log("LIFF initialized");
        if (liff.isLoggedIn()) {
          liff.getProfile().then(profile => {
            console.log("User Profile:", profile);
            setUserId(profile.userId);
            fetchStampCard(profile.userId);
          }).catch(error => console.error("Failed to get profile:", error));
        } else {
          liff.login();
        }
      })
      .catch(error => console.error("Failed to initialize LIFF:", error));

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // フェードイン
    setTimeout(() => {
      const overlay = document.querySelector(`.${styles.overlay}`);
      if (overlay) {
        overlay.classList.add(styles.visible);
      }
    }, 100);

    // 2秒後にフェードアウト
    setTimeout(() => {
      const overlay = document.querySelector(`.${styles.overlay}`);
      if (overlay) {
        overlay.classList.remove(styles.visible);
      }
      setIsLoading(false);
    }, 4000);
  }, []);

  const fetchStampCard = async (lineId: string) => {
    try {
      console.log(`Fetching stamp cards for lineId: ${lineId}`);
      const res = await fetch(`/api/stamp-card?lineId=${lineId}`);
      const data: StampCard[] = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setStampCards(data);
        setCurrentIndex(data.length - 1);  // 最新のカードを表示するため、currentIndexを設定
      } else {
        setStampCards([]);
        setCurrentIndex(0);
      }

      console.log("Fetched stamp cards:", data);
    } catch (error) {
      console.error('Failed to fetch stamp cards:', error);
      setStampCards([]); // エラーが発生した場合にカードをクリア
      setCurrentIndex(0);
    }
  };

  const addStamp = async () => {
    console.log("Add stamp button clicked");
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
      const data: StampCard[] = await res.json();
      console.log("Updated stamp cards:", data);
      setStampCards(Array.isArray(data) ? data : []);
      setCurrentIndex(data.length - 1); // 新しいスタンプカードを現在の表示に設定

      // スタンプ追加後にページをリロード
      setTimeout(() => {
        window.location.reload(); // ページリロード
      }, 500); // リロードまでのディレイを調整
    } catch (error) {
      console.error('Failed to add stamp:', error);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stampCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const reversedStampCards = [...stampCards].reverse();

  return (
    <div className={styles.stampCardWrapper}>
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.loadingContent}>
            <img src="/mystamp.png" alt="Loading" className={styles.stampImage} />
            <div className={styles.quote}>{quote}</div>
          </div>
        </div>
      )}
      <h1>スタンプカード</h1>
      <button className={styles.addButton} onClick={addStamp}>スタンプを追加</button>
      <div className={styles.stampCardContainerWrapper}>
        <button className={`${styles.button} ${styles.left}`} onClick={handlePrev} disabled={currentIndex === 0}>
          &lt;
        </button>
        <div className={styles.stampCardContainer}>
          <div className={styles.cardInfo}>
            {currentIndex + 1}/{reversedStampCards.length}
          </div>
          {[...Array(20)].map((_, index) => {
            const stampCard = reversedStampCards[currentIndex];
            if (!stampCard) return null;

            const stampNumber = currentIndex * 20 + index + 1;
            const isStamped = index < stampCard.stamps;
            return (
              <div
                key={index}
                className={`${styles.stampCardItem} ${isStamped ? styles.stamped : ''}`}
              >
                <div className={styles.stampNumber}>{stampNumber}</div>
              </div>
            );
          })}
        </div>
        <button className={`${styles.button} ${styles.right}`} onClick={handleNext} disabled={currentIndex === reversedStampCards.length - 1}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
