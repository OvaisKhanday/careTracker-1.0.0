import busModel from "../../models/bus.js";

export default async function updateBuses(req, res) {
  const instituteId = req.body.payload.institute_id;

  const busList = req.body.buses;

  // check if list of buses is empty;
  if (!busList || busList == null || busList.length <= 0) {
    res.status(400).json({
      is_empty: true,
      message: "empty bus list",
    });
    return;
  }
  console.log(busList);

  try {
    for (let i = 0; i < busList.length; i++) {
      busList[i].bus_no = Number.parseInt(busList[i].bus_no);
    }
  } catch (error) {
    return res.status(400).json({ message: `bus no sent invalid :${error.message}` });
  }

  // check if there are any duplicate data in the bus no's
  for (let i = 0; i < busList.length; i++) {
    for (let j = i + 1; j < busList.length; j++) {
      if (busList[i].bus_no == busList[j].bus_no || busList[i].bus_registration == busList[j].bus_registration) {
        res.status(400).json({
          is_empty: false,
          message: `bus no: ${busList[i]} or registration no: ${busList[i].bus_registration} is repeating`,
        });
        return;
      }
    }
  }

  // we know that bus No's are consistent.
  // we could start updating them.

  // let's check validation of each data item.
  for (let i = 0; i < busList.length; i++) {
    const newBus = new busModel({
      bus_registration: busList[i].bus_registration,
      bus_no: busList[i].bus_no,
      institute_id: instituteId,
    });

    const error = newBus.validateSync();
    if (error) {
      res.status(400).json({
        type: "invalid data",
        message: {
          bus_registration: error.errors.bus_registration ? error.errors.bus_registration.message : null,
          bus_no: error.errors.bus_no ? error.errors.bus_no.message : null,
        },
      });
      return;
    }
  }

  // now data is validated it needs to be updated inside the database.
  for (let i = 0; i < busList.length; i++) {
    // if data is valid.
    try {
      await busModel.findOneAndUpdate(
        { _id: busList[i]._id, institute_id: instituteId },
        {
          bus_no: busList[i].bus_no,
          bus_registration: busList[i].bus_registration,
        }
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
      return;
    }
  }
  res.status(200).json({
    message: "buses updated",
  });
}
