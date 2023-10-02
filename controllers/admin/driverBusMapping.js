// client would send data in an array of mappings
// "mappings" : [
//     {
//         'driver_id': "",
//         'bus_id' : "",
//     },

//     {
//         'driver_id': "",
//         'bus_id' : "",
//     },

//     {
//         'driver_id': "",
//         'bus_id' : "",
//     },

// ]

import busModel from "../../models/bus.js";
import driverModel from "../../models/driver.js";

export default async function driverBusMapping(req, res) {
  const mappings = req.body.mappings;
  const instituteId = req.body.payload.institute_id;

  // check if the driver_id's are unique
  // check if the bus_no and registration pairs are unique.

  if (!mappings || mappings == null || mappings.length === 0) {
    return res.status(400).json({
      message: "empty mapping list",
    });
  }

  for (let i = 0; i < mappings.length; i++) {
    for (let j = i + 1; j < mappings.length; j++) {
      if (mappings[i].driver_id === mappings[j].driver_id || (mappings[i].bus_id === mappings[j].bus_id && mappings[i].bus_id != "nil")) {
        return res.status(400).json({
          message: "duplicate data found",
        });
      }
    }
  }

  // duplicate data is not present
  // change the reference of drivers to the bus alloted to them.
  for (let i = 0; i < mappings.length; i++) {
    // get the bus detail
    try {
      const driver = await driverModel.findOne({ _id: mappings[i].driver_id, institute_id: instituteId });

      if (mappings[i].bus_id == "nil") {
        // remove bus_id from the driver;
        await driverModel.findOneAndUpdate(
          { _id: mappings[i].driver_id, institute_id: instituteId },
          {
            $unset: { bus_id: 1 },
          }
        );
      } else {
        const bus = await busModel.findOne({ _id: mappings[i].bus_id, institute_id: instituteId });

        if (bus !== null && driver !== null) {
          // if they both exist
          // update the reference of driver bus_id to current bus._id;
          await driverModel.findByIdAndUpdate(driver._id, {
            bus_id: bus._id,
          });

          res.status(200).json({
            message: "buses mapped",
          });
        } else {
          res.status(400).json({
            message: "buses did not map",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
