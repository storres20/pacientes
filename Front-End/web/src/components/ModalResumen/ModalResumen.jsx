import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import ProductDataService from "../../services/ProductService";
import Pagina from "../Pagina/Pagina"

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './ModalResumen.scss'

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function ModalResumen({show, closeShow, list}) {
  /* Redux */
  const categorias = useSelector((state) => state.categories);
  
  //console.log(list)
  
  // *******************************************
  // setting useState
  
  const [rutas, setRutas] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false) // loading
  const [noData, setNoData] = useState(false)  // noData - filter's result
  const [noData2, setNoData2] = useState(false)  // noData2 - database's result
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  
  
  // ***************************
  // get patient's dates

  const obtenerDatos = (x) => {
    
    setLoading(false) // loading
    
    if (x.dni !== null) {
    
      // GET request for remote image in node.js 111222333
      ProductDataService.getDateDNI(x.dni)
        .then(res => {
          //console.log(res.data);
          setRutas(res.data)
          setAllData(res.data)
          
          setLoading(true) // loading
          //console.log(res)
          if (res.data.length === 0) {
            setNoData2(true) // no data
          }
          else {
            setNoData2(false)
          }
          
        })
        .catch(e => {
          setLoading(true) // loading
          setNoData2(true) // no data
          setRutas([])
          setAllData("*") // false conditional
        });
        
    }else{
    
      setLoading(true) // loading
      setNoData2(true) // no data
    
    }
      
  }


  useEffect(() => {
    if (list !== false) {
      obtenerDatos(list);
    }
  }, [list])

  
  // *********************************
  // filter data
  
  const handleSearch = (event) => {
    const keyword = event.target.value;

    if (keyword !== '') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.fechacita2.toLowerCase().includes(keyword.toLowerCase()) || user.hora.includes(keyword);
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef2.current.value = "--Todos--";
      setRutas(results);
      setCurrentPage(1)
      
      if (results.length === 0) {
        setNoData(true) // no data
      }
      else setNoData(false)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      setNoData(false) // no data
      // If the text field is empty, show all users
    }

  }

  
  // *********************************
  // filter data
  
  const handleCategory = (event) => {
    const keyword = event.target.value;

    if (keyword !== '--Todos--') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.categoria2.toLowerCase().includes(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef.current.value = "";
      setRutas(results);
      setCurrentPage(1)
      
      if (results.length === 0) {
        setNoData(true) // no data
      }
      else setNoData(false)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      setNoData(false) // no data
      // If the text field is empty, show all users
    }

  }
  
  
  // ***************************************************
  // Pagination
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  //const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const currentPosts = rutas.slice(indexOfFirstPost, indexOfLastPost)
  
  
  // change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  
  // **********************************
  // button delete
  const deleteProduct2 = (id) => {
  
    if (window.confirm("Desea ELIMINAR la CITA ?") === true) {
      ProductDataService.removeDNI(id)
      .then(response => {
        //console.log(response.data);
        //window.location.reload(true);
        //obtenerDatos(params)
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };
  
  
  // ****************************
  // Modal - Resumen
  
  const [fullscreen, setFullscreen] = useState(true);
  
  // close modal
  const handleClose = () => {
    setFullscreen(true) // fullscreen modal
    closeShow(false); // close modal
  };
  

  return (
    <div>
      {/* Modal Resumen */}
      <Modal
        show={show}
        fullscreen={fullscreen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="flex1 bgDiv pt-5 pb-5">
          <h2>Resumen de Citas</h2>
          <p className='text-center'><b>Permite visualizar todas las citas del paciente</b></p>
          
          {loading ? (
          <>
            
            {!noData2 ? (
            <>
              <Form>
                <Container>
                  <Row className='flexCol'>
                    <Col>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Busqueda:</Form.Label>
                        <Form.Control
                          placeholder="Ingresar fecha u hora"
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
                        <Form.Label>Servicio / Especialidad:</Form.Label>
                        <Form.Select aria-label="Floating label select example" onChange={event => handleCategory(event)} ref={inputRef2}>
                          <option>--Todos--</option>
                          {
                            categorias.map(item => (
                              <option key={item._id} value={item.nombre}>{item.nombre}</option>
                            ))
                          }
                        </Form.Select>
                      </Form.Group>
                    </Col>
    
                  </Row>
                </Container>
              </Form>
            
              {/* "New" button */}
              {/* <Link to={"/new"} title='Nuevo Paciente'><Button variant="primary"><i className="bi bi-plus-circle"></i> Nuevo</Button></Link> */}
            
              {!noData ? (
              
                <Card className="mt-3 ">
                  <Card.Body className='bgDiv divTable'>
                  
                    <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
                    
                      <Table striped bordered hover size="sm" responsive >
                        <thead>
                          <tr>
                            <th className='text-center'>N°</th>
                            <th>Nombre</th>
                            <th className='text-center'>DNI</th>
                            <th className='text-center'>Fecha de Cita</th>
                            <th className='text-center'>Hora</th>
                            <th className='text-center'>Servicio / Especialidad</th>
                            <th className='text-center'>Accion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPosts.map((item, index) => (
                            <tr key={item._id}>
                              <td className='text-center'>{index+1}</td>
                              <td>{item.nombre}</td>
                              <td className='text-center'>{item.dni}</td>
                              <td className='text-center'>{item.fechacita2}</td>
                              <td className='text-center'>{item.hora}</td>
                              <td className='text-center'>{item.categoria2}</td>
                              <td className='text-center'>
                                <div className='d-flex flex-row align-items-baseline justify-content-center'>
                                  {/* <Link to={"#"} title='nueva cita' className='btn btn-primary'>
                                    <i className="bi bi-plus-circle-fill"></i>
                                  </Link>
                                  <Link
                                    className='btn btn-warning m-1'
                                    to={"#"}
                                    title='editar cita'
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </Link>
                                  <button className="btn btn-danger"
                                  title='borrar cita'
                                  >
                                    <i className="bi bi-trash-fill"></i>
                                  </button> */}
                                </div>
                              </td>
                            </tr>
                          ))}
          
          
                        </tbody>
                      </Table>
                    
                    <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
        
                  </Card.Body>
                </Card>
              
              ) : ("")}
              
              
              {noData ? (
              
                <div className='text-center mt-4'>
                  <h2>Intente con otro valor</h2>
                </div>
              
              ) : ("")}
              
            </>
            ) : ("")}
            
            
            {noData2 ? (
                
              <div className='text-center mt-5'>
                <h2>No tiene citas programadas</h2>
              </div>
            
            ) : ("")}
            
            <div className='mt-4 text-center'>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
            
          </>
          
          ) : (
              
            <div className="flexLoad" >
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          
          )}
          
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalResumen