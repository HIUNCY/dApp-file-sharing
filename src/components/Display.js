import { useState } from "react";
import "./Display.css";
const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      const documents = str_array.map((item, i) => {
        return (
            <div
                key={i}
                style={{
                width: "300px",
                margin: "20px",
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                onClick={() => window.open(item, '_blank')}
            >
                <iframe
                    src={item}
                    style={{ width: "100%", height: "400px", pointerEvents: "none", border: "none" }}
                    title={`pdf-${i}`}
                ></iframe>
            </div>
        );
      });
      setData(documents);
    } else {
      alert("No document to display");
    }
  };
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};
export default Display;
