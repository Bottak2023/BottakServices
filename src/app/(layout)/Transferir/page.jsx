'use client'
import { useState, useEffect } from 'react'
import { uploadStorage, downloadFile } from '@/firebase/storage'
import { useUser } from '@/context/Context.js'
import Input from '@/components/Input'
import SelectCountry from '@/components/SelectCountry'
import Label from '@/components/Label'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import Msg from '@/components/Msg'
import { useMask } from '@react-input/mask';
import { useRouter } from 'next/navigation';
import { WithAuth } from '@/HOCs/WithAuth'
import { getDayMonthYear } from '@/utils/date'
import { generateUUID } from '@/utils/UUIDgenerator'
import SelectBank from '@/components/SelectBank'
import SelectWallet from '@/components/SelectWallet'

import ModalINFO from '@/components/ModalINFO'
import { getSpecificDataEq, getSpecificData2, writeUserData, removeData } from '@/firebase/database'

import Link from 'next/link'
function Home() {

    const { nav, setNav, user, userDB, setUserProfile, select, select2, wallets, setDestinatario, success, setUserData, postsIMG, setUserPostsIMG, isSelect3, setIsSelect3, isSelect4, setIsSelect4, modal, setModal, destinatario, qr, setQr, QRurl, setQRurl, countries, setEnviosDB, setCambiosDB, setIsSelect5, isSelect5 } = useUser()
    const router = useRouter()

    const [postImage, setPostImage] = useState(undefined)
    const [pagosQR, setPagosQR] = useState(undefined)
    const [walletQR, setWalletQR] = useState(undefined)

    const [urlPostImage, setUrlPostImage] = useState(undefined)
    const [payDB, setPayDB] = useState(undefined)
    function onChangeHandler(e) {
        setDestinatario({ ...destinatario, [e.target.name]: e.target.value })
    }
    // const handlerCountrySelect = (pais, cca3) => {
    //     setDestinatario({ ...destinatario, ['pais cuenta bancaria']: pais, cca3 })
    // }
    const handlerIsSelect = () => {
        setIsSelect3(!isSelect3)
    }
    const handlerBankSelect2 = (i, data) => {
        setDestinatario({ ...destinatario, ['banco remitente']: i, ['banco bottak']: i, ['cuenta bottak']: data['cta bancaria'] })
    }
    const handlerWalletSelect2 = (i, db) => {
        console.log(db)
        setDestinatario({ ...destinatario, ['billetera bottak']: db.address, ['red bottak']: db.network })
        setWalletQR(db)
    }



    const handlerBankSelect = (i, data) => {
        setDestinatario({ ...destinatario, ['banco bottak']: i, ['cuenta bottak']: data['cta bancaria'] })
        setPayDB(data)
    }
    function manageInputIMG(e) {
        const file = e.target.files[0]
        setPostImage(file)
        setUrlPostImage(URL.createObjectURL(file))
    }
    const handlerIsSelect4 = () => {
        setIsSelect4(!isSelect4)
    }
    const handlerIsSelect5 = () => {
        setIsSelect5(!isSelect5)
    }





    function save(e) {
        e.preventDefault()

        setModal('Iniciando verificación rapida...')

        // const reader = new FileReader();
        // reader.onloadend = () => {
        //     // console.log(reader.result);
        // }
        // reader.readAsDataURL(postImage);

        const uuid = generateUUID()
        const date = new Date().getTime()
        const fecha = getDayMonthYear(date)
        const db = {
            ...destinatario,
            email: user.email,
        }
        console.log(db)
        const callback2 = async (object) => {
            getSpecificDataEq(`/envios/`, 'user uuid', user.uid, setEnviosDB)
            getSpecificDataEq(`/cambios/`, 'user uuid', user.uid, setCambiosDB)

            try {
                setModal(`Enviando los resultados de la VERIFICACION RAPIDA a \n ${user.email}`)

                const res = await fetch('/api/postGoogleSheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "op": "listar",
                        "remitente": object['remitente'],
                        "importe": db['importeTotal'],
                        "user uuid": object['user uuid'],
                        "uuid": object.uuid,
                        "operacionURL": object['operacion'] === 'Envio' ? 'envios' : 'cambios',
                        "name": userDB.nombre,
                        "lastName": userDB.apellido
                    }),

                    // WITH APPSCRIPT ONLY
                    // body: JSON.stringify({
                    //     ...db, ...object, email: user.email,
                    //     "op": "listar",
                    //     "operacionURL": object['operacion'] === 'Envio' ? 'envios' : 'cambios'
                    // }),
                })
                setModal(`Finalizando...`)
                const data = await res.json()









                const datosEmail = object['operacion'] === 'Envio'
                    ? {
                        'DATOS DE REMITENTE': db['divisa de envio'] === 'USDT'
                            ? {
                                Nombre: object['remitente'],
                                Dni: db['dni remitente'],
                                Pais: db['pais remitente'],
                                Celular: db['whatsapp'],
                                'Direccion de wallet': db['billetera remitente'],
                                Red: db['red bottak'],
                                'Divisa Envio': db['divisa de envio']
                            }
                            : {
                                Nombre: db['remitente'],
                                Dni: db['dni remitente'],
                                Pais: db['pais remitente'],
                                Celular: db['whatsapp'],
                                Banco: db['banco remitente'],
                                'Cuenta Bancaria': db['cuenta bancaria'],
                                'Divisa Envio': db['divisa de envio']
                            },
                        'DATOS DE DESTINATARIO': db['divisa de receptor'] === 'USDT'
                            ? {
                                Nombre: db['destinatario'],
                                Dni: db['dni'],
                                Pais: db['pais'],
                                Direccion: db['direccion'],
                                Celular: db['celular'],
                                'Direccion de billetera': db['billetera destinatario'],
                                'Red': db['red destinatario'],
                                'Divisa Receptor': db['divisa de receptor'],
                            }
                            : {
                                Nombre: db['destinatario'],
                                Dni: db['dni'],
                                Pais: db['pais'],
                                Direccion: db['direccion'],
                                Celular: db['celular'],
                                'Cuenta Destinatario': db['cuenta destinatario'],
                                'Nombre Banco': db['nombre de banco'],
                                'Divisa Receptor': db['divisa de receptor'],
                            },
                        'DATOS DE TRANSACCION': {
                            Operacion: object['operacion'],
                            Importe: object['importe'],
                            Comision: db['comision'],
                            ['Importe detinatario']: db['cambio'],
                            Estado: (data?.message && data.message === 'Verificado con Exito') ? 'Verificado' : 'En verificación',
                            Fecha: object['fecha'],
                            'ID de tracking': db.uuid

                        },
                        'CUENTA RECEPTORA BOTTAK': db['divisa de envio'] === 'USDT'
                            ? {
                                'Billetera Bottak': db['billetera bottak'],
                                'Red Bottak': db['red bottak']
                            }
                            : {
                                'Banco Bottak': db['banco bottak'],
                                'Cuenta Bottak': db['cuenta bottak']
                            }

                    }

                    : {


                        'DATOS DE EMISION': db['divisa de usuario'] === 'USDT'
                            ? {
                                Nombre: object['remitente'],
                                Dni: db['dni'],
                                Pais: db['pais'],
                                Celular: db['whatsapp'],
                                'Direccion de wallet': db['billetera remitente'],
                                Red: db['red bottak'],
                                'Divisa Emision': db['divisa de usuario']
                            }
                            : {
                                Nombre: object['remitente'],
                                Dni: db['dni'],
                                Pais: db['pais'],
                                Celular: db['whatsapp'],
                                'Banco Emisor': db['banco remitente'],
                                'Cuenta Emisora': db['cuenta bancaria'],
                                'Divisa Emision': db['divisa de usuario']
                            }
                        ,
                        'DATOS PARA RECEPCIÓN': db['divisa de cambio'] === 'USDT'
                            ? {
                                'Direccion de billetera': db['billetera destinatario'],
                                'Red': db['red destinatario'],
                                'Divisa Recepcion': db['divisa de cambio']
                            }
                            : {
                                'Cuenta Receptora': db['cuenta destinatario'],
                                'Banco Receptor': db['nombre de banco'],
                                'Divisa Recepcion': db['divisa de cambio']
                            },
                        'DATOS DE TRANSACCION': {
                            Operacion: object['operacion'],
                            Importe: object['importe'],
                            Comision: db['comision'],
                            Cambio: db['cambio'],
                            Estado: (data?.message && data.message === 'Verificado con Exito') ? 'Verificado' : 'En verificación',
                            Fecha: object['fecha'],
                            'ID de tracking': db.uuid

                        },
                        'CUENTA RECEPTORA BOTTAK': db['divisa de usuario'] === 'USDT'
                            ? {
                                'Billetera Bottak': db['billetera bottak'],
                                'Red Bottak': db['red bottak']
                            }
                            : {
                                'Banco Bottak': db['banco bottak'],
                                'Cuenta Bottak': db['cuenta bottak']
                            }
                    };







                const html = (`<main style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
                        <table style="width: 100%; min-width: 50vw; border-radius: 20px; text-align: left; font-size: 14px; color: #6b7280; background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                            <thead style="text-align: center; font-weight: bold; background-color: #4b5563; color: white;">
                                <tr>
                                    <th colspan="2" style="padding: 15px;">
                                        Baucher de transacción <br />
                                    </th>
                                </tr>
                            </thead>
                      ${(`     <tbody>
       ${Object.entries(datosEmail).map(item => `
                    <tr style="background-color: rgba(0, 0, 0, 0.1);">
                        <td colspan="2" style="padding: 15px; font-weight: bold; background-color: #4b5563;  color: white;">
                            ${item[0]}
                        </td>
                    </tr>
                ${Object.entries(item[1]).map(i => `<tr style="background-color: white; border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 15px; background-color: rgba(0, 0, 0, 0.1); font-weight: bold; color: #1f2937;">
                                ${i[0]}
                            </td>
                            <td style="padding: 15px; color: #1f2937;">
                                ${i[1]}
                            </td>
                    </tr>`)}
              `)}  
              </tbody>`).replaceAll('</tr>,', '</tr>')}
            </table>
        </main>`)






                const botChat = ` ${(`${Object.entries(datosEmail).map(item => `------${item[0]}---\n${Object.entries(item[1]).map(i => `${i[0]}: ${i[1]}\n`)}`)}\n${object.url}`).replaceAll(',', '').replaceAll('  ', ' ')}`

                console.log(botChat)

                await fetch(`/api/bot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: botChat, url: object.url }),
                })

                await fetch(`/api/sendEmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: html, estado: data?.message && data?.message !== undefined && data.message === 'Verificado con Exito' ? 'Verificado' : 'En verificación', email: user.email, operacion: object['operacion'] })
                })
                router.replace(`/Exitoso?uuid=${uuid}&operacion=${object['operacion'] === 'Cambio' ? 'cambios' : 'envios'}`)
                setModal('')
            } catch (err) {
                console.log(err)
            }
        }

        function callback(object) {
            const obj = {
                "remitente": object['operacion'] === 'Cambio' ? object['usuario'] : object['remitente'],
                "importe": object['importe'],
                "user uuid": object['user uuid'],
                "uuid": object.uuid,
                "operacion": object['operacion'],
                "fecha": object.fecha,
                "email": object.email,
                "url": object.url
            }
            destinatario.operacion === 'Cambio'
                ? uploadStorage(`cambios/${uuid}`, postImage, obj, callback2)
                : uploadStorage(`envios/${uuid}`, postImage, obj, callback2)
        }



        destinatario.operacion === 'Cambio'
            ? uploadStorage(`cambios/${uuid}`, postImage, { ...db, fecha, date, uuid, estado: 'En verificación', verificacion: false, email: user.email }, callback)
            : uploadStorage(`envios/${uuid}`, postImage, { ...db, fecha, date, uuid, estado: 'En verificación', verificacion: false, email: user.email }, callback)
    }
    console.log(payDB)
    return (
        countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined
            ? <form className='relative w-full min-h-[80vh] space-y-6 lg:grid lg:grid-cols-2 lg:gap-5 ' onSubmit={(e) => save(e)}>
                {modal === 'Validando...' && <Loader> {modal} </Loader>}
                {modal.length > 5 && <Loader>{modal}</Loader>}

                {/* <div className='w-full  col-span-2'>
                    <h3 className=' pb-3 text-white border-gray-100 border-b-[2px] text-right'>Datos Bancarios De Transacción</h3>
                </div>
                <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>Datos de cuenta remitente</h3>
                </div> */}
                {/* <div className=' space-y-5'>
                    <Label htmlFor="">Pais de mi cuenta bancaria</Label>
                    <SelectCountry name="pais cuenta bancaria" propHandlerIsSelect={handlerIsSelect} propIsSelect={isSelect3} operation="recepcion" click={handlerCountrySelect} />
                </div> 
                {destinatario !== undefined && destinatario['pais cuenta bancaria'] !== undefined && <div className=' space-y-5'>
                    <Label htmlFor="">Nombre de mi banco</Label>
                    <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect5} propIsSelect={isSelect5} operation="envio" click={handlerBankSelect2} arr={countries[userDB.cca3].countries !== undefined ? Object.values(countries[userDB.cca3].countries) : []} />
                </div>}*/}

                {/* {destinatario !== undefined && destinatario['pais cuenta bancaria'] !== undefined && <> <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>QR y cuenta para deposito Bancario</h3>
                </div>
                    <div className=' space-y-5'>
                        <Label htmlFor="">Elige una banco para deposito QR</Label>
                        <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect4} propIsSelect={isSelect4} operation="envio" click={handlerBankSelect} arr={countries[destinatario.cca3].countries !== undefined ? Object.values(countries[destinatario.cca3].countries) : []} />
                    </div>
                </>} */}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Numero de cuenta transferidora</Label>
                <Input type="text" name="cuenta transferidora" onChange={onChangeHandler} required />
            </div> */}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Titular de banco bottak</Label>
                <Input type="text" name="titular de banco" onChange={onChangeHandler} required />
            </div> */}
                <div className='bg-transparent md:bg-gradient-to-tl from-[#191919be] to-[#23232343]  col-span-2  lg:grid lg:grid-cols-2 lg:gap-5 p-1 lg:p-5 justify-items-center'>
                    <div className='text-center w-full col-span-2 text-green-500 font-bold py-5 mb-5  md:flex md:justify.center' >
                        <h3 className='font-bold text-[14px] text-white uppercase flex items-center'>
                            <div className='bg-gray-950 text-white border border-green-500 h-[40px] w-[40px] rounded-full flex justify-center items-center mr-3'>
                                2
                            </div>
                            <p className='bg-gray-950 text-white underline  underline-offset-8  decoration-green-500  px-3 py-2 rounded-[10px]  border border-green-500'>
                                {select !== 'USDT' ? 'Indica tu banco y tu numero de cuenta desde la cual haras la transferencia' : 'Indica tu billetera y su direccion desde la cual haras la transferencia'}
                            </p>
                        </h3>
                    </div>





                    {select !== 'USDT' && <div className='py-5  md:py-0  space-y-5 w-full max-w-[380px] '>
                        <Label htmlFor="">Elige tu banco</Label>
                        <SelectBank name="nombre de banco" bg='bg-gray-50  border-gray-400' propHandlerIsSelect={handlerIsSelect5} propIsSelect={isSelect5} operation="envio" click={handlerBankSelect2} arr={countries[userDB.cca3].countries !== undefined ? Object.values(countries[userDB.cca3].countries) : []} />
                    </div>}
                    {select !== 'USDT' && <div className='py-5  md:py-0   space-y-5 w-full max-w-[380px] '>
                        <Label htmlFor="">Numero de tu cuenta bancaria</Label>
                        <Input type="text" name="cuenta bancaria" onChange={onChangeHandler} required />
                    </div>}

                    {select == 'USDT' && <div className='py-5  md:py-0   w-full max-w-[380px] space-y-5'>
                        <Label htmlFor="">Elige una wallet de tranferencia</Label>
                        <SelectWallet name="billetera bottak" bg='bg-gray-50 border-gray-400' propHandlerIsSelect={handlerIsSelect5} propIsSelect={isSelect5} operation="envio" click={handlerWalletSelect2} arr={wallets ? Object.values(wallets) : []} />
                    </div>}
                    {select == 'USDT' && <div className='py-5  md:py-0   space-y-5 w-full max-w-[380px]'>
                        <Label htmlFor="">Dirección de tu billetera</Label>
                        <Input type="text" name="billetera remitente" onChange={onChangeHandler} required />
                    </div>}

                    {/* {<div className='text-center w-full col-span-2 bg-gray-800 border border-gray-500 text-green-500 font-bold  py-5 mb-5 mt-[20px] md:mt-0' >
                        EFECTUAR TRANSACCION
                    </div>} */}



                    <div className='text-center w-full col-span-2 text-green-500 font-bold py-5 mb-5 md:flex md:justify.center' >
                        <h3 className='font-bold text-[14px] text-white uppercase flex items-center'>
                            <div className='bg-gray-950 text-white border border-green-500 h-[40px] w-[40px] rounded-full flex justify-center items-center mr-3'>
                                3
                            </div>
                            <p className='bg-gray-950 text-white underline  underline-offset-8  decoration-green-500  px-3 py-2 rounded-[10px]  border border-green-500'>
                                EFECTUAR TRANSACCION
                            </p>
                        </h3>
                    </div>


                    {/* {destinatario !== undefined && destinatario['banco bottak'] !== undefined &&  */}
                    {select !== 'USDT'
                        ? <div className='py-5  md:py-0   space-y-5'>
                            {/* <Label htmlFor="">QR bancario para el deposito</Label> */}
                            <Label htmlFor="">QR para transferencia</Label>

                            {/* <div className=' space-y-5'>
                                <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect4} bg='bg-white' propIsSelect={isSelect4} operation="envio" click={handlerBankSelect} arr={countries[userDB.cca3].countries !== undefined ? Object.values(countries[userDB.cca3].countries) : []} />
                            </div> */}
                            <Link href='#' className="w-full flex flex-col justify-center items-center" download >
                                <label className="relative flex flex-col justify-start items-center w-[300px] min-h-[300px] h-auto bg-white border border-gray-400 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                    {destinatario?.['banco bottak'] && countries && countries[userDB.cca3] && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined
                                        ? <img className=" flex justify-center items-center w-[300px] min-h-[300px] h-auto bg-white text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined ? countries[userDB.cca3].countries[destinatario['banco bottak']].qrURL : ''} alt="" />
                                        : <p className='relative h-full text-[12px] w-full p-5 text-center top-0 bottom-0 my-auto'>Selecciona uno de nuestros bancos para obtener un QR y efectuar su transferencia</p>}
                                    {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && destinatario && destinatario.importe}
                                    {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && destinatario && destinatario['divisa de envio']}
                                </label>
                            </Link>
                            {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && <span className="block text-black text-center" >Cta. {countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']]['cta bancaria']} <br />
                                {destinatario !== undefined && destinatario['banco bottak'] !== undefined && countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']].banco}
                            </span>}
                        </div>
                        : <div className=' space-y-5 py-5  md:py-0  '>
                            <Label htmlFor="">QR para transferencia</Label>


                            <Link href='#' className="w-full flex flex-col justify-center items-center" download >
                                <label className="relative flex flex-col justify-start items-center w-[300px] min-h-[300px] h-auto bg-white border border-gray-400 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                    {walletQR && walletQR !== undefined
                                        ? <img className=" flex justify-center items-center w-[300px] min-h-[300px] h-auto bg-white text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={walletQR.qrURL} alt="" />
                                        : <p className='relative h-full text-[12px] w-full p-5 text-center top-0 bottom-0 my-auto'>Selecciona uno de nuestros bancos para obtener un QR y efectuar su transferencia</p>}
                                    {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && destinatario && destinatario.importe}
                                    {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && destinatario && destinatario['divisa de envio']}
                                </label>
                            </Link>
                            {countries?.[userDB.cca3]?.countries?.[destinatario?.['banco bottak']] !== undefined && <span className="block text-black text-center" >Cta. {countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']]['cta bancaria']} <br />
                                {destinatario !== undefined && destinatario['banco bottak'] !== undefined && countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']] !== undefined && countries[userDB.cca3].countries[destinatario['banco bottak']].banco}
                            </span>}
                        </div>
                    }


                    {((destinatario !== undefined && destinatario['banco bottak'] !== undefined) || walletQR) && <div className=' py-5  md:py-0  space-y-5'>
                        <Label htmlFor="">Subir baucher</Label>

                        {/* <Label htmlFor="">Baucher de transferencia</Label> */}
                        <div className="w-full flex justify-center">
                            <label htmlFor="file" className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-400  text-center text-gray-900 text-[14px] focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                {urlPostImage !== undefined ? <img className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={urlPostImage} alt="" />
                                    : 'Subir baucher'}
                            </label>
                            <input className="hidden" id='file' name='name' onChange={manageInputIMG} accept=".jpg, .jpeg, .png, .mp4, webm" type="file" required />
                        </div>
                    </div>}


                    {countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && <div className='py-5  md:py-0  flex w-full justify-around items-end col-span-2'>
                        <Button type='submit' theme='Success' >Verificar Transacción</Button>
                        {/* <Button type='button' theme='Success' click={validateTransaction} >Verificar Transacció</Button> */}
                    </div>}

                </div>

                {success == 'CompletePais' && <Msg>Seleccione un pais</Msg>}
            </form>
            : <ModalINFO theme={'Danger'} alert={false} button="Volver" funcion={() => router.replace('/')} close={true} >Por el momento no hay bancos disponibles para tu pais</ModalINFO>
    )
}

