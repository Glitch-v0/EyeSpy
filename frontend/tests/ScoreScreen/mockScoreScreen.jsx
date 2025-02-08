import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const mockAPIData = {
  scoreData: {
    userScore: 88493,
    userRank: 1,
    topScores: [
      {
        score: 75000,
        user: {
          initials: "GUD",
        },
      },
      {
        score: 50000,
        user: {
          initials: "LOL",
        },
      },
      {
        score: 25000,
        user: {
          initials: "NUB",
        },
      },
    ],
  },
};

function MockScoreScreen() {
  const [scoreData, setScoreData] = useState({});

  useEffect(() => {
    // Simulate a delay to mimic async behavior
    const timer = setTimeout(() => {
      setScoreData(mockAPIData.scoreData);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {scoreData.userScore ? (
        <table>
          <tr>
            <th>Score</th>
            <th>User</th>
          </tr>
          {scoreData.topScores.map((score) => (
            <tr key={uuidv4()}>
              <td>{score.score}</td>
              <td>{score.user.initials}</td>
            </tr>
          ))}
          <tr key={uuidv4()}>
            <td>{scoreData.userScore}</td>
            <td>{scoreData.userRank}</td>
          </tr>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default MockScoreScreen;
