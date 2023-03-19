import React from 'react'
import {Dropdown, Menu} from "antd";
import FileIcon from "../Assets/FileIcon.svg";
import VertDotsIcon from "../Assets/VertDots.svg";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';



//This is Upload File card component which is rendeding out a single visible filecard on the screen.
const UploadedFileCard = (props) => {
    const location = useLocation();
    const user = useSelector((state) => state.userReducer);

    const downloadFile = async () => {
        if(user.id == props.ownerId || props.blockedStatus == 'FALSE'){
            await axios({
                url: `http://localhost:8080/load?file=${props.fileHash}`, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', props.fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
        }else{
            alert("The File is blocked by its owner")
        }
       
    }

    const blockFile = async () => {
        if(user.id == props.ownerId){
            await axios.post("http://localhost:8080/wtcblockfile", {
            filehash:props.fileHash,
        }).then((res) => {console.log(res.data.statusCode); alert("File Blocked")}).catch((err) => console.log(err));
        }else{
            alert("Owner of the file is someone else, you cannot block it.")
        }

        

    }

    const UnBlock = async () => {
        if(user.id==props.ownerId){
            await axios.post("http://localhost:8080/wtcremove", {
                userid:user.id,
                filename:props.fileName,
                filehash:props.fileHash,
                ownerid:props.ownerId,
                ownername:props.ownerName,
            }).then((res) =>{ console.log(res.data.statusCode); alert("File unblocked")}).catch((err) => console.log(err));
        }
        else if(props.blockedStatus=='FALSE'){
            alert("File is already unBlocked");
        }
        else{
           alert("You are not the Owner of this file")
        }
    }

    const FileMenu = (
        <Menu>
            <Menu.Item key={1} onClick={downloadFile}>
            Download
             </Menu.Item>           
            <Menu.Item key={2} onClick={blockFile}>
            Block File
           </Menu.Item>
            <Menu.Item key={3} onClick={UnBlock}>
              Unblock
            </Menu.Item>
        </Menu> 
    )
  return (
    <div className="flex flex-row items-center justify-around p-3">
            <img src={FileIcon} alt=""/>
            <div className="flex flex-col grow ml-4 justify-center">
                <h1>{props.fileName}</h1>
               {location.pathname!=='/myfiles' && <h3 className="w-[185px] h-[16px] font-normal text-[12px] leading-[12px]" >Uploaded by : {props.ownerName===user.username ? 'You' : props.ownerName}</h3>}
                <h3 className="w-[185px] h-[16px] font-normal text-[12px] leading-[12px]" >{props.fileSize} KB <span className="
                text-[16px] font-bold
                ">.</span> <br></br> {props.uploadTime}</h3>
            </div>
            <div>
            <Dropdown overlay={FileMenu} trigger={['click']} position="bottomRight">
            <img className="cursor-pointer" src={VertDotsIcon} alt=""/>
            </Dropdown>
            </div>
        </div>
  )
}

export default UploadedFileCard;