export default WithAuth(Home)













// ----DATOS DE REMITENTE----\n
// Remitente: ${object['remitente']},\n
// Dni remitente: ${db['dni remitente']},\n
// Pais remitente: ${db['pais remitente']},\n
// ${db['divisa de envio'] === 'USDT' ?
//                   `Red: ${db['banco remitente']},\n
// Direccion de billetera: ${db['cuenta bancaria']},\n`
//                   : `Banco remitente: ${db['banco remitente']},\n
// Cuenta bancaria: ${db['cuenta bancaria']},\n`}
// Divisa de envio: ${db['divisa de envio']},\n

// -------DATOS DE DESTINATARIO-------\n
// ${db['red'] && db['red'] !== undefined
//                   ? `
// Destinatario: ${db['destinatario']},\n
// DNI destinatario: ${db['dni']},\n
// Pais destinatario: ${db['pais']},\n
// Direccion: ${db['direccion']},\n
// Celular: ${db['celular']},\n
// Direccion de billetera: ${db['direccion de billetera']},\n
// Red: ${db['red']},\n
// Divisa de receptor: ${db['divisa de receptor']},\n`
//                   : `
// Destinatario: ${db['destinatario']},\n
// DNI destinatario: ${db['dni']},\n
// Pais destinatario: ${db['pais']},\n
// Direccion: ${db['direccion']},\n
// Celular: ${db['celular']},\n
// Cuenta destinatario: ${db['cuenta destinatario']},\n
// Nombre de banco: ${db['nombre de banco']},\n
// Divisa de receptor: ${db['divisa de receptor']},\n`
//               }

