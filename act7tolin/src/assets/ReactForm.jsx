import { useEffect, useState } from "react";
import axios from 'axios';
import './ReactForm.css'

function ReactForm() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        axios.get('https://tolin.netlify.app/.netlify/functions/api/')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError('Error occurred while fetching data: ' + error.message);
            });
    }, []);

    const handleSubmit = (e, id = null) => {
        e.preventDefault();
        if (!name || !age || !email) {
            setError('Name, age, and email cannot be empty!');
            return;
        }

        const url = editItem
            ? `https://tolin.netlify.app/.netlify/functions/api/${editItem._id}`
            : `https://tolin.netlify.app/.netlify/functions/api/`;
        const method = editItem ? 'put' : 'post';
        
        axios[method](url, { name, age, email })
            .then((response) => {
                if (editItem) {
                    setData(
                        data.map((item) =>
                            item._id === id ? response.data : item));
                } else {
                    setData([...data, response.data.author]);
                }
                setName('');
                setAge('');
                setEmail('');
                setEditItem(null);
                setError(null);
            })
            .catch((error) => {
                setError('Error occurred while submitting data: ' + error.message);
            });
    }

    const handleEdit = (_id) => {
        const itemToEdit = data.find((item) => item._id === _id);
        setEditItem(itemToEdit);
        setName(itemToEdit.name);
        setAge(itemToEdit.age);
        setEmail(itemToEdit.email);
    }

    const handleDelete = (_id) => {
        axios
            .delete(
                `https://tolin.netlify.app/.netlify/functions/api/${_id}`
            )
            .then(() => {
                setData(data.filter((item) => item._id !== _id));
            })
            .catch((error) => {
                console.log('Error occurred while deleting data: ' , error.message);
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="input-field"
                />
                <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="input-field"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="input-field"
                />
                <button type="submit" className="submit-btn">{editItem ? 'Update Data' : 'Add Data'}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>{item.email}</td>
                            <td>
                                <button onClick={() => handleEdit(item._id)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ReactForm;
