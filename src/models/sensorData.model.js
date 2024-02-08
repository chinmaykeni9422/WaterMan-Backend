import mongoose, {Schema} from "mongoose";

const sensorDataSchema = new Schema(
    {
        // userId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true,
        // },
        moisture: {
            type: String, 
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const SensorData = mongoose.model("SensorData", sensorDataSchema);

export default SensorData;