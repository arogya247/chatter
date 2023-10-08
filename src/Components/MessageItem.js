import moment from "moment";
import { Button } from "antd";
import { url, authorization_token } from "../Constants";
import axios from "axios";
import { Checkbox } from 'antd';
import './MessageItem.css'


const MessageItem = ({item, fetchData, handleMessageSelection}) => {

	const deleteMessage = (id) => {

		const options = {
      method: "DELETE",
      url: `${url}${id}/`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: authorization_token
      }
    };

		axios(options).then((response) => {
      //console.log("delete", response)
      if (response.status === 204) {
        fetchData();
      }
    });

	}

	const onCheckboxChange = (e) => {
		handleMessageSelection(item.id, e.target.checked)
	}

  return (
    <div className="message-item">
        <div className="title-row">
					<Checkbox onChange={onCheckboxChange} />
					{/* <MessageTwoTone /> */}
					<h5> ~ {item.source}</h5>
					<p> - {moment(item.timestamp).format("MMMM D, YYYY [at] h:mm:ss A")}</p>
					<Button
						onClick={() => deleteMessage(item.id)}
						type="link"
						size="small"
						danger
					>
						Delete
					</Button>
				</div>
				<div className="message-description">
					<p>{item.text}</p>
				</div>
    </div>
  )
}

export default MessageItem