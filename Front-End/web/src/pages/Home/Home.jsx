import React, { useState, useEffect, useRef } from 'react'
//import axios from 'axios'
import NavBar from '../../components/NavBar/NavBar'
import Pagina from '../../components/Pagina/Pagina'
import ProductDataService from "../../services/ProductService"

import {Link} from 'react-router-dom'

import './Home.scss'
//import './Loading.scss'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Table from 'react-bootstrap/Table';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Home({ logout }) {

  const [rutas, setRutas] = useState([]);
  const [allData, setAllData] = useState([]);
  const [categorias, setCategorias] = useState([]); // list category
  const [loading, setLoading] = useState(false) // loading
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const obtenerDatos = () => {
    // GET request for remote image in node.js
    //axios.get('http://localhost:3001/api/products')
    //axios.get('https://pacientes20-back.herokuapp.com/api/products')
    ProductDataService.getAll()
      .then(res => {
        //console.log(res.data);
        setRutas(res.data)
        setAllData(res.data)
        
        setLoading(true) // loading
        
      })
  }

  const obtenerCategorias = () => {
    // GET request for remote image in node.js
    //axios.get('http://localhost:3001/api/categories')
    //axios.get('https://pacientes20-back.herokuapp.com/api/categories')
    ProductDataService.getAll2()
      .then(res => {
        //console.log(res.data);
        setCategorias(res.data)
      })
  }

  useEffect(() => {
    obtenerDatos();
    obtenerCategorias();
  }, [])


  const handleSearch = (event) => {
    const keyword = event.target.value;

    if (keyword !== '') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.concepto.toLowerCase().includes(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef2.current.value = "--Todos--";
      setRutas(results);
      setCurrentPage(1)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      // If the text field is empty, show all users
    }

  }


  const handleCategory = (event) => {
    const keyword = event.target.value;

    if (keyword !== '--Todos--') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.categoria.toLowerCase().includes(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef.current.value = "";
      setRutas(results);
      setCurrentPage(1)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      // If the text field is empty, show all users
    }

  }
  
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  //const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const currentPosts = rutas.slice(indexOfFirstPost, indexOfLastPost)
  
  
  // change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  
  // button delete
  const deleteProduct2 = (id) => {
  
    if (window.confirm("Desea ELIMINAR el paciente ?") === true) {
      ProductDataService.remove(id)
      .then(response => {
        //console.log(response.data);
        window.location.reload(true);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  return (
    <div style={{height: '100vh'}}  className='bgDiv'>
      <NavBar logout={logout} />

      <Card className='bgDiv'>
        <Card.Body>
          <Card.Title><h1>Bienvenido</h1></Card.Title>
          <Card.Text>
          Este sistema le permite visualizar el listado de pacientes
          </Card.Text>

          <Card.Title>Listado:</Card.Title>
          
          <InputGroup className="mt-3 mb-3">
            <InputGroup.Text id="basic-addon1">Total de pacientes:</InputGroup.Text>
            <Form.Label className="label"><span>{allData.length}</span></Form.Label>
          </InputGroup>


          <Form>
            <Container>
              <Row className='flexCol'>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Busqueda:</Form.Label>
                    <Form.Control
                      placeholder="Ingresar nombre"
                      aria-label="Ingresar nombre"
                      aria-describedby="basic-addon2"
                      className='inputLar'
                      autoComplete="off"
                      onChange={event => handleSearch(event)}
                      ref={inputRef}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Categoria:</Form.Label>
                    <Form.Select aria-label="Floating label select example" onChange={event => handleCategory(event)} ref={inputRef2}>
                      <option>--Todos--</option>
                      {
                        categorias.map(item => (
                          <option key={item.id} value={item.nombre}>{item.nombre}</option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>
                </Col>

              </Row>
            </Container>
          </Form>
          
          {/* "New" button */}
          <Link to={"/new"}><Button variant="primary"><i className="bi bi-plus-circle"></i> Nuevo</Button></Link>
          
          {loading ? (
          
            <Card>
              <Card.Body  className='bgDiv'>
              
                <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
    
                <Table striped bordered hover size="md" responsive >
                  <thead>
                    <tr>
                      <th className='text-center'>N°</th>
                      <th>Nombre</th>
                      <th className='text-center'>DNI</th>
                      <th className='text-center'>Fecha Nacimiento</th>
                      <th className='text-center'>Sexo</th>
                      <th className='text-center'>Categoria</th>
                      <th className='text-center'>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.map((item, index) => (
                      <tr key={item.id}>
                        <td className='text-center'>{index+1}</td>
                        <td>{item.concepto}</td>
                        <td className='text-center'>{item.monto}</td>
                        <td className='text-center'>{item.fecha2}</td>
                        <td className='text-center'>{item.tipo}</td>
                        <td className='text-center'>{item.categoria}</td>
                        <td className='text-center'>
                          <Link
                            className='btn btn-warning m-1'
                            to={`/edit/${item.id}`}
                            title='editar'
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button className="btn btn-danger ml-2"
                          onClick={() => deleteProduct2(`${item.id}`)}
                          title='borrar'
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
    
    
                  </tbody>
                </Table>
                
                <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
    
              </Card.Body>
            </Card>
          
          ) : (
          
            <div className="flexLoad" >
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          
          )}
          
          

        </Card.Body>
      </Card>

    </div>
  )
}

export default Home