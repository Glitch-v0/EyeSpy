import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ScoreScreen() {
  const [scoreData, setScoreData] = useState({});
  const [dateSent, setDateSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // FETCH player score and other players' scores from backend
    fetch(`${import.meta.env.VITE_API_URL}/scores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch score data");
        }
        return response.json();
      })
      .then((data) => {
        setScoreData(data);
        console.log({ data });
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, []);

  const sendInitials = (initials) => {
    console.log({ initials });
    fetch(`${import.meta.env.VITE_API_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ initials }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send initials");
        }
        return response.json();
      })
      .then((data) => {
        console.log({ data });
        setDateSent(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const restartGame = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      {scoreData.userScore ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Score</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {scoreData.topScores.map((topScore) => (
                <tr key={uuidv4()}>
                  <td className="score">{topScore.score}</td>
                  <td>{topScore.user.initials}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id="finishTextContainer">
            <p className="finishText">
              Congratulations! You are rank {scoreData.userRank}
            </p>
            <p className="finishText">
              Your score: {scoreData.userScore.score}
            </p>
            {dateSent ? (
              <p className="finishText" id="restart">
                Initials saved.
                <button onClick={restartGame}>Play Again</button>
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendInitials(e.target.initials.value);
                }}
              >
                <input
                  type="text"
                  name="initials"
                  placeholder="Enter 3 initials"
                  minLength={3}
                  maxLength={3}
                />
                <input type="submit" value="Submit" />
              </form>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
