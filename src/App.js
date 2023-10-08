import './App.css';
import Header from './Components/Header';
import React from "react";
import axios from "axios";
import TextArea from 'antd/es/input/TextArea';
import { Button, Modal, Input, Empty } from 'antd';
import { url, authorization_token } from './Constants';
import MessageItem from './Components/MessageItem';
import { ArrowUpOutlined, ArrowDownOutlined, ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

function App() {

  const [text, setText] = React.useState("");
  const [data, setData] = React.useState([]);
  const [sortedData, setSortedData] = React.useState([]);
  const [sorterType, setSorterType] = React.useState("desc");
  const [selectedMessageIds, setSelectedMessageIds] = React.useState([]);
  const [openWarningModal, setOpenWarningModal] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  // handle data sorting whenever new message is added 
  // or sorting button is clicked thereby changing type of sorter
  React.useEffect(() => {

    const newData = JSON.parse(JSON.stringify(data)).sort(sortByTimestamp)
    setSortedData(newData)

  }, [data, sorterType]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  // function to make the api call to list all messages
  const fetchData = () => {
    
    const options = {
      method: "GET",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: authorization_token
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
        Authorization: authorization_token
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

  // function to delete all messages
  const deleteAll = async () => {
    const idsToDelete = data.map((item) => item.id);

    for (const id of idsToDelete) {
      const options = {
        method: "DELETE",
        url: `${url}${id}/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: authorization_token
        }
      };

      try {
        const response = await axios(options);
        // Handle the response if needed
        //console.log(`Deleted message with id ${id}:`, response.data);
      } catch (error) {
        // Handle errors if the DELETE request fails
        //console.error(`Error deleting message with id ${id}:`, error.message);
      }
    }

    fetchData();
    setSelectedMessageIds([]);
  };

  // Sorting function
  const sortByTimestamp = (a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);

    if(sorterType === "asc"){
      return dateA - dateB;
    }
    else{
      return dateB - dateA;
    }
    
  };

  const handleSortByTimestamp = () => {
    if(sorterType === "asc"){
      setSorterType("desc")
    }
    else{
      setSorterType("asc")
    }
  }

  // keeps track of selected message ids based on checkbox selection
  const handleMessageSelection = (id, checked) => {
    let arr = selectedMessageIds;
    if(checked == true){
      arr.push(id);
    }
    else if(checked == false){
      arr = arr.filter(item => item !== id)
    }
    
    setSelectedMessageIds(arr);
  }

  const deleteSelectedMessages = async () => {
    const idsToDelete = selectedMessageIds;

    for (const id of idsToDelete) {
      const options = {
        method: "DELETE",
        url: `${url}${id}/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: authorization_token
        }
      };

      try {
        const response = await axios(options);
        // Handle the response if needed
        //console.log(`Deleted message with id ${id}:`, response.data);
      } catch (error) {
        // Handle errors if the DELETE request fails
        //console.error(`Error deleting message with id ${id}:`, error.message);
      }
    }

    fetchData();
    setSelectedMessageIds([]);
  }

  const handleDeleteSelectedMessages = () => {
    confirm({
      title: 'Are you sure you want to delete the selected messages ?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteSelectedMessages()
        setOpenWarningModal(false);
      },
      onCancel() {
        setOpenWarningModal(false);
      },
    });
  };

  return (
    <div className="App">
      <Header />
      <div className='text_area'>
        <Input
          allowClear
          rows={2}
          value={text}
          onChange={handleInputChange}
          onPressEnter={postMessage}
          //onBlur={(e) => setText(e.target.value)}
        />
        <Button disabled={text===""} type="primary" onClick={postMessage}>
          Post!
        </Button>
        <Button type="primary" danger onClick={deleteAll}>
          Delete All
        </Button>
      </div>

      <div className='upper-buttons'>
        <Button type="primary" onClick={handleSortByTimestamp}>
          Sort by Time 
          {sorterType==="asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </Button>
        <Button 
          onClick={handleDeleteSelectedMessages} 
          danger
        >
          Delete Selected
        </Button>
      </div>
      
      <div>
        {sortedData.length > 0
        ?
        sortedData.map((item) => {
          return (
            <MessageItem 
              handleMessageSelection={handleMessageSelection} 
              fetchData={fetchData} 
              item={item} 
              key={item.id} 
            />
          );
        })
        :
        <Empty 
          description={"No messages"}
        /> 
        }
      </div>

    </div>
  );
}

export default App;
