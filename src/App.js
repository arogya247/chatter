import './App.css';
import Header from './Components/Header';
import React from "react";
import axios from "axios";
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';
import { url } from './Constants';

function App() {

  const [text, setText] = React.useState("");

  const handleInputChange = (e) => {
    setText(e.target.value);
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
    </div>
  );
}

export default App;
