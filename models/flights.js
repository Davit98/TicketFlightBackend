const path = process.cwd();
const Airport = require(`${path}/schemas/airports.js`);
const Flight = require(`${path}/schemas/flights.js`);
const AirportResource = require(`${path}/schemas/airport.resources.js`);



async function createAirportResource(departureTerminal, departureGate, arrivalTerminal, arrivalGate, baggageClaim) {
    const airportResource = new AirportResource.AirportResource({
        departureTerminal: departureTerminal,
        departureGate: departureGate,
        arrivalTerminal: arrivalTerminal,
        arrivalGate: arrivalGate,
        baggageClaim: baggageClaim
    });

    try {
        await airportResource.save();
        return airportResource;
    } catch (err) {
        throw err;
    }
}

async function createAirport(shortName, name, cityName, countryName, weatherURL) {
    const airport = new Airport.Airport({
        shortName: shortName,
        name: name,
        cityName: cityName,
        countryName: countryName,
        weatherURL: weatherURL
    });
    try {
        await airport.save();
        return airport;
    } catch (err) {
        throw err;
    }
}

async function createFlight(body) {

    const airportResource = await createAirportResource(
        body.flightStatuses[0].airportResources.departureTerminal, body.flightStatuses.airportResources.departureGate,
        body.flightStatuses[0].airportResources.arrivalTerminal,
        body.flightStatuses[0].airportResources.arrivalGate, body.flightStatuses.airportResources.baggageClaim);

    const departureAirport = await createAirport(
        body.appendix.airports[0].fs,
        body.appendix.airports[0].name,
        body.appendix.airports[0].city,
        body.appendix.airports[0].countryName,
        body.appendix.airports[0].weatherUrl
    );
    const arrivalAirport = await createAirport(
        body.appendix.airports[1].fs,
        body.appendix.airports[1].name,
        body.appendix.airports[1].city,
        body.appendix.airports[1].countryName,
        body.appendix.airports[1].weatherUrl
    );
    let airline;
    if (body.flightStatuses.carrierFsCode === body.appendix.airlines[0].fs) {
        airline = body.appendix.airlines[0].name;
    }

    const flight = new Flight({
        flightCode: body.flightStatuses.carrierFsCode.append(body.flightStatuses.flightNumber),
        flightId: body.flightStatuses.flightId,
        airline: airline,
        departureDate: body.flightStatuses.departureDate.dateLocal,
        arrivalDate: body.flightStatuses.arrivalDate.dateLocal,
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        airportResource: airportResource,
        delay: body.flightStatuses.delays.arrivalGateDelayMinutes

    });
    try {
        await flight.save();
        return flight;
    } catch (err) {
        throw err;
    }

}
module.exports = {
    createFlight
}