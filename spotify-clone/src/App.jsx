import React, { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContextProvider, PlayerContext } from "./contexts/PlayerContext";
const App = () => {

  const { audioRef, track, songsData } = useContext(PlayerContext);

  useEffect(() => {
    console.log('Context Data:', { audioRef, track, songsData });
  }, [audioRef, track, songsData]);

  return (
    <PlayerContextProvider>
      <div className="h-screen bg-black">
        {songsData.length !== 0 ? (
          <>
            <div className="h-[90%] flex">
              <Sidebar />
              <Display />
            </div>
            <Player />
          </>
        ) : (
          <p>No songs Data Available</p>
        )
        }

        {track ? <audio ref={audioRef} src={track.file} preload="auto"></audio> : null}
      </div>
    </PlayerContextProvider>
  );
};

export default App;
