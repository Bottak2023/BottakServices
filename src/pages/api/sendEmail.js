const nodemailer = require('nodemailer');

export default function handler(req, res) {
    console.log(req.body.data)
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "info.bottak@gmail.com",
            pass: "jfqt lhab kpwz lmza",
        },
    });


    // const msg = `<main style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
    //                     <table style="width: 100%; min-width: 50vw; border-radius: 20px; text-align: left; font-size: 14px; color: #6b7280; background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    //                         <thead style="text-align: center; font-weight: bold; background-color: #4b5563; color: white;">
    //                             <tr>
    //                                 <th colspan="2" style="padding: 15px;">
    //                                     Baucher de transacción <br />
    //                                 </th>
    //                             </tr>
    //                         </thead>
    //     ${Object.entries(req.body.data).map((item, index) => <tbody>
    //                 <tr style="background-color: rgba(0, 0, 0, 0.1);">
    //             <td colspan="2" style="padding: 15px; font-weight: bold; background-color: #4b5563;  color: white;">
    //                  {item[0]}
    //                       </td>
    //         </tr>

    //                 {Object.entries(item[1]).map((i, index) =>
    //                        <tr style="background-color: white; border-bottom: 1px solid #e5e7eb;">
    //                        <td style="padding: 15px; background-color: rgba(0, 0, 0, 0.1); font-weight: bold; color: #1f2937;">
    //                          {i[0]}
    //                         </td>
    //                         <td style="padding: 15px; color: #1f2937;">
    //                         {i[1]}
    //                         </td>
    //                     </tr>
    //                 )
    //                 }
    //             </tbody>)
    //                 }
    //                     </table>
    //                 </main>`


    async function handlerSendEmail() {
        try {
            await transporter.sendMail({
                from: 'info.bottak@gmail.com',
                to: req.body.email,
                subject: ` Reporte de transaccion: estado: ${req.body.estado}`,
                // text: req.body.data,
                html: req.body.data,

                // attachments: [
                //     {
                //         filename: `Cotizacion_${req.body.element}.pdf`,
                //         content: req.body.pdfBase64.split("base64,")[1],
                //         encoding: 'base64'
                //     }
                // ]
            });
            return res.json({ msg: 'Send Email SuccessFull' })
        } catch (err) {
            console.log(err)
            return res.json({ msg: `error ${err}` })
        }
    }

    handlerSendEmail()
}