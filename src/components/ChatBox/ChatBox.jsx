import React from 'react'
import './chatbox.css'
// import { BiSearchAlt} from 'react-icons/bi'
import {TbSend} from 'react-icons/tb'
import {FaMicrophone, FaRegKeyboard} from 'react-icons/fa'
import {BsChatLeftTextFill, BsPlusLg} from 'react-icons/bs'
import {GiMagicBroom} from 'react-icons/gi'
import fixWebmDuration from "fix-webm-duration";
import { useState, useRef, useEffect } from 'react'
import axios from 'axios';


function ChatBox() {
    const ENTER_KEY_CODE = 13;
    // const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPress, setIsPress] = useState(false)
    const [isInput, setIsInput] = useState(false);
    const [isClick, setIsClick] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const lastMessageRef = useRef(null);

    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    let chunks = [];


    const handleStartRecording = () => {
        setIsPress(true);
        setIsRecording(true);
        chunks = [];
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            recorder.start();
            const startTime = Date.now();
    
            recorder.addEventListener('dataavailable', (event) => {
              chunks.push(event.data);
            });
    
            recorder.addEventListener('stop', () => {
              const duration = Date.now() - startTime;
              const audioBlob = new Blob(chunks, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
    
              fixWebmDuration(audioBlob, duration, (fixedBlob) => {
                const audioUrl = URL.createObjectURL(fixedBlob);
                setAudioURL(audioUrl);
                uploadAudio(fixedBlob);
              });
            });
          });
    }

    const uploadAudio = async (audio) => {
        const fileName = `recording-${Date.now()}.webm`;
        const formData = new FormData();
        formData.append('file', audio, fileName);
        
        try {
          axios.post('http://localhost:8001/api/v1/stt', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log(response.data);
            const parseData = response.data;
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: parseData.question }])
            if(parseData.text !== '') {
                setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: parseData.text }])
              }
              else if(parseData.text === ''){
                setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: 'Không tìm thấy câu trả lời!' }])
              }
            // navigate('/chat', { state:  parseData  });
          })
        } catch (error) {
          console.log(error);
        }
      };

    const handleStopRecording = () => {
        setIsPress(false);
        setIsRecording(false);
        if(mediaRecorder){
            mediaRecorder.stop();
        }
    }

    const handleSubmit = (event) => {
        // event.preventDefault();
        if(inputValue) {
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])

            sendMessage(inputValue);
    
            setInputValue('');
            setIsInput(false);
        }   
    }

    const sendMessage = (message) => {
        const url = 'http://localhost:8002/api/v1/qa';
    
        const data = {
            "context": '',
            "question": message
        };
    
        setIsLoading(true);
    
        axios.post(url, data).then((response) => {
          console.log(response.data);
          if(response.data.text !== '') {
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.text }])
          }
          else if(response.data.text === ''){
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: 'Không tìm thấy câu trả lời!' }])
          }
          
          setIsLoading(false);
        }).catch((error) => {
          setIsLoading(false);
          console.log(error);
        })
      }

    const handleClick = () => {
        setIsClick(!isClick)
        setIsDisabled(!isDisabled)
    }

    const handleInputText = (e) => {
        setInputValue(e.target.value)
        if (e.target.value !== '') {
            setIsInput(true);
          } else {
            setIsInput(false);
          }
    }

    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            handleSubmit();
        }
    }

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView();

    }, [chatLog])

  return (
    <div className='chatbox-wrapper'>
        {/* {audioURL && <audio src={audioURL} controls />} */}
        <div className="display-area">
            <div className="chatbox-container">
                <div className="chatbox-area">
                    <div className="welcome-container">
                        <div className="icon"></div>
                        <h1 className='gradient-text'>Xin chào, tôi là BK Heart</h1>
                        <h2>Hệ thống hỏi và trò chuyện đáng tin cậy của bạn</h2>
                    </div>
                    <div className="chat-content">
                        {
                            chatLog.map((message, index) => (
                                <div key={index} className={`chat ${
                                    message.type === 'user' ? 'user-message' : 'bot-message'} `}>
                                    <div ref={lastMessageRef} className="details">
                                        <p>{message.message}</p>
                            </div>
                        </div>
                            ))
                        }
                    </div>
                </div>
                <div className="chatbox-sample">
                    <h5>Lịch sử chat</h5>
                    {/* <div className="sample-card">
                        <div>
                            <div className="sample-item">
                                <BsPlusLg className='plus-icon'/>
                                <h6 className="sample-title">New Chat</h6>
                            </div>
                        </div>
                    </div> */}
                    <div className="sample-card">
                        <div>
                            <div className="sample-item">
                                <BsChatLeftTextFill className='history-icon'/>
                                <p className="sample-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                    </div>
                    <div className="sample-card">
                        <div>
                            <div className="sample-item">
                                <BsChatLeftTextFill className='history-icon'/>
                                <p className="sample-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                    </div>
                    <div className="sample-card">
                        <div>
                            <div className="sample-item">
                                <BsChatLeftTextFill className='history-icon'/>
                                <p className="sample-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="typing-area">
            <div className={`input-area ${isClick ? 'input-area-small' : ''}  `}>
                <input
                    disabled = {isDisabled}
                    type="text"
                    className={`input-field ${isClick ? 'input-field-small' : ''}  `}
                    placeholder='Nhập câu hỏi...'
                    autoComplete='off'
                    onChange= {handleInputText}
                    onKeyDown={handleEnterKey}
                    value = {inputValue}
                />
                <button
                    className={`keyboard-btn ${isClick ? 'keyboard-btn-show' : ''}  `}
                    onClick={handleClick}>
                    <FaRegKeyboard className='send-btn-icon' />
                </button>
                <button
                    className={`search-btn ${!isInput ? 'btn-hide' : ''}  `}
                    onClick={handleSubmit}>
                    <TbSend className='send-btn-icon' />
                </button>
                {isRecording ? (
                    <button
                        className={`voice-btn-record ${isPress ? 'pulse' : ''} ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-record-big' : ''}   `}
                        onMouseLeave={handleStopRecording}
                        onMouseUp={handleStopRecording}
                    >
                    ...
                    </button>
                ) : (<button
                    className={`voice-btn-record ${isPress ? 'pulse' : ''} ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-record-big' : ''}   `}
                    onTouchStart={handleStartRecording}
                    onMouseDown={handleStartRecording}
                    >
                    <FaMicrophone className='send-btn-icon' />
                    </button>)}
                
                <button
                    className={`voice-btn ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-big' : ''}  `}
                    onClick={handleClick}>
                    <FaMicrophone className='send-btn-icon' />
                </button>
            </div>
            <button className="new-chat-btn">
                <GiMagicBroom />
            </button>
        </div>
    </div>
    
  )
}

export default ChatBox