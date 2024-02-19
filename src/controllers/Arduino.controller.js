import User from "../models/user.model.js";

const handleData =  async (data, Id) => {

    try {

        const moistureData = JSON.parse(data);

        const existingData = await User.findById(Id);

        if (existingData) {
            // Update the existing document
            existingData.moisture = moistureData.moisture;
            const updateData = await existingData.save();
            // console.log("Moisture data updated for user:", updateData.moisture);
        } else {
            console.log("no existing user found")
        }

    } catch (error) {

        if (error instanceof SyntaxError) {
            console.error("Invalid moisture data received. Error:", error.message);
        } else {
            console.error("Error handling moisture data:", error);
        }
        
    }

}

export {handleData} ;