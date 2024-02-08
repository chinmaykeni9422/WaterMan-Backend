import SensorData from "../models/sensorData.model.js";

const handleData =  async (data) => {

    try {

        const moistureData = JSON.parse(data);

        const sensorObject = await SensorData.create({
            moisture: moistureData.moisture
        });

        console.log("Moisture data received and stored for user:", sensorObject);

    } catch (error) {

        console.error("Error handling moisture data:", error);
        
    }

}

export {handleData} ;