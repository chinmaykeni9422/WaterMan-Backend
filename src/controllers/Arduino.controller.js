import User from "../models/user.model.js";
import nodemailer from "nodemailer"

const handleData =  async (data, Id) => {

    try {

        const sensorData = JSON.parse(data);

        const existingData = await User.findById(Id);

        if (existingData) {
            // Update the existing document
            existingData.PH = sensorData.PH;     
            existingData.Turbudity = sensorData.Turbudity;
            existingData.Tempreture = sensorData.Tempreture;
            existingData.flowMeter = sensorData.flowMeter;

            const updateData = await existingData.save();
            console.log(updateData);

          //---------------------------------------------------------------
            // Call the sendEmail function with the userEmail
            if (updateData.PH < 6.50 && updateData.Turbudity <= 10 ){
                const subject = 'PH and Turbudity Alert';
                const text = `
                  PH is ${updateData.PH} which is low !!! water is ACIDIC,
                  Turbudity is ${updateData.Turbudity} which is normal therefore water is clean,
                  tempreture is ${updateData.Tempreture} °C ,
                  Total quantity of water till Now ${updateData.flowMeter} L/min
                `;
            
                // Send an email to the logged-in user
                sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if(updateData.PH < 6.50 && (updateData.Turbudity > 10 && updateData.Turbudity <= 15)){
                const subject = 'PH and Turbudity Alert';
                const text = `
                  PH is ${updateData.PH} which is low !!! water is ACIDIC,
                  Turbudity is ${updateData.Turbudity} which is less turbudity therefore water is cloudy,
                  tempreture is ${updateData.Tempreture} °C ,
                  Total quantity of water till Now ${updateData.flowMeter} L/min
                `;
            
                // Send an email to the logged-in user
                sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if(updateData.PH < 6.50 && updateData.Turbudity > 15){
                const subject = 'PH and Turbudity Alert';
                const text = `
                  PH is ${updateData.PH} which is low !!! water is ACIDIC,
                  Turbudity is ${updateData.Turbudity} which is more turbudity therefore water is dirty,
                  tempreture is ${updateData.Tempreture} °C ,
                  Total quantity of water till Now ${updateData.flowMeter} L/min
                `;
            
                // Send an email to the logged-in user
                sendEmail(process.env.TOEMAIL, subject, text);
            }
            // else if((updateData.PH >= 6.50 && updateData.PH <= 7.50) && updateData.Turbudity <= 10){
            //     const subject = 'PH and Turbudity Alert';
            //     const text = `
            //       PH is ${updateData.PH} which is normal !!! water is NEUTRAL,
            //       Turbudity is ${updateData.Turbudity} which is normal therefore water is clean,
            //       tempreture is ${updateData.Tempreture} °C ,
            //       Total quantity of water till Now ${updateData.flowMeter} L/min
            //     `;
            
            //     // Send an email to the logged-in user
            //     sendEmail(process.env.TOEMAIL, subject, text);
            // }
            else if((updateData.PH >= 6.50 && updateData.PH <= 7.50) && (updateData.Turbudity > 10 && updateData.Turbudity <= 15)){
                const subject = 'PH and Turbudity Alert';
                const text = `
                  PH is ${updateData.PH} which is normal !!! water is NEUTRAL,
                  Turbudity is ${updateData.Turbudity} which is less turbudity therefore water is cloudy,
                  tempreture is ${updateData.Tempreture} °C ,
                  Total quantity of water till Now ${updateData.flowMeter} L/min
                `;
            
                // Send an email to the logged-in user
                sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if((updateData.PH >= 6.50 && updateData.PH <= 7.50) && updateData.Turbudity > 15){
              const subject = 'PH and Turbudity Alert';
              const text = `
                PH is ${updateData.PH} which is normal !!! water is NEUTRAL,
                Turbudity is ${updateData.Turbudity} which is more turbudity therefore water is dirty,
                tempreture is ${updateData.Tempreture} °C ,
                Total quantity of water till Now ${updateData.flowMeter} L/min
              `;
          
              // Send an email to the logged-in user
              sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if(updateData.PH > 7.50 && updateData.Turbudity <= 10){
              const subject = 'PH and Turbudity Alert';
              const text = `
                PH is ${updateData.PH} which is high !!! water is BASIC,
                Turbudity is ${updateData.Turbudity} which is normal therefore water is clean,
                tempreture is ${updateData.Tempreture} °C ,
                Total quantity of water till Now ${updateData.flowMeter} L/min
              `;
          
              // Send an email to the logged-in user
              sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if(updateData.PH > 7.50 && (updateData.Turbudity > 10 && updateData.Turbudity <= 15)){
              const subject = 'PH and Turbudity Alert';
              const text = `
                PH is ${updateData.PH} which is high !!! water is BASIC,
                Turbudity is ${updateData.Turbudity} which is less turbudity therefore water is cloudy,
                tempreture is ${updateData.Tempreture} °C ,
                Total quantity of water till Now ${updateData.flowMeter} L/min
              `;
          
              // Send an email to the logged-in user
              sendEmail(process.env.TOEMAIL, subject, text);
            }
            else if(updateData.PH > 7.50 && updateData.Turbudity > 15){
              const subject = 'PH and Turbudity Alert';
              const text = `
                PH is ${updateData.PH} which is high !!! water is BASIC,
                Turbudity is ${updateData.Turbudity} which is more turbudity therefore water is dirty,
                tempreture is ${updateData.Tempreture} °C ,
                Total quantity of water till Now ${updateData.flowMeter} L/min
              `;
          
              // Send an email to the logged-in user
              sendEmail(process.env.TOEMAIL, subject, text);
            }
          
          
            //---------------------------------------------------------------

        } else {
            console.log("no existing user found")
        }

    } catch (error) {

        if (error instanceof SyntaxError) {
            console.error("Invalid sensor data received. Error:", error.message);
        } else {
            console.error("Error handling sensor data:", error);
        }
        
    }

}

// Function to send email
const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.USEREMAILPASSWORD
      }
    });
  
    const mailOptions = {
      from: process.env.USEREMAIL,
      to: to,
      subject: subject,
      text: text,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

export {handleData} ;