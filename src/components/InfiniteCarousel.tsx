import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";

type ImageProps = {
  count: number;
  time?: number;
  index?: number;
};

type selected = {
  selected: boolean;
};

const Container = styled.div({
  width: "100%",
  height: "480px",
  position: "relative",
  backgroundColor: "black",
  // overflow: "hidden",
});

const ImageWrapper = styled.div<ImageProps>(
  {
    height: "100%",
    display: "flex",
  },
  (props) => ({ width: `${props.count * 100}%` })
);

const CarouselImage = styled.div<ImageProps>(
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },
  (props) => ({
    width: `${100 / props.count}%`,
    transform: `translateX(${((props.index as number) + 1) * -100}%)`,
    transition: `transform ${props.time}ms ease-out`,
  })
);

const ArrowLeftDiv = styled.div({
  position: "absolute",
  borderRadius: "9999px",
  width: "40px",
  height: "40px",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  top: "50%",
  left: "8px",
});

const ArrowRightDiv = styled.div({
  position: "absolute",
  borderRadius: "9999px",
  width: "40px",
  height: "40px",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  top: "50%",
  right: "8px",
});

const IndicatorContainer = styled.div({
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  position: "absolute",
  bottom: "0%",
  right: "0%",
  left: "0%",
  marginBottom: "8px",
});

const Indicator = styled.div<selected>(
  {
    width: "16px",
    height: "16px",
    borderRadius: "9999px",
    "&:hover": {
      backgroundColor: "#298AFF",
    },
    cursor: "pointer",
  },
  (props) => ({
    backgroundColor: `${props.selected ? "#298AFF" : "lightgray"}`,
  })
);

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
  const [indicatorIdx, setIndicatorIdx] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [clone, setClone] = useState<
    (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
  >([]);
  const len = slideItems.length + 1;

  // arrow button function
  const handleNextClick = useCallback(() => {
    setIndex((prev) => {
      if (prev >= slideItems.length) {
        return slideItems.length;
      }
      return (prev + 1) % len;
    });
    setTime(transitionTime);
  }, [transitionTime, slideItems.length, len]);

  const handlePrevClick = useCallback(() => {
    setIndex((prev) => {
      if (prev <= 0) {
        return -1;
      }
      return (prev - 1 + len) % len;
    });
    setTime(transitionTime);
  }, [len, transitionTime]);

  // infinite carousel 주요 기믹
  const cloneSlide = (
    slide: (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
  ) => {
    let first = slide[0];
    let last = slide[slide.length - 1];
    return [last, ...slide, first];
  };

  // infinite carousel 주요 기믹
  useEffect(() => {
    setClone(cloneSlide(slideItems));
  }, [slideItems]);

  // infinite carousel 주요 기믹
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

  // autoplay indicator
  useEffect(() => {
    if (index === -1) {
      setIndicatorIdx(slideItems.length - 1);
    } else if (index === slideItems.length) {
      setIndicatorIdx(0);
    } else {
      setIndicatorIdx(index);
    }
  }, [slideItems.length, index]);

  // autoPlay
  useEffect(() => {
    if (autoPlay) {
      if (timer) {
        clearInterval(timer);
      }
      setTimer(
        window.setInterval(() => {
          handleNextClick();
        }, interval)
      );
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, handleNextClick, interval]);

  return (
    <Container
      onMouseEnter={() => {
        if (timer) {
          clearInterval(timer);
        }
      }}
      onMouseLeave={() => {
        if (autoPlay) {
          setTimer(
            window.setInterval(() => {
              handleNextClick();
            }, interval)
          );
        }
      }}
    >
      <ImageWrapper count={clone.length}>
        {clone.map((item, idx) => {
          return (
            <CarouselImage
              count={clone.length}
              index={index}
              time={time}
              key={idx}
            >
              {item}
            </CarouselImage>
          );
        })}
      </ImageWrapper>
      {showArrow && (
        <div>
          <ArrowLeftDiv onClick={handlePrevClick}>p</ArrowLeftDiv>
          <ArrowRightDiv onClick={handleNextClick}>n</ArrowRightDiv>
        </div>
      )}
      {showIndicator && (
        <IndicatorContainer>
          {slideItems.map((_, idx) => (
            <Indicator
              onClick={() => setIndex(idx)}
              key={idx}
              selected={indicatorIdx === idx}
            ></Indicator>
          ))}
        </IndicatorContainer>
      )}
    </Container>
  );
}
