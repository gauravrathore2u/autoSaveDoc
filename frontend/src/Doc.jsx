import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Doc = () => {
    const [text, setText] = useState('');
    const [isSaved, setIsSaved] = useState(true);

    const handleClear = ()=>{
        setText('');
    }

    useEffect(()=>{
        setIsSaved(false)
        const timeoutId = setTimeout(async()=>{
            const data = {user:'tempUser' ,text:text};
            const sending = await axios.post('http://localhost:8000/save', data);
            console.log(sending);
            setIsSaved(true)
        },500);

        return ()=> clearTimeout(timeoutId);
    },[text]);

    useEffect(()=>{
        async function recievedData(){
            const dataRecieved = await axios.get('http://localhost:8000/getText');
            // console.log(dataRecieved.data.text);
            setText(dataRecieved.data.text);
        }
        recievedData();
    },[]);

  return (
    <div className=' bg-slate-500 h-[100vh] flex flex-col items-center justify-center'>
        <p className='text-2xl'>{isSaved ? 'Saved' : 'Saving....'}</p>
        <textarea name="textArea" onChange={(e)=>setText(e.target.value)} value={text} className='text-lg p-3' id="textArea" cols="100" rows="20"></textarea>
        <button onClick={handleClear} className='bg-slate-400 my-3 w-20'>Clear</button>
    </div>
  )
}

export default Doc