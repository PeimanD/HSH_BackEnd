const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
chai.config.truncateThreshold = 0;

const { User } = require("../models/user");
const {
  Thermostat,
  DayLog,
  validateThermostat
} = require("../models/thermostat");

describe("Creating documents", () => {
  it("creates a user", done => {
    const user = new User({
      userName: "John",
      email: "aaa@g.com",
      password: "abcde"
    });
    assert.strictEqual(user.userName, "john");
    assert.strictEqual(user.email, "aaa@g.com");
    assert.strictEqual(user.password, "abcde");
    console.log(user);

    done();
  });

  it("creates a thermostat", done => {
    const thermostat = new Thermostat({
      thermostatId: "12345",
      masterDevId: "23456",
      roomName: "Living room",
      status: true,
      mode: 001,
      setTemp: 22.3,
      weekSchedule: {
        mon: [22.1, 23.5],
        tue: [22.3],
        wed: [25.3],
        thu: [24.1],
        fri: [22.7],
        sat: [27.1],
        sun: [22.1]
      },
      authedUsers: ["507f191e810c19729de860ea", "333f191e810c19729de860ea"]
    });
    console.log(thermostat.authedUsers);

    assert.strictEqual(thermostat.thermostatId, "12345");
    assert.strictEqual(thermostat.masterDevId, "23456");
    assert.strictEqual(thermostat.roomName, "living room");
    assert.strictEqual(thermostat.status, true);
    assert.strictEqual(thermostat.setTemp, 22.3);

    expect(thermostat.weekSchedule).to.deep.include({
      mon: [22.1, 23.5],
      tue: [22.3],
      wed: [25.3],
      thu: [24.1],
      fri: [22.7],
      sat: [27.1],
      sun: [22.1]
    });

    expect(thermostat.authedUsers).to.include.members([
      "507f191e810c19729de860ea",
      "333f191e810c19729de860ea"
    ]);
    validateThermostat(thermostat);

    done();
  });

  it("creates a daylog", done => {
    const daylog = new DayLog({
      year: 2019,
      month: 5,
      day: 21,
      thermostatId: "12345",
      dayTemps: [21.2],
      dayAmbientTemps: [19.2],
      5: [true],
      minsOn: [5.5, 0, 0, 0, 0, 0, 0, 0],
      minsSaved: [4.5]
    });

    done();
  });
});
