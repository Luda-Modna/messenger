import React from 'react';
import styles from './PlanetBackground.module.sass';

const PLANETS_COUNT = 50;
const STARS_COUNT = 100;

function random (min, max) {
  return Math.random() * (max - min) + min;
}

function PlanetBackground () {
  const planets = Array.from({ length: PLANETS_COUNT }).map((_, i) => {
    const size = random(10, 40);
    const top = random(0, 100);
    const left = random(0, 100);
    const duration = random(30, 70);
    const delay = random(0, 20);

    const colors = [
      styles.purple,
      styles.blue,
      styles.pink,
      styles.orange,
      styles.cyan,
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        key={i}
        className={`${styles.planet} ${color}`}
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
  const stars = Array.from({ length: STARS_COUNT }).map((_, i) => {
    const size = random(1.5, 3.5);
    const top = random(0, 100);
    const left = random(0, 100);
    const twinkleDuration = random(2, 6);
    const twinkleDelay = random(0, 5);
    return (
      <div
        key={`star-${i}`}
        className={styles.star}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${twinkleDuration}s`,
          animationDelay: `${twinkleDelay}s`,
        }}
      />
    );
  });

  return <div className={styles.spaceBackground}>{stars} {planets}</div>;
}

export default PlanetBackground;
