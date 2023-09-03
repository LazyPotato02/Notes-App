import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAuthStore} from "../store/auth";
import Cookies from "js-cookie";
import './home.css';

import Modal from "react-modal";

const Home = () => {
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });
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
                    throw new Error('Please log-in or register');
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
        return (
            <div className={'error__class'}>
                <p className={'message'}>{error.message}</p>
                <Link to="/login">
                    <button className={'login__btn'}>Login</button>
                </Link>
                <Link to="/register">
                    <button className={'register__btn'}>Register</button>
                </Link>
            </div>
        )
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
        let i = index + 1

        try {

            const response = await fetch(`${apiUrl}${i}`, {
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


    const handleDeleteClick = async (index) => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        let i = index + 1
        try {
            const response = await fetch(`${apiUrl}${i}`, {
                method: 'DELETE',
                headers: headers,
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }
            if (response.ok) {
                window.location.reload(false)
            }
            // Update the local state with the edited item
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    }

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCreateClick = () => {
        const title = formData.title;
        const content = formData.content;

        if (!title || !content) {
            alert("Please fill in both fields");
            return;
        }

        // Assuming your API endpoint URL
        const apiUrl = "http://localhost:8000/api-notes/notes";

        // Create a request body with the form data
        const requestBody = JSON.stringify({
            title: title,
            content: content,
            creator_id: userId,
            is_done: false
        });

        // Send a POST request to the API
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,

            },
            body: requestBody,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                // Handle the API response here
                console.log("API Response:", data);
                // Optionally, you can perform additional actions after a successful API request
            })
            .catch((error) => {
                // Handle errors here
                console.error("API Error:", error);
            });

        // Reset the form data and close the modal
        setFormData({
            field1: "",
            field2: "",
        });
        closeModal();
        window.location.reload(false)
    };


    return (
        <div>

            {isLoggedIn() ? <LoggedInView user={user()}/> : <LoggedOutView/>}
            <div className={'create_note'}>
                <button className={'create_btn'} onClick={openModal}>Create</button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Create Modal"
                    className='modalStyle'
                >
                    <div className={'wrapper'}>
                        <h2>Create Item</h2>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            placeholder="Title"
                            onChange={handleInputChange}
                        />
                        <textarea
                            type="text"
                            name="content"
                            value={formData.content}
                            placeholder="Text"
                            onChange={handleInputChange}
                        />
                        <div className={'buttons'}>
                            <button onClick={handleCreateClick}>Submit</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            </div>
            <section className={'note__article'}>
                {fetchedData.map((item, index) => (
                    <article key={item.id} className={`note__item`}>
                        {editingIndex === index ? (
                            <div>
                                <div className={'inputs'}>
                                    <input
                                        className={'edit__input'}
                                        type="text"

                                        value={editedItem.title}
                                        onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                                    />
                                    <input
                                        className={'edit__input'}

                                        type="text"
                                        value={editedItem.content}
                                        onChange={(e) => setEditedItem({...editedItem, content: e.target.value})}
                                    />
                                    <input
                                        className={'edit__input'}

                                        type="checkbox"
                                        checked={editedItem.is_done}
                                        onChange={(e) => setEditedItem({...editedItem, is_done: e.target.checked})}
                                    />
                                </div>
                                <button className={'save__btn'} onClick={() => handleSaveClick(index)}>Save</button>
                                <button className={'cancel__btn'} onClick={handleCancelClick}>Cancel</button>
                            </div>

                        ) : (
                            <div>
                                {/*<p>Id: {item.id}</p>*/}
                                <p>Title: {item.title}</p>
                                <p>Comment: {item.content}</p>
                                <p>{isDone(String(item.is_done))}</p>
                                <button className={'edit__btn'} onClick={() => handleEditClick(index)}>Edit</button>
                                <button className={'delete__btn'} onClick={() => handleDeleteClick(index)}>Delete
                                </button>

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
        <div className={'logged__div'}>
            <h1>Welcome {user.username}</h1>

            <Link to="/logout">
                <button className={'logout_btn'}>Logout</button>
            </Link>
        </div>
    );
};

export const LoggedOutView = ({title = 'Home'}) => {
    return (
        <div className={'logout__view'}>
            <h1>{title}</h1>
            <div className={'logout__buttons'}>
                <Link to="/login">
                    <button className={'login__btn'}>Login</button>
                </Link>
                <Link to="/register">
                    <button className={'register__btn'}>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;