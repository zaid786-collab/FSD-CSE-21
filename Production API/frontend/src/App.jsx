import React, {useState,useEffect} from 'react';


function UserProfile() {
  const [user,setUser] = useState(null);
}

const App = () => {
  const[products,setProduncts] = useState([]);
  const[name,setName] = useState('');
  const[price,setPrice] = useState('');
  const[category,setCategory] = useState('');

  const getProducts = async() => {
    const response = await fetch('');
    const data = await response.json();
    setProduncts(data);
  }

  const addProduct = async(e) => {
    e.preventDefault();
    const product = ({
      
    })
  }
  return (
    <div>
      
    </div>
  )
}

export default App
