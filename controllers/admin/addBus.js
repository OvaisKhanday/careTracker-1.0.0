import busModel from "../../models/bus.js";

export default async function addBus(req, res) {
  const busNoString = req.body.bus ? req.body.bus.bus_no : null;
  const busRegistration = req.body.bus ? req.body.bus.bus_registration : null;
  const instituteId = req.body.payload.institute_id;

  let busNo;
  try {
    busNo = Number.parseInt(busNoString);
  } catch (error) {
    return res.status(400).json({ message: `bus no is not valid: ${error.message}` });
  }

  const newBus = new busModel({
    bus_no: busNo,
    bus_registration: busRegistration,
    institute_id: instituteId,
  });
  console.log(busRegistration);
  console.log(busNo);
  const error = newBus.validateSync();

  // check if there is any validation error
  if (error) {
    res.status(400).json({
      error: {
        bus_registration: error.errors.bus_registration ? error.errors.bus_registration.message : null,
        bus_no: error.errors.bus_no ? error.errors.bus_no.message : null,
      },
    });
    return;
  }

  // if there is no validation error then save the bus only if there is no bus present with
  // either the same registration number or same bus no.
  try {
    const result = await busModel.findOne({
      institute_id: instituteId,
      $or: [{ bus_registration: busRegistration }, { bus_no: busNo }],
    });

    if (result) {
      //   result found there could be possibility of 3 cases:
      //   1. both registration and bus no are matching ---
      //   2. only registration number is matching. ---
      //   3. only bus number is matching.
      //   in any of the cases, abort the saving and prompt the user that he has entered the wrong information.
      return res.status(401).json({
        message: `bus already present with registration ${result.bus_registration} and bus no ${result.bus_no}`,
      });
    }

    // if bus is not available:
    await newBus.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(200).json({
    message: "bus added",
  });
}
