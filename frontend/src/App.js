import { useEffect, useState } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import { LocationOn } from '@material-ui/icons';
import '../src/app.css';
import axios from 'axios';
import Register from './components/register/Register';
import Login from './components/login/Login';

function App() {
    const myStorage = window.localStorage;
    const [pins, setPins] = useState([]);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);

    const [viewport, setViewport] = useState({
        latitude: 22.8937,
        longitude: 78.9629,
        zoom: 3,
        bearing: 0,
        pitch: 0
    });

    const getPins = async () => {
        try {
            const allPins = await axios.get("/pins");
            // console.log(allPins.data);
            setPins(allPins.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long })
    }

    const handleAddClick = (e) => {
        const [long, lat] = e.lngLat;
        setNewPlace({
            lat,
            long,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            lat: newPlace.lat,
            long: newPlace.long,
        }
        try {
            const res = await axios.post('/pins', newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = () => {
        myStorage.removeItem('user');
        setCurrentUser(null);
    }

    useEffect(() => {
        getPins();
    }, [])

    return (
        <MapGL
            {...viewport}
            width="100vw"
            height="100vh"
            mapStyle="mapbox://styles/ijpkaushik/ckylvq7td1p9x14nvitpum34l"
            onViewportChange={setViewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
            onDblClick={currentUser && handleAddClick}
            transitionDuration="300"
        >
            {pins.map((pin) => (
                <div key={pin._id}>
                    <Marker
                        latitude={pin.lat}
                        longitude={pin.long}
                        offsetLeft={-viewport.zoom * 3.5}
                        offsetTop={-viewport.zoom * 7}>
                        <LocationOn
                            style={{
                                fontSize: viewport.zoom * 7,
                                color: currentUser === pin.username ? 'teal' : 'tomato',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                        />
                    </Marker>
                    {
                        pin._id === currentPlaceId &&
                        (
                            <Popup
                                latitude={pin.lat}
                                longitude={pin.long}
                                closeButton={true}
                                closeOnClick={false}
                                anchor="left"
                                onClose={() => setCurrentPlaceId(null)}>

                                <div className="card">
                                    <label>Place</label>
                                    <h4 className="place">{pin.title}</h4>
                                    <label>Review</label>
                                    <p className="desc">{pin.desc}</p>
                                    <label>Information</label>
                                    <span className="username">
                                        Created by <b>{pin.username}</b>
                                    </span>
                                    <span className="date">{new Date(pin.createdAt).toDateString()}</span>
                                </div>
                            </Popup>
                        )
                    }
                </div>
            ))}
            {newPlace &&
                (
                    <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={() => setNewPlace(null)}>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>Title</label>
                                <input
                                    placeholder='Enter a Title...'
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label>Review</label>
                                <textarea
                                    rows="4"
                                    placeholder='Say something about the place...'
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                                <button className='submitButton' type='submit'>Add Pin</button>
                            </form>
                        </div>
                    </Popup>
                )
            }
            {
                currentUser
                    ? (
                        <button className='button logout' onClick={handleLogout}>Logout</button>
                    ) : (
                        <div className='buttons'>
                            <button
                                className='button login'
                                onClick={() => {
                                    setShowLogin(true)
                                    setShowRegister(false)
                                }}
                            >
                                Login
                            </button>
                            <button
                                className='button register'
                                onClick={() => {
                                    setShowRegister(true)
                                    setShowLogin(false)
                                }}
                            >
                                Register
                            </button>
                        </div>
                    )
            }

            {
                showLogin &&
                <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />
            }
            {
                showRegister &&
                <Register setShowRegister={setShowRegister} />
            }
        </MapGL>
    );
}

export default App;