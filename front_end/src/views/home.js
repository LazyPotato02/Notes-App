import {Link} from 'react-router-dom';
import {useAuthStore} from '../store/auth';
import Cookies from 'js-cookie';
import {useEffect, useState} from "react";
import './home.css'


const Home = () => {
    const [fetchedData, setFetchedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    const [isEditing, setIsEditing] = useState(false);

    let userId = Cookies.get('user_id')
    let accessToken = Cookies.get('access_token')
    const apiUrl = `http://localhost:8000/api-notes/notes/${userId}/`; // Replace with your API URL

    useEffect(() => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        // Make the Fetch API request
        fetch(apiUrl, {
            method: 'GET', // HTTP method (GET, POST, etc.)
            headers: headers,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Save the fetched data and update loading state
                setFetchedData(data);
                setLoading(false);
            })
            .catch(error => {
                // Handle errors and update loading state
                setError(error);
                setLoading(false);
            });
    }, [accessToken, apiUrl]); // Empty dependency array to run the effect once on mount

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    function isDone(phase) {
        if (phase === 'true') {
            return '✅'
        } else {
            return '❌'
        }
    }




    return (
        <div>
            {isLoggedIn() ? <LoggedInView user={user()}/> : <LoggedOutView/>}

            <section className={'car__article'}>

                {fetchedData.map((item, index) => (
                    <article key={index} className={`car__item`}>
                        <p>Id: {item.id}</p>
                        <p>Title: {item.title}</p>
                        <p>Text: {item.text}</p>
                        <p>Year: {item.content}</p>
                        <p>Done: {isDone(String(item.is_done))}</p>
                        <button className={'edit__btn'}>Edit</button>
                        <button className={'dibe__btn'}>Done</button>

                    </article>
                ))}
            </section>
        </div>
    );
};

const LoggedInView = ({user}) => {


    return (
        <div>
            <h1>Welcome {user.username}</h1>
            {/*<Link to="/private">*/}
            {/*    <button>Private</button>*/}
            {/*</Link>*/}

            <Link to="/logout">
                <button>Logout</button>
            </Link>
        </div>
    );
};

export const LoggedOutView = ({title = 'Home'}) => {
    return (
        <div>
            <h1>{title}</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
    );
};

export default Home;