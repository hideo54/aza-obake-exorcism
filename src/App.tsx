import React, { useEffect, useState } from 'react';
import { random } from 'lodash';
import styled, { keyframes } from 'styled-components';
import './App.css';

type ItemName = 'aza-obake' | 'azaika';

const appear = keyframes`
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
`;

const Img = styled.img`
  max-width: 100%;
  animation: 0.5s ${appear};
  ${props => props.onClick && `
    cursor: pointer;
  `}
`;

const Button = styled.button`
  width: 200px;
  height: 30px;
  border-radius: 15px;
  cursor: pointer;
`;

const H1 = styled.h1`
  text-align: center;
`

const TimerP = styled.p<{ timer: number; }>`
  font-size: 1.5em;
  text-align: center;
  ${props => {
    const remainingRate = props.timer / PLAY_SECONDS;
    if (remainingRate < 0.3) {
      return 'color: red;';
    } else if (remainingRate < 0.5) {
      return 'color: orange;';
    }
    return 'color: green';
  }}
  font-weight: bold;
`;

const ResultDiv = styled.div`
  width: 300px;
  border: 2px solid green;
  margin: 0 auto;
  padding: 1em;
  text-align: center;
`;

const PointP = styled.p`
  margin-top: 0;
  font-size: 2em;
  font-weight: bold;
`;

const Item: React.FC<{
  item: ItemName | null;
  onExorcise: () => void;
  onMiss: () => void;
}> = (props) => {
  const [ clicked, setClicked ] = useState(false);
  return (
    props.item ? (
      props.item === 'aza-obake' ? (
        clicked ? (
          <Img src='/aza-obake-exorcism/gaming-azaika.png' />
        ) : (
          <Img src='/aza-obake-exorcism/aza-obake.png' onClick={() => {
            setClicked(true);
            props.onExorcise();
          }} />
        )
      ) : (
        clicked ? (
          <Img src='/aza-obake-exorcism/azaika-crying.png' />
        ) : (
          <Img src='/aza-obake-exorcism/azaika.png' onClick={() => {
            setClicked(true);
            props.onMiss();
          }} />
        )
      )
    ) : (
      <Img src='/empty.png' />
    )
  );
};

const WIDTH = 5;
const HEIGHT = 5;
const EACH_APPEAR_COUNT = 2;
const OBAKE_RATE = 0.8;
const PLAY_SECONDS = 20;

const App: React.FC = () => {
  const emptyItems: (ItemName | null)[] = Array(WIDTH * HEIGHT).fill(null);
  const [ items, setItems ] = useState(emptyItems);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ exorciseCount, setExorciseCount ] = useState(0);
  const [ missCount, setMissCount ] = useState(0);
  const [ timer, setTimer ] = useState(PLAY_SECONDS);
  useEffect(() => {
    if (isPlaying && timer > 0) {
      const gameProgress = 1 - (timer / PLAY_SECONDS);
      const newItems = emptyItems.slice();
      for (let i = 0; i < EACH_APPEAR_COUNT + gameProgress * 3; i++) {
        const j = random(0, WIDTH * HEIGHT - 1);
        newItems[j] = random() < OBAKE_RATE ? 'aza-obake' : 'azaika';
      }
      setItems(newItems);
    }
  }, [ isPlaying, timer ]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        if (timer > 0) {
          setTimer(c => Math.max(c - 1, 0));
        }
      }
    }, 1000);
    return () => { clearInterval(interval); };
  }, [ isPlaying ]);
  return (
    <div>
      <H1>aza-obake 除霊ゲーム</H1>
      <TimerP timer={timer}>残り時間: {timer}</TimerP>
      {!isPlaying &&
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => {
            setIsPlaying(true);
          }}>
            はじめる
          </Button>
        </div>
      }
      {timer > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
          gridAutoRows: 'minmax(auto, 100%)',
        }}>{
          items.map((item, i) => (
            <Item
              key={`${timer}-${i}`}
              item={item}
              onExorcise={() => {
                setExorciseCount(c => c + 1);
              }}
              onMiss={() => {
                setMissCount(c => c + 1);
              }}
            />
          ))
        }</div>
      ) : (
        <ResultDiv>
          <p>スコア</p>
          <PointP>{exorciseCount - missCount * 2}</PointP>
          <p>除霊成功: {exorciseCount}</p>
          <p>失敗: {missCount}</p>
          <Button onClick={() => {
           setIsPlaying(true);
           setTimer(PLAY_SECONDS);
           setExorciseCount(0);
           setMissCount(0);
          }}>
            もう一度プレイする
          </Button>
        </ResultDiv>
      )}
    </div>
  )
}

export default App;
