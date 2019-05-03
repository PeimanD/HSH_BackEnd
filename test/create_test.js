const chai = require('chai');
//const assert = require('assert');
const assert = chai.assert;

const { User } = require('../models/user');

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
});
