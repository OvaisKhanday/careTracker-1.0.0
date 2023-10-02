import driverModel from "../../models/driver.js";

export default async function updateDriver(req, res) {
  // update the driver details on the basis of his _id.

  // update the name, phone_no, age, residence
  const newDriver = req.body.driver;
  const idOfExistingDriver = req.body._id;
  const instituteId = req.body.payload.institute_id;

  if (!newDriver || !idOfExistingDriver) {
    return res.status(404).json({ message: "driver details not found" });
  }

  try {
    // find the driver
    var newDriverAge = Number.parseInt(newDriver.age);
    const driverToBeAddedToDatabase = new driverModel({
      name: newDriver.name,
      age: newDriverAge,
      phone_no: newDriver.phone_no,
      residence: newDriver.residence,
      institute_id: instituteId,
    });
    let error = driverToBeAddedToDatabase.validateSync();

    if (error) {
      res.status(400).json({
        error: {
          name: error.errors.name ? error.errors.name.message : null,
          age: error.errors.age ? error.errors.age.message : null,
          phone_no: error.errors.phone_no ? error.errors.phone_no.message : null,
          residence: error.errors.residence ? error.errors.residence.message : null,
        },
        message: returnInvalidDataError(error.errors),
      });
      return;
    }

    await driverModel.updateOne(
      { _id: idOfExistingDriver, institute_id: instituteId },
      {
        name: newDriver.name,
        age: newDriver.age,
        phone_no: newDriver.phone_no,
        residence: newDriver.residence,
      }
    );

    res.status(200).json({
      message: "driver updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
}

function returnInvalidDataError(errors) {
  if (errors.name) {
    return `name: ${errors.name.message}`;
  } else if (errors.residence) {
    return `residence: ${errors.residence.message}`;
  } else if (errors.phone_no) {
    return `phone: ${errors.phone_no.message}`;
  } else if (errors.age) {
    return `age: ${errors.age.message}`;
  } else if (errors.institute_id) {
    return `institute: ${errors.institute_id.message}`;
  } else return "Something wrong with driver details";
}
