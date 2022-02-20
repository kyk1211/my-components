import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  transitionTime?: number;
  autoPlay?: boolean;
  interval?: number;
  showIndicator?: boolean;
  showArrow?: boolean;
}

export default function InfiniteCarousel({
  children,
  transitionTime = 300,
  autoPlay = false,
  interval = 3000,
  showIndicator = true,
  showArrow = true,
}: Props) {
  const [slideItems] = useState(React.Children.toArray(children));
  const [time, setTime] = useState(transitionTime);
  const [indicaterIdx, setIndicaterIdx] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(0);

  const len = slideItems.length + 1;

  const cloneSlide = (
    slide: (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
  ) => {
    let first = slide[0];
    let last = slide[slide.length - 1];
    return [last, ...slide, first];
  };

  const [clone, setClone] = useState<
    (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
  >(cloneSlide(slideItems));

  const handleNextClick = useCallback(() => {
    setIndex((prev) => {
      if (prev >= slideItems.length) {
        return slideItems.length;
      }
      return (prev + 1) % len;
    });
    setTime(300);
  }, [slideItems.length, len]);

  const handlePrevClick = useCallback(() => {
    setIndex((prev) => {
      if (prev <= 0) {
        return -1;
      }
      return (prev - 1 + len) % len;
    });
    setTime(300);
  }, [len]);

  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    if (index === slideItems.length) {
      timer1 = setTimeout(() => {
        setTime(0);
        setIndex(0);
      }, time);
    }
    if (index === -1) {
      timer1 = setTimeout(() => {
        setTime(0);
        setIndex(3);
      }, time);
    }
    return () => clearTimeout(timer1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideItems.length, index]);

  useEffect(() => {
    if (index === -1) {
      setIndicaterIdx(slideItems.length - 1);
    } else if (index === slideItems.length) {
      setIndicaterIdx(0);
    } else {
      setIndicaterIdx(index);
    }
  }, [slideItems.length, index]);

  useEffect(() => {
    setClone(cloneSlide(slideItems));
  }, [slideItems]);

  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }
    setTimer(
      window.setInterval(() => {
        handleNextClick();
      }, 3000)
    );
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNextClick]);

  return (
    <div
      className="w-full h-[200px] relative mt-2"
      onMouseEnter={() => clearInterval(timer)}
      onMouseLeave={() =>
        setTimer(
          window.setInterval(() => {
            handleNextClick();
          }, 3000)
        )
      }
    >
      <div className="w-full h-full">
        <div className="w-[calc(6*100%)] h-full flex">
          {clone.map((color, idx) => {
            return (
              <div
                className={`w-[calc(100%/6+16px)] h-full flex items-center justify-center mx-2 ${
                  color === 1 ? `bg-red-500` : `bg-blue-500`
                }`}
                key={idx}
              >
                <span>{index}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute top-[50%] left-2 rounded-full w-5 h-5 bg-white flex items-center justify-center cursor-pointer"
        onClick={handlePrevClick}
      >
        p
      </div>
      <div
        className="absolute top-[50%] right-2 rounded-full w-5 h-5 bg-white flex items-center justify-center cursor-pointer"
        onClick={handleNextClick}
      >
        n
      </div>
      <div className="flex justify-center gap-2 absolute bottom-0 right-0 left-0 mb-1">
        {slideItems.map((_, idx) => (
          <div
            className={`w-2 h-2 rounded-full ${
              indicaterIdx === idx ? `bg-blue-800` : 'bg-gray-600'
            } hover:bg-blue-800 cursor-pointer`}
            onClick={() => setIndex(idx)}
            key={idx}
          ></div>
        ))}
      </div>
    </div>
  );
}
