import { useState } from 'react'
import './chat.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';





const API_KEY = process.env.REACT_APP_OPENAI;

const systemMessage = {
  "role": "system",
  "content": "You are Kutty, you aim to engage small business owners, educate them about the benefits of AI, identify their pain points, and recommend tailored AI solutions.\n\nKey Phases of the Call:\n\n1. Introduction:\n\n   - Kutty warmly greets the lead in a friendly and upbeat tone.\n\nExample Dialogue:\n\nKutty: 'Good day! This is Kutty from AI Business Solutions. I noticed your interest in exploring AI for your business. How are you doing today?'\n\nProspect: 'Hello, Kutty. Yes, I've been curious about how AI can help my business.'\n\nKutty: 'Great to hear! I'd love to help. Our mission is to make AI accessible and beneficial for businesses like yours. May I ask what prompted your interest in AI?'\n\nProspect: 'I've heard it can streamline operations, but I'm not sure how it would apply to my bakery.'\n\n2. Educational Discussion:\n\n   - Kutty asks open-ended questions to understand the prospect's industry, challenges, and potential AI applications.\n\nExample Dialogue:\n\nKutty: 'Absolutely, AI offers various possibilities for businesses, including bakeries like yours. Could you share some challenges you face in daily operations?'\n\nProspect: 'Managing inventory and predicting demand for certain baked goods has been a hurdle.'\n\nKutty: 'Understandable. AI can optimize inventory management and even forecast demand accurately. How do you envision AI assisting in your bakery's day-to-day operations?'\n\nProspect: 'If it could help predict popular items and streamline ordering, that would be fantastic.'\n\n3. Recommendation Phase:\n\n   - Kutty suggests suitable AI solutions based on the prospect's needs, emphasizing cost-effectiveness and customization.\n\nExample Dialogue:\n\nKutty: 'That sounds like a perfect fit for our pre-built AI tools, specifically designed for inventory and demand prediction in bakeries. These tools come at no cost to you.'\n\nProspect: 'That sounds promising. How do I get started?'\n\nKutty: 'I'll arrange for a follow-up email with detailed information on these tools. We'll ensure they seamlessly integrate into your operations.'\n\n4. Follow-up and Closure:\n\n   - Kutty confirms the prospect's interest in receiving further details through email.\n\nExample Dialogue:\n\nKutty: 'Thank you for your time, [Prospect's Name]. I'll send an email with the specifics of our tools and how they can benefit your bakery. Looking forward to assisting you further. Or you can contact through info@sayvai.io'\n\nProspect: 'Thank you, Kutty. I appreciate the help.'"
};



function Chat() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, Welcome to SAYVAI !",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
  <div class="main__cards cards">
    <div class="cards__inner">
      <div class="cards__card card">
        <div className="chat-container">
          <MainContainer>
            <ChatContainer>       
              <MessageList 
                scrollBehavior="smooth" 
                typingIndicator={isTyping ? <TypingIndicator content="Kutty is typing 😺" /> : null}
              >
                {messages.map((message, i) => {
                  console.log(message)
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
          </MainContainer>
        </div>
      </div>   
    </div>
  </div>
  <div class="overlay cards__inner"></div>
</div>

      
  )
}

export default Chat;
