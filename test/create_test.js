const chai = require('chai');
//const assert = require('assert');
const assert = chai.assert;
const expect = chai.expect;
chai.config.truncateThreshold = 0;

const { User } = require('../models/user');
const { Thermostat } = require('../models/thermostat');

describe('Creating documents', () => {
    it('creates a user', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const user = new User({ userName: 'John', email: 'aaa@g.com', password: 'abcde'});
        assert.strictEqual(user.userName, 'john');
        assert.strictEqual(user.email, 'aaa@g.com');
        assert.strictEqual(user.password, 'abcde');
        console.log(user);
        user.save() //takes some time and returns a promise
            .then(() => {
                assert(!user.isNew); //if poke is saved to db it is not new
                done();
            });
        // done();
    });

    it('creates a thermostat', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const thermostat = new Thermostat({ 
          thermostatId: '12345',
          masterDevId: '23456',
          roomName: 'Living room',
          status: true,
          mode: 001,
          setTemp: 22.3,
          weekSchedule: {
            mon: [22.1],
            tue: [22.3],
            wed: [25.3],
            thu: [24.1],
            fri: [22.7],
            sat: [27.1],
            sun: [22.1]
          },
          authedUsers: ['507f191e810c19729de860ea', '333f191e810c19729de860ea']
        });
        console.log(thermostat.authedUsers);

        assert.strictEqual(thermostat.thermostatId, '12345');
        assert.strictEqual(thermostat.masterDevId, '23456');
        assert.strictEqual(thermostat.roomName, 'living room');
        assert.strictEqual(thermostat.status, true);
        assert.strictEqual(thermostat.setTemp, 22.3);
        // assert.strictEqual(thermostat.weekSchedule, {

        // expect(thermostat.weekSchedule).to.deep.equal(weekScheduleExpect);
        // assert.deepEqual(thermostat.weekSchedule, weekScheduleExpect);
        // assert.propertyVal(thermostat.weekSchedule, 'mon', [22.1]);
        // expect(thermostat.weekSchedule).to.have.property('mon', [22.1]);
        // assert(thermostat.authedUsers, ['507f191e810c19729de860ea', '333f191e810c19729de860ea']);
        // thermostat.authedUsers.should.have.id(['507f191e810c19729de860ea', '333f191e810c19729de860ea']);
        // expect(thermostat.weekSchedule).to.include({
        //     mon: [22.1],
        //     tue: [22.3],
        //     wed: [25.3],
        //     thu: [24.1],
        //     fri: [22.7],
        //     sat: [27.1],
        //     sun: [22.1]
        // });


        expect(thermostat.authedUsers).to.include.members(['507f191e810c19729de860ea', '333f191e810c19729de860ea']);
        done();

        // user.save() //takes some time and returns a promise
            // .then(() => {
                // assert(!user.isNew); //if poke is saved to db it is not new
                // done();
            // });
        // done();
    });
});

