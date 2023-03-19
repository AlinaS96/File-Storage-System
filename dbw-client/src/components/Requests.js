import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import UploadedFileCard from './UploadedFileCard'

const Requests = () => {

    const user = useSelector((state) => state.userReducer);
  const [myRequests, setMyRequests] = useState([]);

  const getMyRequests = async () => {
    if(user.isLoggedIn) {
      await axios.post("http://localhost:8080/myrequests", {
      user_id:user.id,
    }).then((res) => setMyRequests(res.data.rows))
    }
    
  }

  useEffect(() => {
    getMyRequests();
  }, [])

  return (
    <>
    <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-3 overflow-scroll scrollbar-hide">
                {myRequests && myRequests.map((myFile, key) => (
                  <div key={key}>
        
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

export default Requests