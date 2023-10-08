import moment from "moment";
import { Button } from "antd";
import { MessageTwoTone } from "@ant-design/icons";
import { url } from "../Constants";
import axios from "axios";


const MessageItem = ({item, fetchData}) => {

	const deleteMessage = (id) => {

		const options = {
      method: "DELETE",
      url: `${url}${id}/`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "E-mnlPDzSuz7UAbo"
      }
    };

		axios(options).then((response) => {
      //console.log("delete", response)
      if (response.status === 204) {
        fetchData();
      }
    });

	}

  return (
    <div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
					<MessageTwoTone />
					<h5>{item.source}</h5>
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