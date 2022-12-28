import "./App.scss";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AiFillStar } from "react-icons/ai";
import * as L from "leaflet";

import axios from "axios";
import { format } from "timeago.js";

import Register from "./components/Register.js";

import { useMapEvents } from "react-leaflet/hooks";
import { useMapEvent } from "react-leaflet/hooks";
import Login from "./components/Login";

const App = () => {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [postData, setPostData] = useState({
    title: "",
    desc: "",
    rating: 0,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // const currentUsername = "kunalrathor";

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  // const handkeMarkerClick = (id) => {
  //   setCurrentPlaceId(id);
  // };

  const position = [48.858093, 2.294694];

  //  Create the Icon
  const LeafIcon = L.Icon.extend({
    options: {},
  });
  const RedIcon = new LeafIcon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  });
  const BlueIcon = new LeafIcon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  });

  function MyComponent() {
    const map = useMapEvent("dblclick", (e) => {
      // console.log(e);
      console.log(e.latlng);
      // console.log(e.latlng.lat);
      // console.log(e.latlng.lng);

      const { lat, lng } = e.latlng;

      setNewPlace({ lat: lat, long: lng });
    });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      ...postData,
      username: currentUsername,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    console.log(newPin);
    try {
      const res = await axios.post("http://localhost:5000/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUsername(null);
  };

  return (
    <div className="container">
      <div className="NavBar">
        <h1>NavBar</h1>
        <div className="NavBar_buttons">
          {currentUsername ? (
            <button className="button logout" onClick={handleLogout}>
              Log_Out
            </button>
          ) : (
            <div>
              <button
                className="button login"
                onClick={() => setShowLogin(true)}
              >
                Log_In
              </button>
              <button
                className="button register"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUsername={setCurrentUsername}
        />
      )}

      <div className="map">
        <MapContainer center={position} zoom={4} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentUsername && <MyComponent />}

          {pins.map((p, index) => (
            <div key={index}>
              <Marker
                position={[p.lat, p.long]}
                icon={currentUsername === p.username ? RedIcon : BlueIcon}

                // onclick={() => handkeMarkerClick(p._id)}
              >
                {/* {p._id === currentPlaceId && (   )} */}
                <Popup>
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <div className="star">
                      {Array(p.rating).fill(
                        <AiFillStar className="start" key={p.uniqueId} />
                      )}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by<b> {p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
          {newPlace && (
            <Marker position={[newPlace.lat, newPlace.long]}>
              <Popup>
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                      placeholder="Enter a title"
                      onChange={(e) =>
                        setPostData({
                          ...postData,
                          title: e.target.value,
                        })
                      }
                    ></input>
                    <label>Review</label>
                    <textarea
                      placeholder="Say something about the area"
                      onChange={(e) =>
                        setPostData({
                          ...postData,
                          desc: e.target.value,
                        })
                      }
                    ></textarea>
                    <label>Rating</label>
                    <select
                      onChange={(e) =>
                        setPostData({
                          ...postData,
                          rating: e.target.value,
                        })
                      }
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <button className="submitButton" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
