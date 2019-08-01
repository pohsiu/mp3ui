import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Shuffle from '@material-ui/icons/Shuffle';
import Favorite from '@material-ui/icons/Favorite';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import classNames from 'classnames';
import pg1 from './sample1.png';
import './App.css';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  isFavorite: {
    color: 'red',
  },

}));

const songs = [
  '/music/For_We_Are_Many.mp3',
  '/music/Jazz_Mango.mp3',
  '/music/Song_of_Mirrors.mp3'
];

function App() {
  const classes = useStyles();
  const [songIndex, setSongIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    console.log(audioRef);
    if (audioRef.current) {
      audioRef.current.onplay = () => {
        setIsPlay(true);
      }
      audioRef.current.ontimeupdate = () => {
        const nextTime = audioRef.current.currentTime.toFixed(0) || null;
        if (nextTime) {
          if (nextTime < 60) {
            if (nextTime < 10) {
              setCurrentTime(`0:0${nextTime}`);
            } else {
              setCurrentTime(`0:${nextTime}`);
            }
          } else {
            const min = nextTime / 60;
            const sec = nextTime % 60;
            setCurrentTime(`${min}:${sec}`)
          }
        }
      }
      audioRef.current.onpause = () => {
        setIsPlay(false);
      }
    }
  }, [])
  const clickPrevious = () => {
    const newIndex = (songIndex - 1) % songs.length;
    setSongIndex(newIndex);
  }
  const clickNext = () => {
    const newIndex = (songIndex + 1) % songs.length;
    setSongIndex(newIndex);
  }
  const onClickIsPlay = () => {
    if (isPlay) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlay(!isPlay)
  }
  return (
    <div className="App">
      <div className="Body">
        <div className="coverDiv">
          <img src={pg1} alt="albumcover" />
        </div>
        <div className="playerContainer">
          <div>
            <IconButton aria-label="favorite" className={classNames(classes.margin, { [classes.isFavorite]: isFavorite })} onClick={() => setIsFavorite(!isFavorite)}>
              <Favorite fontSize="small" />
            </IconButton>
            <IconButton aria-label="shuffle" className={classes.margin}>
              <Shuffle fontSize="small" />
            </IconButton>
          </div>
          <div>
            {currentTime}
          </div>
          <audio
            autoPlay
            ref={audioRef}
            muted={isMute}
            src={songs[songIndex]}>
          </audio>
          <div>
            <IconButton aria-label="skip_previous" className={classes.margin} onClick={clickPrevious}>
              <SkipPrevious color="primary" fontSize="small" />
            </IconButton>
            <IconButton aria-label="play" className={classes.margin} onClick={onClickIsPlay}>
              {!isPlay ? <PlayArrow color="primary" fontSize="large" /> : <Pause color="primary" fontSize="large"/>}
            </IconButton>
            <IconButton aria-label="skip_next" className={classes.margin} onClick={clickNext}>
              <SkipNext color="primary" fontSize="small" />
            </IconButton>
            <IconButton aria-label="volume" className={classes.margin} onClick={() => setIsMute(!isMute)}>
              {!isMute ? <VolumeUp color="primary" fontSize="small" /> : <VolumeOff color="primary" fontSize="small" />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
