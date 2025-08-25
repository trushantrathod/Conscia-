import React from 'react';
import { styles } from '../styles';

function ScoreBar({ score }) {
  const getColor = (value) => {
    if (value > 75) return '#00f5d4';
    if (value > 50) return '#fee440';
    return '#f85149';
  };
  const barStyle = { width: `${score}%`, height: '100%', backgroundColor: getColor(score), borderRadius: '10px' };
  return <div style={styles.scoreBarContainer}><div style={barStyle}></div></div>;
}

function EthicalScore({ scores }) {
  if (!scores) return null;
  const scorePillars = [
    { label: '🌱 Environment', value: scores.environment },
    { label: '🤝 Labor', value: scores.labor },
    { label: '🐇 Animal Welfare', value: scores.animal_welfare },
    { label: '🏛️ Governance', value: scores.governance },
  ];
  return (
    <div style={styles.scoresContainer}>
      {scorePillars.map((pillar) => (
        <div key={pillar.label} style={styles.scoreItem}>
          <span style={styles.scoreLabel}>{pillar.label}</span>
          <ScoreBar score={pillar.value} />
          <span style={styles.scoreValue}>{pillar.value}</span>
        </div>
      ))}
    </div>
  );
}

export default EthicalScore;
