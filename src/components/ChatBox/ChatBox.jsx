import React from 'react'
import './chatbox.css'
// import { BiSearchAlt} from 'react-icons/bi'
import {TbSend} from 'react-icons/tb'
import {FaMicrophone, FaRegKeyboard, FaTimes, FaHistory} from 'react-icons/fa'
import {BsChatLeftTextFill} from 'react-icons/bs'
import {GiMagicBroom} from 'react-icons/gi'
import fixWebmDuration from "fix-webm-duration";
import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
// import FeedbackForm from '../FeedbackForm/feedbackForm'
import Modal from '../Modal/Modal'
//import FeedbackForm from '../FeedbackForm/feedbackForm'
import axios from 'axios';


function ChatBox() {
    const ENTER_KEY_CODE = 13;
    const [isClickHistory, setIsClickHistory] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPress, setIsPress] = useState(false)
    const [isInput, setIsInput] = useState(false);
    const [isClick, setIsClick] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVoice, setIsLoadingVoice] = useState(false);
    const [conversation_id, setConversation_id] = useState(null);
    const lastMessageRef = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const buttonRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    let chunks = [];

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView();

    }, [chatLog])

    useEffect(() => {
        // const uuid = crypto.randomUUID();
        setConversation_id(uuidv4());
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // Adjust the breakpoint as needed
          };
      
          handleResize(); // Set the initial screen size
          window.addEventListener('resize', handleResize); // Listen for window resize events
      
          return () => {
            window.removeEventListener('resize', handleResize); // Cleanup the event listener
          };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.keyCode === 32) { // Check if spacebar key was pressed
            event.preventDefault(); // Prevent the default spacebar behavior (scrolling)
            buttonRef.current.click(); // Trigger the button click event
          }
        };
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    
    function boldString(str, substr) {
        var strRegExp = new RegExp(substr, 'g');
        str = str.replace(strRegExp, '<b>'+substr+'</b>');
        return str.replace(/\n/g, "<br />");
    }

    const handleClear = () => {
        setIsRecording(false);
        setIsPress(false);
        setIsInput(false);
        setIsClick(false);
        setIsDisabled(false);
        setInputValue('');
        // setChatLog([]);
        setIsLoading(false);
        setIsLoadingVoice(false);
        setChatLog(([{ type: 'bot', message: 'Bạn muốn hỏi câu gì tiếp theo?', context: '' }]));
        setConversation_id(uuidv4());

    }

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
            //   const audioUrl = URL.createObjectURL(audioBlob);
    
              fixWebmDuration(audioBlob, duration, (fixedBlob) => {
                // const audioUrl = URL.createObjectURL(fixedBlob);
                // setAudioURL(audioUrl);
                uploadAudio(fixedBlob);
              });
            });
          });
    }

    const uploadAudio = async (audio) => {
        setIsLoadingVoice(true);
        const fileName = `recording-${Date.now()}.webm`;
        const formData = new FormData();
        formData.append('conversation_id', conversation_id);
        formData.append('file', audio, fileName);

        console.log(formData);
        
    
        axios.post('/speech', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        }).then(response => {
            // console.log(response.data);
            const parseData = response.data;
            // console.log(parseData.context);
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: parseData.utterance }])

            const contextList = parseData.context.map((item) => boldString(item, parseData.policy_response));

            if(response.data.end_position === -1 ) {
                setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: parseData.response, context: contextList, isContext:false, messagePolicy: parseData.policy_response}])
            }
            else {
                setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: parseData.response, context: contextList, isContext:true, messagePolicy: parseData.policy_response}])
            }

            setIsLoadingVoice(false);
        }).catch((error) => {
            setIsLoadingVoice(false);
            console.log(error);
          })
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
        const url = '/text';
    
        const data = {
            "context": '',
            "utterance": message,
            "conversation_id": conversation_id
        };

        // console.log(data)
    
        setIsLoading(true);
    
        axios.post(url, data).then((response) => {
        //   console.log(response.data);
        //   console.log(response.data.context);
        const contextList = response.data.context.map((item) => boldString(item, response.data.policy_response));

          if(response.data.end_position === -1 ) {
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.response, context: contextList, isContext: false, messagePolicy: response.data.policy_response  }])
          }
          else {
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.response, context: contextList, isContext: true, messagePolicy: response.data.policy_response }])
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

    const handleHistoryBtn = () => {
        setIsClickHistory(!isClickHistory)
    }
    // const testLst = [
    //     "QUY ĐỊNH CHUNG VỀ HỌC VỤ VÀ ĐÀO TẠO\nPHỤ LỤC 5\nQUY ĐỊNH VỀ HOÀN TRẢ HỌC PHÍ\n\n3. Thời điểm hoàn trả học phí\n\nNhà trường thực hiện việc hoàn trả học phí vào các tuần trước tuần giữa học kỳ và tuần sau tuần cuối học kỳ, ngoại trừ các trường hợp khẩn cấp.\n",
    //     "QUY ĐỊNH CHUNG VỀ HỌC VỤ VÀ ĐÀO TẠO\nPHỤ LỤC 5\nQUY ĐỊNH VỀ HOÀN TRẢ HỌC PHÍ\n\n2. Các trường hợp được hoàn trả học phí\n\n2.1. Trúng tuyển và nhập học\nNgười học không nhập học hoặc đã bảo lưu kết quả trúng tuyển, được hoàn trả học phí. Thời điểm tối đa để làm thủ tục hoàn trả học phí là cuối học kỳ nhập học.\nNgười học rút nhập học hoặc bị huỷ kết quả trúng tuyển hoặc huỷ nhập học hoặc không công nhận người học được hoàn trả học phí nếu thời điểm làm thủ tục hoàn trả dưới 04 tuần tính từ ngày bắt đầu học của đợt tuyển sinh.\n2.2. Thôi học, tạm dừng\nNgười học thuộc các trường hợp sau được hoàn trả học phí nếu thời điểm làm thủ tục hoàn trả dưới 04 tuần tính từ ngày đầu học kỳ:\n- Thôi học theo yêu cầu cá nhân từ học kỳ tính học phí;\n- Bị buộc thôi học hoặc xoá tên, nhưng không phải là bị kỷ luật, từ học kỳ tính học phí;\n- Tạm dừng học hoặc bị tạm dừng học từ học kỳ tính học phí, ngoại trừ học kỳ bị tạm dừng vì không thanh toán học phí.\n2.3. Tính lại học phí\nNgười học huỷ đăng ký một số học phần đã đăng ký và làm giảm học phí cần thanh toán, nhà trường sẽ hoàn trả phần dư nếu thời gian huỷ đăng ký trong 02 tuần đầu học kỳ hoặc tối đa trong 06 tuần đầu học kỳ nếu có lý do chính đáng.\nTrường hợp người học đã nộp tạm ứng nhiều hơn học phí cần thanh toán, nhà trường sẽ hoàn lại phần dư. Thời hạn tối đa làm thủ tục hoàn phần dư học phí là 01 học kỳ tính từ học kỳ đã tạm ứng dư. Trường hợp đặc biệt sẽ do Hiệu trưởng quyết định.\n",
    //     "QUY ĐỊNH CHUNG VỀ HỌC VỤ VÀ ĐÀO TẠO\nCHƯƠNG 6\nHỌC PHÍ\n\nĐiều 23. Học phí\n\n2. Thanh toán học phí\nNgười học phải thanh toán học phí đủ và đúng hạn để hoàn tất đăng ký học phần và có lịch học. Nhà trường có thể yêu cầu người học tạm nộp trước toàn bộ hoặc một phần học phí để đảm bảo việc tổ chức lớp học đạt hiệu quả tốt.\n3. Miễn, giảm, hoãn học phí\nNgười học diện được xét miễn, giảm học phí theo chính sách thực hiện theo quy trình của nhà trường.\nCác trường hợp gặp khó khăn đột xuất, người học có thể xin hoãn nộp học phí hoặc các hỗ trợ tài chính khác. Chỉ xét hoãn, miễn hay giảm học phí và các hỗ trợ tài chính khác cho người học đại học chính quy bằng thứ nhất tại các học kỳ chính, không xét cho các học kỳ phụ và các lớp dự thính.\n4. Hoàn trả học phí\nNgười học được xem xét hoàn trả học phí trong trường hợp thanh toán học phí dư, phần dư của học phí tạm ứng sau khi khấu trừ học phí và một số trường hợp đặc biệt khác. Phần dư của học phí tạm ứng có thể được dùng để cấn trừ vào học phí của học kỳ kế tiếp."
    // ]
    // const processLst = testLst.map((item) => boldString(item, "Nhà trường thực hiện việc hoàn trả học phí vào các tuần trước tuần giữa học kỳ"))

  return (
    <div className='chatbox-wrapper'>
        {/* <FeedbackForm /> */}
        {/* <Modal contents={processLst}/> */}
        {/* {conversation_id && (
        <p>Session ID: {conversation_id}</p>
      )} */}
        {/* {audioURL && <audio src={audioURL} controls />} */}
        <div className="display-area">
            <div onClick={handleHistoryBtn} className={isClickHistory? "history-btn" : "history-btn history-btn-active"}>
                <FaHistory />
            </div>
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
                                message.type === 'user' ? 
                                (<div key={index} className={`chat user-message `}>
                                    <div ref={lastMessageRef} className="details">
                                        <p>{message.message}</p>
                                    </div>
                                </div>):
                                (!message.isContext  ? (
                                    <div key={index} className={`chat bot-message `}>
                                    <div ref={lastMessageRef} className="details">
                                        <div className='bot-message-content'>{message.message}</div>
                                        {/* <div className='footer'>
                                            <Modal content={message.context}/>
                                        </div> */}
                                    </div>
                                </div>    
                                ):(
                                <div key={index} className={`chat bot-message `}>
                                    <div ref={lastMessageRef} className="details">
                                        <div className='bot-message-content'>{message.message}</div>
                                        <div className='bot-message-policy'>{message.messagePolicy}</div>
                                        <div className='footer'>
                                            <Modal contents={message.context}/>
                                        </div>
                                        
                                    </div>
                                </div>)
                                )
                            ))
                        }
                        {
                            isLoading &&
                            <div key={chatLog.length} className={`chat bot-message `}>
                                    <div ref={lastMessageRef} className="details">
                                        <div className="loading-animation">
                                            <div className="loading-dot"></div>
                                            <div className="loading-dot"></div>
                                            <div className="loading-dot"></div>
                                        </div>

                                    </div>
                                </div>
                        }
                    </div>
                </div>
                <div className={ !isClickHistory? 'chatbox-sample': 'chatbox-sample chat-box-sample-active'}>
                    {
                        isClickHistory? (<span className="close" onClick={handleHistoryBtn}>
                        &times;
                        </span>):null
                    }
                    
                    <h1 className='sample-title'>Lịch sử chat</h1>
                    {/* <div className="sample-card">
                        <div>
                            <div className="sample-item">
                                <BsPlusLg className='plus-icon'/>
                                <h6 className="sample-title">New Chat</h6>
                            </div>
                        </div>
                    </div> */}
                    {
                            chatLog.map((message, index) => (
                                message.type === 'user' ?
                                (<div key={index} className="sample-card">
                    
                                    <div className="sample-item">
                                        <BsChatLeftTextFill className='history-icon'/>
                                        <p className="sample-description">{message.message}</p>
                                    </div>
                    
                            </div>):
                                null
                            ))
                        }
                </div>
            </div>
        </div>
        <div className="typing-area">
            <div className='typing-container'>
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
                        <button ref={buttonRef}
                            className={`voice-btn-record ${isPress ? 'pulse' : ''} ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-record-big' : ''}   `}
                            // onMouseLeave={handleStopRecording}
                            // onMouseUp={handleStopRecording}
                            // onClick={isSmallScreen? handleStopRecording : null}
                            onClick= {handleStopRecording}
                            onMouseUp={isSmallScreen? null : handleStopRecording}
                            onMouseLeave={isSmallScreen? null : handleStopRecording}
                        >
                            <FaTimes />
                        </button>
                    ) : (<button ref={buttonRef}
                        className={`voice-btn-record ${isPress ? 'pulse' : ''} ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-record-big' : ''}   `}
                        // onClick={isSmallScreen? handleStartRecording : null}
                        onClick= {handleStartRecording}
                        onMouseDown={isSmallScreen? null : handleStartRecording}
                        >
                            {
                                isLoadingVoice && isClick  ?
                                (<div className='spinner'>
                                    <div className="bubble-1"></div>
                                    <div className="bubble-2"></div>
                                </div>) :
                                (<FaMicrophone className='send-btn-icon' />)
                                
                            }
                            
                        </button>)}
                    
                    <button
                        className={`voice-btn ${isInput ? 'btn-hide' : ''} ${isClick ? 'voice-btn-big' : ''}  `}
                        onClick={handleClick}>
                        <FaMicrophone className='send-btn-icon' />
                    </button>
                </div>
                <button className="new-chat-btn" onClick={handleClear}>
                    <GiMagicBroom />
                </button>
            </div>

        </div>
    </div>
    
  )
}

export default ChatBox