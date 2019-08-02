import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { Fab } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import './App.css';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  progressBar: {
    cursor: 'pointer',
    width: '100%',
    position: 'relative',
    height: 5,
  },
  progressNow: {
    position: 'absolute',
    display: 'inline-block',
    height: '100%',
    left: 0,
    background: theme.palette.secondary.main,
  },
  font: {
    color: 'white',
  },
  isFavorite: {
    color: 'red',
  },
  coverDiv: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -48,
    width: 320,
    height: 280,
    transform: 'rotate(0deg, 360deg)',
  },
  topTools: {
    position: 'absolute',
    top: 32,
    right: 28,
  },
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    flexGrow: 1,
    paddingTop: 48,
    marginRight: 32,
  },
  playerBar: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tools: {
    marginLeft: '3.5%',
    padding: 24,
  },
  songList: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
}));

const songs = [
  { 
    author: 'Author My Way',
    name: 'For_We_Are_Many',
  },
  { 
    author: 'Author Jazz_Mango',
    name: 'Jazz_Mango',
  },
  { 
    author: 'Author Song_of_Mirrors',
    name: 'Song_of_Mirrors',
  },
];

function App() {
  const classes = useStyles();
  const [songIndex, setSongIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [leftTime, setLeftTime] = useState(0);
  const [completed, setCompleted] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const clickPrevious = () => {
    const newIndex = (songIndex - 1 + songs.length) % songs.length;
    setSongIndex(newIndex);
  }
  const clickNext = useCallback(() => {
    let add = 1;
    if (isRandom) {
      add = Math.floor(Math.random() * Math.floor(songs.length)) + 1;
    }
    const newIndex = (songIndex + add) % songs.length;
    setSongIndex(newIndex);
  }, [songIndex, isRandom])

  const onClickIsPlay = () => {
    if (isPlay) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlay(!isPlay)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => {
        setIsPlay(true);
      }
      audioRef.current.onended = () => {
        clickNext();
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
            const min = (nextTime / 60).toFixed(0);
            const sec = nextTime % 60;
            if (sec < 10) {
              setCurrentTime(`${min}:0${sec}`)
            } else {
              setCurrentTime(`${min}:${sec}`)
            }
          }
        }
        const { duration, currentTime } = audioRef.current;
        const left = (duration - currentTime).toFixed(0);
        if (left > 0) {
          if (left < 60) {
            if (left < 10) {
              setLeftTime(`-0:0${left}`);
            } else {
              setLeftTime(`-0:${left}`);
            }
          } else {
            const min = (left / 60).toFixed(0);
            const sec = left % 60;
            if (sec < 10) {
              setLeftTime(`-${min}:0${sec}`)
            } else {
              setLeftTime(`-${min}:${sec}`)
            }
          }
        } 

        setCompleted((old) => {
          if (old === 100) return 0;
          if (audioRef.current) {
            const { currentTime, duration } = audioRef.current;
            return (currentTime/duration*100).toFixed(2);
          }
        });
      }
      audioRef.current.onpause = () => {
        setIsPlay(false);
      }
    }
  }, [clickNext])
  
  const { name, author } = songs[songIndex];
  return (
    <div className="App">
      <div className="Body">
        <div className={classes.coverDiv}>
          <img style={{ width: '100%', height: '100%' }} src={`/cover/${name}.jpg`} alt="albumcover" />
        </div>
        <div className={classes.songList}>

        </div>
        <div className={classes.playerContainer}>
          <div className={classes.topTools}>
            <IconButton aria-label="favorite" className={classNames(classes.margin, { [classes.isFavorite]: isFavorite })} onClick={() => setIsFavorite(!isFavorite)}>
              <Favorite fontSize="small" />
            </IconButton>
            <IconButton aria-label="shuffle" className={classNames(classes.margin, { [classes.isRandom]: isRandom })} onClick={() => setIsRandom(!isRandom)}>
              <Shuffle fontSize="small" color={isRandom ? "primary" : "inherit"} />
            </IconButton>
          </div>
          <div className={classes.title}>
            <Typography variant="h5" className={classNames(classes.font, classes.margin)}>{name}</Typography>
            <Typography variant="subtitle1"className={classNames(classes.font, classes.margin)} >{author}</Typography>
          </div>
          
          <audio
            autoPlay
            ref={audioRef}
            muted={isMute}
            src={`/music/${name}.mp3`}>
          </audio>
          <div className={classes.playerBar}>
            <Typography variant="subtitle1" color="primary">
              {currentTime}
            </Typography>
            <div className={classes.tools}>
              <IconButton aria-label="skip_previous" className={classes.margin} onClick={clickPrevious}>
                <SkipPrevious color="primary" fontSize="small" />
              </IconButton>
              <Fab aria-label="play" color="secondary" className={classes.margin} onClick={onClickIsPlay}>
                {!isPlay ? <PlayArrow color="primary" fontSize="large" /> : <Pause color="primary" fontSize="large"/>}
              </Fab>
              <IconButton aria-label="skip_next" className={classes.margin} onClick={clickNext}>
                <SkipNext color="primary" fontSize="small" />
              </IconButton>
              <IconButton aria-label="volume" className={classes.margin} onClick={() => setIsMute(!isMute)}>
                {!isMute ? <VolumeUp color="primary" fontSize="small" /> : <VolumeOff color="primary" fontSize="small" />}
              </IconButton>
            </div>
            <Typography variant="subtitle1" color="primary">
              {leftTime}
            </Typography>
          </div>
        </div>
        <div className={classes.root}>
          <div className={classes.progressBar} ref={progressRef} onClick={(event) => {
            const fullWidth = progressRef.current.clientWidth;
            const percent = ((event.clientX - 72)/fullWidth*100).toFixed(2);
            const { duration } = audioRef.current;
            audioRef.current.currentTime = duration * percent / 100;
            setCompleted(percent);
          }}>
            <div className={classes.progressNow} style={{ width: `${completed}%` }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
