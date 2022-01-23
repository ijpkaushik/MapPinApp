import './register.css';
import { Cancel, LocationOn } from '@material-ui/icons';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';

const Register = ({ setShowRegister }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const pwdRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: pwdRef.current.value
        }
        try {
            axios.post('/users/register', newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true)
        }
    }
    return (
        <div className='registerContainer'>
            <div className='logoRegister'>
                <LocationOn />
                Map Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Username...' ref={nameRef} />
                <input type='email' placeholder='Email...' ref={emailRef} />
                <input type='password' placeholder='Password...' ref={pwdRef} />
                <button className='registerBtn'>Register</button>
                {
                    success &&
                    <span className='success'>Registed Successfully, You can Login now</span>
                }
                {
                    error &&
                    <span className='failure'>Something went wrong...</span>
                }
            </form>
            <Cancel className='registerCancel' onClick={() =>setShowRegister(false)} />
        </div>
    );
};

export default Register;
