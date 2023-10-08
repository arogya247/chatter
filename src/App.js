import './App.css';
import Header from './Components/Header';
import React from "react";
import axios from "axios";
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';
import { url } from './Constants';
import MessageItem from './Components/MessageItem';

function App() {

  const [text, setText] = React.useState("");
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const fetchData = () => {
    
    const options = {
      method: "GET",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "E-mnlPDzSuz7UAbo"
      }
    };

    axios(options).then((response) => {
      //console.log("data", response.data)
      setData(response.data);
    });
  };

  const postMessage = () => {

    const options = {
      method: "POST",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "E-mnlPDzSuz7UAbo"
      },
      data: { text: text }
    };

    axios(options)
    .then((response) => {
      //console.log("res", response)
      if (response.status === 201) {
        setText("");
        fetchData();
      }
    });

  }

  const deleteAll = () => {

  }

  return (
    <div className="App">
      <Header />
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <TextArea
          allowClear
          rows={2}
          value={text}
          onChange={handleInputChange}
          //onBlur={(e) => setText(e.target.value)}
        />
        <Button disabled={text===""} type="primary" onClick={postMessage}>
          Post!
        </Button>
        <Button type="primary" danger onClick={deleteAll}>
          Delete All
        </Button>
      </div>

      <div>
        {data.map((item) => {
          return (
            <MessageItem fetchData={fetchData} item={item} key={item.id} />
          );
        })}
      </div>

    </div>
  );
}

export default App;
