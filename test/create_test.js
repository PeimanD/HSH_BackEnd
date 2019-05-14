const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
chai.config.truncateThreshold = 0;

const { User, validateUser } = require("../models/user");
const { Thermostat, validateNewThermostat } = require("../models/thermostat");
const { DayLog, validateDayLog } = require("../models/log");

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

    let result = validateUser(user.toObject());
    assert.strictEqual(result.error, null);

    done();
  });

  it("creates a thermostat", done => {
    const thermostat = new Thermostat({
      thermostatId: "12345",
      masterDevId: "23456",
      roomName: "Living room",
      status: true,
      mode: 1,
      setTemp: 22.3,
      currentTemp: 21.3,
      authedUsers: ["507f191e810c19729de860ea", "333f191e810c19729de860ea"]
    });

    assert.strictEqual(thermostat.thermostatId, "12345");
    assert.strictEqual(thermostat.masterDevId, "23456");
    assert.strictEqual(thermostat.roomName, "living room");
    assert.strictEqual(thermostat.status, true);
    assert.strictEqual(thermostat.setTemp, 22.3);
    assert.strictEqual(thermostat.currentTemp, 21.3);

    const testSchData = new Array(24).fill(20);

    expect(thermostat.weekSchedule).to.deep.include({
      mon: testSchData,
      tue: testSchData,
      wed: testSchData,
      thu: testSchData,
      fri: testSchData,
      sat: testSchData,
      sun: testSchData
    });

    expect(thermostat.authedUsers).to.include.members([
      "507f191e810c19729de860ea",
      "333f191e810c19729de860ea"
    ]);

    const result = validateNewThermostat(thermostat.toObject());
    assert.strictEqual(result.error, null);

    done();
  });

  it("creates a daylog", done => {
    const testTempData = new Array(144).fill(0);
    const testBoolData = new Array(144).fill(false);

    const daylog = new DayLog({
      year: 2019,
      month: 5,
      day: 21,
      masterDevId: "23456",
      thermostatId: "12345"
    });

    assert.strictEqual(daylog.year, 2019);
    assert.strictEqual(daylog.month, 5);
    assert.strictEqual(daylog.day, 21);
    assert.strictEqual(daylog.thermostatId, "12345");
    assert.strictEqual(daylog.masterDevId, "23456");

    expect(daylog.cTemps).to.deep.include.members(testTempData);
    expect(daylog.oTemps).to.deep.include.members(testTempData);
    expect(daylog.sTemps).to.deep.include.members(testTempData);
    expect(daylog.isOn).to.deep.include.members(testBoolData);
    expect(daylog.minsOn).to.deep.include.members(testTempData);
    expect(daylog.minsSaved).to.deep.include.members(testTempData);

    const result = validateDayLog(daylog.toObject());
    assert.strictEqual(result.error, null);

    done();
  });
});
