import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import UploadedFileCard from './UploadedFileCard'


//This Component will show you the list of file that you(logged in user) will upload
const MyFiles = () => {
  const user = useSelector((state) => state.userReducer);
  const [myFiles, setMyFiles] = useState([]);

  const getMyFiles = async () => {
    if(user.isLoggedIn) {
      await axios.post("http://localhost:8080/myfiles", {
      user_id:user.id,
    }).then((res) => setMyFiles(res.data.rows))
    }
    
  }

  useEffect(() => {
    getMyFiles();
  }, [])
  return (
    <>
          <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-3 overflow-scroll scrollbar-hide">
                {myFiles && myFiles.map((myFile, key) => (
                  <div key={key}>
                    <UploadedFileCard fileName={myFile.file_name} fileSize={Math.round(myFile.file_size)} uploadTime={myFile.upload_time} ownerId={myFile.owner_id} fileHash={myFile.file_hash} blockedStatus={myFile.blocked_status}/>
                  </div>
                ))}
              </div>
            </div>
            {/* /End replace */}   
          </div>
        </main>
        </>
  )
}

export default MyFiles