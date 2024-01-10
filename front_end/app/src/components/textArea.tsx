import React, { useState, useRef, useEffect} from 'react';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';

interface MessageProps {
	msg: string;
	name: string;
}

const Message: React.FC<MessageProps> = ({msg, name}) => {
	return (	
		<div className="message">
			<Avatar alt={name} src={require('../asset/default.jpg')}/>
			<div className="message-content">
				<div className='name'>{name}</div>
				<div className='msg'>{msg}</div>
			</div>
		</div>
	)
}

const TextArea: React.FC = () => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
	if (messagesEndRef.current)
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
	if (event.key === 'Enter') {
		const element = document.getElementById("test");
		if (element)
			element.scrollTop = element.scrollHeight;
		setMessages([...messages,{ msg:inputValue, name: 'me' }]);
		setInputValue('');
	}
  };
	return (
		<div className="textArea" id="test">
			<div className='messages-container' >
				{messages.map((message, index) => (
					<Message key={index} msg={message.msg} name={message.name} />
				))}
			</div>
			<div className="prompt">
				<Input 
					placeholder='Message "Friend name"' 
					style={{width:'100%'}} 
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>
	);
};

export default TextArea;