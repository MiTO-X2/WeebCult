export function GameScoreView(props) {
  return (
    <div className="score-screen">
      <h1 className="app-title">WeebCult</h1>

      <div className="score-box">
        <div className="score-title">
          {props.category} · {props.mode} · {props.type}
        </div>

        {props.mode === "solo" && (
          <div className="score-main">
            {props.score} / {props.total}
          </div>
        )}

        {props.mode === "1v1" && (
          <>
            <div className="score-players">
              <div className="score-player">
                Player 1
                <span>{props.player1}</span>
              </div>
              <div className="score-player">
                Player 2
                <span>{props.player2}</span>
              </div>
            </div>
          </>
        )}

        <div className="score-divider" />

        <button
          className="return-btn"
          onClick={() => window.location.href = "/"}
        >
          Return to Main Page
        </button>
      </div>
    </div>
  );
}
