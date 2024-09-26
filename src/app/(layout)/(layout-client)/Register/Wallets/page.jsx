'use client'

import { writeUserData } from '@/firebase/database'
import { useUser } from '@/context/Context.js'
import Input from '@/components/Input'
import SelectCountry from '@/components/SelectCountry'
import SelectBank from '@/components/SelectBank'
import Select from '@/components/Select'

import Label from '@/components/Label'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import Msg from '@/components/Msg'
import { useMask } from '@react-input/mask';
import { useRouter } from 'next/navigation';
import { WithAuth } from '@/HOCs/WithAuth'
import { getDayMonthYear } from '@/utils/date'
import { generateUUID } from '@/utils/UUIDgenerator'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
function Home() {

    const { nav, setNav, user, userDB, countries, setUserProfile, select, wallets, setDestinatario, isSelect3, setIsSelect3, isSelect4, setIsSelect4, select3, setSelect3, setSelect, select2, setSelect2, isSelect, setIsSelect, isSelect2, setIsSelect2, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, modal, setModal, setTransferencia, transferencia, divisas, setDivisas, destinatario, qr, setQr, QRurl, setQRurl, } = useUser()
    const [cca3, setCca3] = useState(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = searchParams.get('operacion')

    const [postImage, setPostImage] = useState(undefined)
    const [pagosQR, setPagosQR] = useState(undefined)
    const [urlPostImage, setUrlPostImage] = useState(undefined)
    const [payDB, setPayDB] = useState(undefined)
    function onChangeHandler(e) {
        setDestinatario({ ...destinatario, [e.target.name]: e.target.value })
    }


    function manageInputIMG(e) {
        const file = e.target.files[0]
        setPostImage(file)
        setUrlPostImage(URL.createObjectURL(file))
    }

    const handlerIsSelect5 = () => {
        setIsSelect5(!isSelect5)
    }


    function onChangeHandler(e) {
        setDestinatario({ ...destinatario, [e.target.name]: e.target.value })
    }

    const redirectHandler = (route, data) => {
        setDestinatario(data)
        router.replace(route)
    }
    function handlerSelect(name, i, uuid) {
        setDestinatario({ ...destinatario,  [name]: i })
      }
    function save(e) {
        e.preventDefault()
        e.stopPropagation()

        const uuid = generateUUID()
        const destinatarioDB = {["direccion de billetera"]: Object.values(wallets).map(i => i.network)[0], ...destinatario, uuid, operacion: pathname ? pathname : destinatario.operacion }
        setModal('Guardando...')
        const callback = () => {
            redirectHandler( pathname === 'Cambio' ?'/ConfirmCambio':'/Confirm', destinatarioDB)
            setModal('')
        }
        
        
        postImage !== undefined 
        ? uploadStorage(`users/${user.uid}/wallets/${uuid}`, postImage,  { ...destinatario, uuid }, callback)
        : writeUserData(`users/${user.uid}/wallets/${uuid}`, { ...destinatario, uuid }, setUserSuccess, callback)
    }



    console.log(userDB)
    return (
        <div className='md:pl-5'>
            <form className='w-full min-h-[80vh] space-y-6 lg:grid lg:grid-cols-2 lg:gap-5  rounded-[5px] md:max-h-[80vh] overflow-y-auto overflow-x-hidden' onSubmit={save}>
                {modal === 'Guardando...' && <Loader> {modal} </Loader>}
                <div className='w-full border-b-[2px] border-gray-100 col-span-2'>
                    <h3 className=' pb-3 text-white  text-right'>Registrar nuevo Wallet</h3>
                </div>
             
                <div className=' space-y-5'>
                    <Label htmlFor="">Red</Label>
                    <Select name="pais" defaul={Object.values(wallets).map(i => i.network)[0]} arr={Object.values(wallets).map(i => i.network)} click={handlerSelect} uuid='123312'/>
                </div>
                <div className=' space-y-5'>
                    <Label htmlFor="">Direccion de billtera o QR</Label>
                    <Input type="text" name="direccion de billetera" onChange={onChangeHandler} required />

                    <div className=' space-y-5'>
                        <div className="w-full flex justify-center">
                            <label htmlFor="file" className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-300 border-dotted text-center text-gray-900 text-[14px] focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                {urlPostImage !== undefined ? <img className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={urlPostImage} alt="" />
                                    : 'Subir QR de recepcion de cambio'}
                            </label>
                            <input className="hidden" id='file' name='name' onChange={manageInputIMG} accept=".jpg, .jpeg, .png, .mp4, webm" type="file" required />
                        </div>
                    </div>

                    <div className='flex w-full justify-around items-end'>
                        <Button theme='Primary' >Guardar</Button>
                    </div>
                </div>
                {success == 'CompletePais' && <Msg>Seleccione un pais</Msg>}
            </form>
        </div>
    )
}

export default WithAuth(Home)