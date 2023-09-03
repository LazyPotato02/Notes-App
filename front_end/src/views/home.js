import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAuthStore} from "../store/auth";
import Cookies from "js-cookie";
import './home.css';

const Home = () => {
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    const [editingIndex, setEditingIndex] = useState(-1);
    const [editedItem, setEditedItem] = useState({title: "", content: "", is_done: false});

    let userId = Cookies.get('user_id')
    let accessToken = Cookies.get('access_token')
    const apiUrl = `http://localhost:8000/api-notes/notes/${userId}/`;

    useEffect(() => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setFetchedData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [accessToken, apiUrl]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    function isDone(phase) {
        return phase === 'true' ? '✅' : '❌';
    }

    const handleEditClick = (index) => {
        setEditingIndex(index);
        // Initialize the edited item with the current item
        setEditedItem(fetchedData[index]);
    };

    const handleSaveClick = async (index) => {
        // Send the updated item to the backend
        const updatedItem = editedItem;

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(`${apiUrl}${fetchedData[index].creator_id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            // Update the local state with the edited item
            const updatedData = [...fetchedData];
            updatedData[index] = updatedItem;
            setFetchedData(updatedData);

            // Clear edit state
            setEditingIndex(-1);
            setEditedItem({title: "", content: "", is_done: false});
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    const handleCancelClick = () => {
        // Clear edit state
        setEditingIndex(-1);
        setEditedItem({title: "", content: "", is_done: false});
    };


    const handleDeleteClick = async(index) => {
         const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
         try {
            const response = await fetch(`${apiUrl}${fetchedData[index].creator_id}`, {
                method: 'DELETE',
                headers: headers,
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }
            if (response.ok){
                window.location.reload(false)
            }
            // Update the local state with the edited item
        } catch (error) {
            console.error('Error updating content:', error);
        }

    }

    return (
        <div>
            {isLoggedIn() ? <LoggedInView user={user()}/> : <LoggedOutView/>}

            <section className={'car__article'}>
                {fetchedData.map((item, index) => (
                    <article key={item.id} className={`car__item`}>
                        {editingIndex === index ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedItem.title}
                                    onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                                />
                                <input
                                    type="text"
                                    value={editedItem.content}
                                    onChange={(e) => setEditedItem({...editedItem, content: e.target.value})}
                                />
                                <input
                                    type="checkbox"
                                    checked={editedItem.is_done}
                                    onChange={(e) => setEditedItem({...editedItem, is_done: e.target.checked})}
                                />
                                <button className={'save__btn'} onClick={() => handleSaveClick(index)}>Save</button>
                                <button className={'cancel__btn'} onClick={handleCancelClick}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>Id: {item.id}</p>
                                <p>Title: {item.title}</p>
                                <p>Text: {item.content}</p>
                                <p>Done: {isDone(String(item.is_done))}</p>
                                <button className={'edit__btn'} onClick={() => handleEditClick(index)}>Edit</button>
                                <button className={'delete__btn'} onClick={() => handleDeleteClick(index)}>Delete</button>

                            </div>
                        )}
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