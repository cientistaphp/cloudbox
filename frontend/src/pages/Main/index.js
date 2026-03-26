import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import '@fortawesome/fontawesome-free/css/all.css';
//import Icon from 'react-native-vector-icons/FontAwesome';
//import logo from '../../assets/logo.svg';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import './styles.css';

export default function Main () { 
           const [newBox, setNewBox] = useState('');
           const navigate = useNavigate();

          const handleSubmit = async (e) => {
               e.preventDefault();

               const response = await api.post('boxes', {
                    title: newBox,
              });

                navigate(`/box/${response.data._id}`);
 
                 //console.log(this.state.newBox);
                 //console.log(response.data);
           };           
     
         // const handleInputChange = (e) => {
         //          this.setState({ newBox: e.target.value });
         //};
          // const handleInputChange  = e=>{
          //     this.setState({newBox: e.target.value});
          //};  

            return (
                <div id="main-container">
                    <form onSubmit={handleSubmit}>
                        <Logo className="logo" />

                   <input
                       placeholder="Criar um box"
                       value={newBox}
                       onChange={(e) => setNewBox(e.target.value)}
                   />

                   <button type="submit">Criar</button>
           </form>
    </div>
  );
}