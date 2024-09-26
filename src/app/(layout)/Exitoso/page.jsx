'use client'

import { writeUserData, getSpecificData } from '@/firebase/database'
import { useEffect, useState } from 'react'
import { useUser } from '@/context/Context.js'
import { getDayMonthYear } from '@/utils/date'
import { WithAuth } from '@/HOCs/WithAuth'
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'
import Confeti from '@/components/Confeti';
import QRCode from "qrcode.react";
import { useSearchParams } from 'next/navigation'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDownloadLink } from '@react-pdf/renderer'
const InvoicePDF = dynamic(() => import("@/components/PDFprint"), {
    ssr: false,
});















function Home() {
    const { nav, setNav, user, userDB, QRurl, setQRurl, transactionDB, setTransactionDB } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = searchParams.get('uuid')
    const operacion = searchParams.get('operacion')



    // const handleExport = () => {
    //     const input = document.getElementById('table-to-export');

    //     html2canvas(input, { scale: 2 }).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'letter'); // Configuración para tamaño carta

    //         const padding = 20; // Padding uniforme en mm
    //         const imgWidth = pdf.internal.pageSize.getWidth() - 2 * padding; // Ancho ajustado por el padding
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         let heightLeft = imgHeight;

    //         let position = padding; // Padding superior

    //         pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight);
    //         heightLeft -= pdf.internal.pageSize.height - padding * 2; // Ajustar la altura restante

    //         while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight + padding; // Ajustar para el padding superior
    //             pdf.addPage();
    //             pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight);
    //             heightLeft -= pdf.internal.pageSize.height - padding * 2; // Ajustar la altura restante
    //         }

    //         pdf.save('tabla.pdf');
    //     });
    // };


    console.log(QRurl)


    const datosEnvio =transactionDB
    ? {
        'DATOS DE REMITENTE': {
            Nombre: transactionDB['remitente'],
            Dni: transactionDB['dni remitente'],
            Pais: transactionDB['pais remitente'],
            Wanco: transactionDB['banco remitente'],
            'Nombre Banco': transactionDB['nombre de banco'],
            'Cuenta Bancaria': transactionDB['cuenta bancaria'],
            'Divisa Envio': transactionDB['divisa de envio']
        },
        'DATOS DE DESTINATARIO': {
            Nombre: transactionDB['destinatario'],
            Dni: transactionDB['dni'],
            Pais: transactionDB['pais'],
            Direccion: transactionDB['direccion'],
            Celular: transactionDB['celular'],
            'Cuenta Destinatario': transactionDB['cuenta destinatario'],
            'Nombre Banco': transactionDB['nombre de banco'],
            'Divisa Receptor': transactionDB['divisa de receptor'],
            'ID de tracking': transactionDB.uuid

        },
        'DATOS DE TRANSACCION': {
            Operacion: transactionDB['operacion'],
            Importe: transactionDB['importe'],
            Comision: transactionDB['comision'],
            Cambio: transactionDB['cambio'],
            Estado: (transactionDB?.message && transactionDB.message === 'Verificado con Exito') ? 'Verificado' : 'En verificación',
            Fecha: transactionDB['fecha']
        },
        'CUENTA RECEPTORA BOTTAK': {
            'Banco Transferencia': transactionDB['banco de transferencia']
        }
    }
    :{};








    const datosCambio = transactionDB
        ? {
            'DATOS DE EMISION': {
                Nombre: transactionDB['remitente'],
                Dni: transactionDB['dni'],
                Pais: transactionDB['pais'],
                Celular: transactionDB['whatsapp'],
                'Banco Emisor': transactionDB['banco remitente'],
                'Cuenta Emisora': transactionDB['cuenta bancaria'],
                'Divisa Emision': transactionDB['divisa de usuario']
            },
            'DATOS PARA RECEPCIÓN': {
                'Cuenta Receptora': transactionDB['cuenta destinatario'],
                'Banco Receptor': transactionDB['nombre de banco'],
                'Divisa Recepcion': transactionDB['divisa de cambio']
            },
            'DATOS DE TRANSACCION': {
                Operacion: transactionDB['operacion'],
                Importe: transactionDB['importe'],
                Comision: transactionDB['comision'],
                Cambio: transactionDB['cambio'],
                Estado: (transactionDB?.message && transactionDB.message === 'Verificado con Exito') ? 'Verificado' : 'En verificación',
                Fecha: transactionDB['fecha'],
                'ID de tracking': transactionDB.uuid

            },
            'CUENTA RECEPTORA BOTTAK': {
                'Banco Transferencia': transactionDB['banco de transferencia']
            }
        }
        : {}

    useEffect(() => {
        transactionDB !== undefined && QRurl === null && document.getElementById('qr') && setQRurl(document.getElementById('qr').toDataURL())
    }, [transactionDB])
    useEffect(() => {
        getSpecificData(`/${operacion}/${pathname}`, setTransactionDB)
    }, [])

    return (
        transactionDB && transactionDB !== undefined && <main className='w-full flex justify-center'>
            <Confeti />
            <div className='  flex flex-col justify-center'>
                <div className='relative  sm:max-h-[80vh] overflow-y-auto rounded-[0px]' id="table-to-export" >
                    {transactionDB.operacion === 'Envio'
                        && <table className="w-full lg:min-w-[50vw] text-[14px] text-left text-gray-500 rounded-[0px]">
                            <thead className="text-[14px] text-center font-semibold border-b bg-gray-800 text-white">
                                <tr>
                                    <th scope="col" className="px-3 py-3" colSpan="2">
                                        Baucher de transacción <br />
                                        <div className='w-[150px] h-[150px] relative left-0 right-0 my-5 mx-auto '>
                                            {transactionDB.uuid && <QRCode
                                                id='qr'
                                                size={256}
                                                style={{ height: "auto", maxWidth: "100%", width: "100%", border: 'none', }}
                                                value={transactionDB.uuid}
                                                level={'H'}
                                                includeMargin={true}
                                                renderAs={'canvas'}
                                                viewBox={`0 0 256 256`}
                                            // imageSettings={{
                                            //     src: '/favicon.png',
                                            //     width: 100,
                                            //     height: 100,
                                            //     escavate: false
                                            // }}
                                            />}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            {Object.entries(datosEnvio).map((item, index) => <tbody>
                                <tr className=" text-[14px] bg-gray-800 border-b" >
                                    <td scope="col" colSpan="2" className="px-3 py-3  bg-[#00000020] font-bold text-[14px] text-white  ">
                                        {item[0]}
                                    </td>
                                </tr>

                                {Object.entries(item[1]).map((i, index) =>
                                    <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                        <td className="px-3 py-3 w-[50%] bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                            {i[0]}
                                        </td>
                                        <td className="px-3 py-3 w-[50%] text-gray-900 ">
                                            {i[1]}
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>)
                            }
                            {/* <tbody>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900 ">
                                        Remitente
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.remitente && transactionDB.remitente}
                                    </td>
                                </tr>
                            <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        DNI remitente
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB['dni remitente'] && transactionDB['dni remitente']}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Pais remitente
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB['pais remitente'] && transactionDB['pais remitente']}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Destinatario
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.destinatario && transactionDB.destinatario}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        DNI destinatario
                                    </td>
                                    <td className="px-2 py-2  text-gray-900 ">
                                        {transactionDB.dni && transactionDB.dni}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Pais destinatario
                                    </td>
                                    <td className="px-2 py-2  text-gray-900 ">
                                        {transactionDB.pais && transactionDB.pais}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Celular de destinatario
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.celular && transactionDB.celular}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Cuenta de destinatario:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB['cuenta destinatario'] && transactionDB['cuenta destinatario']}
                                    </td>
                                </tr>

                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Importe mas comision:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.importe && transactionDB.importe} {transactionDB['divisa de envio'] && (transactionDB['divisa de envio'] === 'USD' ? 'USDT' : transactionDB['divisa de envio'])}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Comision:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.comision} {transactionDB['divisa de envio'] && (transactionDB['divisa de envio'] === 'USD' ? 'USDT' : transactionDB['divisa de envio'])}
                                    </td>
                                </tr>

                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Importe mas comision con el cambio aplicado:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.cambio && transactionDB.cambio} {transactionDB['divisa de receptor'] && (transactionDB['divisa de receptor'] === 'USD' ? 'USDT' : transactionDB['divisa de receptor'])}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Fecha:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.fecha && transactionDB.fecha}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Estado:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        <span className={`w-full block  px-2 rounded-[10px] ${transactionDB.estado == 'En verificación' && 'bg-gray-100'}   ${transactionDB.estado == 'Transfiriendo' && 'bg-yellow-300'}   ${transactionDB.estado == 'Exitoso' && 'bg-green-400'} ${transactionDB.estado == 'Rechazado' && 'bg-red-400'}`}>{transactionDB.estado}</span>
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                        Operacion:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.operacion && transactionDB.operacion}
                                    </td>
                                </tr>
                                <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                    <td className="px-3 py-3 flex flex-col bg-[#00000020] font-bold text-[14px] text-gray-900 ">
                                        ID de tracking:
                                    </td>
                                    <td className="px-3 py-3 text-gray-900 ">
                                        {transactionDB.uuid}
                                    </td>
                                </tr> 
                            </tbody> */}
                        </table>
                    }
                    {transactionDB.operacion === 'Cambio'
                        && <table className="w-full lg:min-w-[50vw] text-[14px] text-left text-gray-500 rounded-[20px]">
                            <thead className="text-[14px] text-center font-semibold border-b bg-gray-800 text-white">
                                <tr>
                                    <th scope="col" className="px-3 py-3" colSpan="2">
                                        Baucher de transacción <br />
                                        <div className='w-[150px] h-[150px] relative left-0 right-0 my-5 mx-auto '>
                                            {transactionDB.uuid && <QRCode
                                                id='qr'
                                                size={256}
                                                style={{ height: "auto", maxWidth: "100%", width: "100%", border: 'none', }}
                                                value={transactionDB.uuid}
                                                level={'H'}
                                                includeMargin={true}
                                                renderAs={'canvas'}
                                                viewBox={`0 0 256 256`}
                                            // imageSettings={{
                                            //     src: '/favicon.png',
                                            //     width: 100,
                                            //     height: 100,
                                            //     escavate: false
                                            // }}
                                            />}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            {Object.entries(datosCambio).map((item, index) => <tbody>
                                <tr className=" text-[14px] bg-gray-800 border-b" >
                                    <td scope="col" colSpan="2" className="px-3 py-3  bg-[#00000020] font-bold text-[14px] text-white  ">
                                        {item[0]}
                                    </td>
                                </tr>

                                {Object.entries(item[1]).map((i, index) =>
                                    <tr className="bg-white text-[14px] border-b hover:bg-gray-50 " >
                                        <td className="px-3 py-3 w-[50%] bg-[#00000020] font-bold text-[14px] text-gray-900  ">
                                            {i[0]}
                                        </td>
                                        <td className="px-3 py-3 w-[50%] text-gray-900 ">
                                            {i[1]}
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>)
                            }
                        </table>
                    }

                </div>
                {QRurl !== '' && <InvoicePDF transactionDB={transactionDB.operacion === 'Cambio'?datosCambio :datosEnvio} QRurl={QRurl}></InvoicePDF>
                }
                {/* {QRurl !== '' && <InvoicePDF transactionDB={transactionDB}></InvoicePDF>}
    {QRurl !== '' && <button onClick={handleExport} className="relative left-0 right-0 mx-auto mt-4 px-10 py-2  bg-red-500 text-white rounded">
        Exportar a PDF
    </button>} */}
            </div>
        </main >



    )
}

export default WithAuth(Home)
