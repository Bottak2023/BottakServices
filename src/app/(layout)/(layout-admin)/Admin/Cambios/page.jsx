'use client';
import { useUser } from '@/context/Context'
import { getSpecificData, writeUserData } from '@/firebase/database'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Tag from '@/components/Tag'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import Select from '@/components/Select'
import { estado as estadoCONST } from '@/constants/'

export default function Home() {

  const { user, userDB, setUserProfile, modal, setModal, users, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, item, setItem, exchange, setExchange, destinatario, setDestinatario } = useUser()
  const [filter, setFilter] = useState('')
  const [state, setState] = useState({})
  const [remesasDB, setRemesasDB] = useState(undefined)
  const [estado, setEstado] = useState('')
  const refFirst = useRef(null);
  const [profileIMG, setProfileIMG] = useState('')
  const [row, setRow] = useState(-1)

  function onChangeFilter(e) {
    setFilter(e.target.value)
  }
  function handlerProfileIMG(img) {
    setProfileIMG(img)
}
function closeProfileIMG() {
  setProfileIMG('')
}
  function sortArray(x, y) {
    if (x.usuario.toLowerCase() < y.usuario.toLowerCase()) { return -1 }
    if (x.usuario.toLowerCase() > y.usuario.toLowerCase()) { return 1 }
    return 0
  }
  function handlerSelect(name, i, uuid) {
    setState({ ...state, [uuid]: { [name]: i } })
  }
  function save(uuid) {
    setModal('Guardando...')
    writeUserData(`cambios/${uuid}`, {...state[uuid], notificaciones: true, date: new Date().getTime()}, setUserSuccess, () => { setModal('') })
  }
  const prev = () => {
    requestAnimationFrame(() => {
      const scrollLeft = refFirst.current.scrollLeft;
      const itemWidth = screen.width - 50
      refFirst.current.scrollLeft = scrollLeft - itemWidth;
    });
  };
  const next = () => {
    requestAnimationFrame(() => {
      const scrollLeft = refFirst.current.scrollLeft;
      const itemWidth = screen.width - 50
      refFirst.current.scrollLeft = scrollLeft + itemWidth;
    });
  };
  useEffect(() => {
    remesasDB === undefined && getSpecificData(`/cambios/`, setRemesasDB)
  }, [remesasDB])
  return (
    <main className='w-full h-full'>
      {modal === 'Guardando...' && <Loader> {modal} </Loader>}
      {modal === 'Save' && <Modal funcion={saveConfirm}>Estas por modificar la tasa de cambio de:  {item['currency']}</Modal>}
      {modal === 'Disable' && <Modal funcion={disableConfirm}>Estas por {item.habilitado !== undefined && item.habilitado !== false ? 'DESABILITAR' : 'HABILITAR'} el siguiente item:  {item['currency']}</Modal>}
      {profileIMG.length > 0 && <div className='fixed top-0 left-0 h-[100vh] w-[100vw] bg-[#000000c7] z-40' onClick={closeProfileIMG}></div>}

      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>
      <div className="w-full   relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smooth" ref={refFirst}>
        <h3 className='font-medium text-[14px]'>Cambios</h3>
        <br />
        <input type="text" className='border-b-[1px] text-[14px] outline-none w-[400px]' onChange={onChangeFilter} placeholder='Buscar por remitente, destinatario o DNI' />
        <div className='min-w-[1900px] flex justify-start items-center my-5 '>
          <h3 className="flex pr-12 text-[14px]" htmlFor="">Estado</h3>
          <div className="grid grid-cols-5 gap-4 w-[800px] ">
            {estadoCONST.map((i, index) => {
              return <Tag theme={estado == i ? 'Primary' : 'Secondary'} click={() => setEstado(estado == i ? '' : i)}>{i}</Tag>
            })}
          </div>
        </div>
        <br />
        <br />
        <table className="w-full min-w-[4300px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
          <thead className="text-[14px] text-gray-700 uppercase bg-gray-800 text-white ">

            <tr>
              <th scope="col" className="w-[50px] px-3 py-1">

              </th>
              <th scope="col" className="w-[50px] px-3 py-1">

              </th>
              <th scope="col" colSpan={9} className=" text-center bg-red-500 px-3 py-1" >
                DATOS DE EMISIÓN
              </th>
              <th scope="col" colSpan={5} className=" text-center bg-green-500  px-3 py-1">
                DATOS PARA RECEPCIÓN
              </th>
              <th scope="col" colSpan={6} className=" text-center bg-yellow-500 px-3 py-1">
                DATOS DE TRANSACCION
              </th>
              <th scope="col" colSpan={4} className=" text-center bg-blue-500 px-3 py-1">
                Cuenta receptora Bottak
              </th>
              <th scope="col" className="w-[50px] px-3 py-1">

</th>
            </tr>

            <tr>
              <th scope="col" className="w-[50px] px-3 py-3">
                #
              </th>
              <th scope="col" className=" px-3 py-3">
                estado
              </th>
              <th scope="col" className=" px-3 py-3">
                Nombre
              </th>
              <th scope="col" className=" px-3 py-3">
                DNI 
              </th>
              <th scope="col" className=" px-3 py-3">
                Pais 
              </th>
              <th scope="col" className=" px-3 py-3">
                Celular 
              </th>
              <th scope="col" className=" px-3 py-3">
                Nombre de banco
              </th>
              <th scope="col" className=" px-3 py-3">
                Cuenta bancaria
              </th>
              <th scope="col" className=" px-3 py-3">
                Direccion de wallet
              </th>
              <th scope="col" className=" px-3 py-3">
                Red
              </th>
              <th scope="col" className=" px-3 py-3">
                Divisa emisión
              </th>
              {/* Destinatario */}
              <th scope="col" className=" px-3 py-3">
                Nombre de banco
              </th>
              <th scope="col" className=" px-3 py-3">
                Cuenta bancaria
              </th>
              <th scope="col" className=" px-3 py-3">
                Direccion de wallet
              </th>
              <th scope="col" className=" px-3 py-3">
                Red
              </th>
              <th scope="col" className=" px-3 py-3">
                Divisa recepción
              </th>
              {/* Transaccion */}
              <th scope="col" className=" px-3 py-3">
                Importe mas comision
              </th>
              <th scope="col" className=" px-3 py-3">
                Comision
              </th>
              <th scope="col" className=" px-3 py-3">
                Importe cambio
              </th>
              <th scope="col" className=" px-3 py-3">
                Fecha
              </th>
              <th scope="col" className=" px-3 py-3">
                ID de transacción
              </th>
              <th scope="col" className=" px-3 py-3">
                Baucher
              </th>
              <th scope="col" className=" px-3 py-3">
                Nombre de banco
              </th>
              <th scope="col" className=" px-3 py-3">
                Cuenta bancaria
              </th>
              <th scope="col" className=" px-3 py-3">
                Billetera Bottak
              </th>
              <th scope="col" className=" px-3 py-3">
                Red Bottak
              </th>
              <th scope="col" className=" px-3 py-3">
                Actualizar
              </th>
            </tr>


          </thead>
          <tbody>
            {remesasDB && remesasDB !== undefined && Object.values(remesasDB).map((i, index) => {
              return ((i.dni !== undefined && i.dni.toLowerCase().includes(filter.toLowerCase())) ||
              (i.usuario !== undefined && i.usuario.toLowerCase().includes(filter.toLowerCase()))) &&
              <tr className={`text-[14px] border-b border-gray-50  py-1 transition-all ${index === row ? 'bg-gray-100' : 'bg-gray-200'} ${index % 2 === 0 ? '' : ''} `} key={index} onClick={() => setRow(index)}>
                  <td className="px-3 py-0  flex  ">
                    <span className='h-full flex py-0'>{index + 1}</span>
                  </td>
                  {/* {console.log(i['estado'])} */}
                  <td className="min-w-32 px-3 py-0  ">
                    <Select arr={estadoCONST} name='estado' uuid={i.uuid} defaul={i.estado} click={handlerSelect} />
                  </td>
                  <td className="min-w-32 px-3 py-0  ">
                    {i['usuario']}
                  </td>
                  <td className="min-w-32 px-3 py-0  ">
                    {i['dni']}
                  </td>
                  <td className="min-w-32 px-3 py-0  ">
                    {i['pais']}
                  </td>
                  <td className="min-w-32 px-3 py-0  ">
                    {i['whatsapp']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['banco remitente']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['cuenta bancaria']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['billetera remitente']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['red bottak']}
                  </td>
                  <td className=" px-2">
                    {i['divisa de usuario']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['nombre de banco']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['cuenta destinatario']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['billetera destinatario']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['red destinatario']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['red destinatario']}
                  </td>
                  <td className="px-3 py-0  ">
                    {i['importe']}
                  </td>
                  <td className=" px-2">
                    {i['comision']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['cambio']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['fecha']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['uuid']}
                  </td>
                  <td className="min-w-32 px-2">
                    <img src={i.url} className={`${i.url === profileIMG ? 'fixed right-0 left-0 top-0 bottom-0 m-auto portrait:w-[100vw] landscape:h-[100vh] z-50'  : 'h-[150px] w-[150px] object-contain'}`}  onClick={() => handlerProfileIMG(i.url)} alt="" />
                  </td>
                  <td className="min-w-32 px-2">
                    {i['banco bottak']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['cuenta bottak']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['billetera bottak']}
                  </td>
                  <td className="min-w-32 px-2">
                    {i['red bottak']}
                  </td>
                 
                  <td className="px-3 py-0">
                    {state && state !== undefined && state[i.uuid] && state[i.uuid] !== undefined
                      ? <Button theme={"Success"} click={() => save(i.uuid)}>Guardar</Button>
                      : <Button theme={"Disable"}>Desabilitado</Button>
                    }
                  </td>
                </tr>
            })
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