// ------DATOS DE TRANSACCION-----\n
// Operacion: ${object['operacion']},\n
// Importe: ${object['importe']},\n
// Comision: ${db['comision']},\n
// Cambio: ${db['cambio']},\n
// Estado: ${data?.message && data?.message !== undefined && data.message === 'Verificado con Exito' ? 'Verificado' : 'En verificación'},\n
// fecha: ${object['fecha']},\n

// -----CUENTA RECEPTORA BOTTAK-----\n
// banco bottak: ${db['banco bottak']},\n 









// ` 
// ---------DATOS DE EMISION--------\n
//   Nombre : ${object['remitente']},\n
//   Dni: ${db['dni']},\n
//   Pais: ${db['pais']},\n
//   Celular: ${db['whatsapp']},\n
//   ${db['divisa de usuario'] === 'USDT'
//                     ? `Red: ${db['banco remitente']},\n
//   Direccion de billetera: ${db['cuenta bancaria']},\n`
//                     : `Banco emisor: ${db['banco remitente']},\n
//   Cuenta emisora: ${db['cuenta bancaria']},\n`}
//   Divisa de emision: ${db['divisa de usuario']},\n

// ---------DATOS PARA RECEPCIÓN----------\n
// ${db['red'] && db['red'] !== undefined
//                     ? `Direccion de billetera: ${db['direccion de billetera']},\n
//   Red: ${db['red']},\n
//   Divisa de recepción: ${db['divisa de cambio']},\n`
//                     : `Cuenta receptora: ${db['cuenta destinatario']},\n
//   Banco receptor: ${db['nombre de banco']},\n
//   Divisa de recepción: ${db['divisa de cambio']},\n`
//                 }

// ---------DATOS DE TRANSACCION---------\n
//   Operacion: ${object['operacion']},\n
//   Importe: ${object['importe']},\n
//   Comision: ${db['comision']},\n
//   Cambio: ${db['cambio']},\n
//   Estado: ${data?.message && data?.message !== undefined && data.message === 'Verificado con Exito' ? 'Verificado' : 'En verificación'},\n
//   fecha: ${object['fecha']},\n

// -------CUENTA RECEPTORA BOTTAK-----\n
//   banco bottak: ${db['banco bottak']},\n 
//   `