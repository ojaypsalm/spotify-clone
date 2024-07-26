import { useEffect } from "react";
import { useState, useRef, createContext } from "react";
import axios from 'axios';

const PlayerContext = createContext();


const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const url = 'https://spotify-clone-backend-nm63.onrender.com';

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime]= useState({
        currentTime:{
            seconds:0,
            minutes: 0
        },
        totalTime: {
            seconds: 0,
            minutes: 0
        }
    })
    
    const play = ()=>{
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }

    }

    const pause = ()=>{
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }        
    };

    const playWithId = async (id) => {

        await songsData.map((item)=>{
            if(id == item._id) {
                setTrack(item);
            }
        })
        await audioRef.current.play();
        setPlayStatus(true);
    };

    const previous = async () => {
        songsData.map(async(item, index)=>{
            if(track._id === item._id && index > 0) {
                await setTrack(songsData[index-1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })

    };

    const next = async () => {
        songsData.map(async(item, index)=>{
            if(track._id === item._id && index < songsData.length) {
                await setTrack(songsData[index+1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    };

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    };
    // const getSongsData = async ()=>{
    //     try {
    //         const response = await axios.get(`${url}/api/song/list`);
    //         setSongsData(response.success.data.songs);
    //         setTrack(response.data.songs[0]);
    //     } catch (error) {
            
    //     }
    // };

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            console.log('Songs Data Response:', response.data);
            if (response.data.success) {
                setSongsData(response.data.songs);
                setTrack(response.data.songs[0]); // Ensure this is set correctly
            } else {
                console.error('Error fetching songs data:', response.data.message);
            }
        } catch (error) {
            console.error('Error occurred while fetching songs data:', error);
        }
    };
    
    // const getAlbumsData = async ()=>{
    //     try {
    //         response = await axios.get(`${url}/api/album/list`);
    //         setAlbumsData(response.data.albums)
    //     } catch (error) {
            
    //     }
    // }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            console.log('Albums Data Response:', response.data);
            if (response.data.success) {
                setAlbumsData(response.data.albums);
            } else {
                console.error('Error fetching albums data:', response.data.message);
            }
        } catch (error) {
            console.error('Error occurred while fetching albums data:', error);
        }
    };
    


    useEffect(() => {
        const setAudioEventListeners = () => {
          if (audioRef.current) {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
              setTime({
                currentTime: {
                  seconds: Math.floor(audioRef.current.currentTime % 60),
                  minutes: Math.floor(audioRef.current.currentTime / 60)
                },
                totalTime: {
                  seconds: Math.floor(audioRef.current.duration % 60),
                  minutes: Math.floor(audioRef.current.duration / 60)
                }
              });
            };
          }
        };
    
        setAudioEventListeners();
    }, [audioRef.current]);

    useEffect(()=>{
        getSongsData();
        getAlbumsData();
    },[])


    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, 
        setTrack,
        time, 
        setTime,
        playStatus,
        setPlayStatus,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        songsData,
        albumsData
    };

    return (
        <PlayerContext.Provider value = {contextValue}>
            {props.children}
        </PlayerContext.Provider>

    );
};



export { PlayerContext, PlayerContextProvider };
