import './login.css';
import { Cancel, LocationOn } from '@material-ui/icons';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const pwdRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: pwdRef.current.value
        }
        try {
            const res = await axios.post('/users/login', user);            
            myStorage.setItem('user', res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setError(true)
        }
    }
    return (
        <div className='loginContainer'>
            <div className='logoLogin'>
                <LocationOn />
                Map Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Username...' ref={nameRef} />
                <input type='password' placeholder='Password...' ref={pwdRef} />
                <button className='loginBtn'>Login</button>
                {
                    error &&
                    <span className='failure'>Something went wrong...</span>
                }
            </form>
            <Cancel className='loginCancel' onClick={() =>setShowLogin(false)} />
        </div>
    );
};

export default Login;
