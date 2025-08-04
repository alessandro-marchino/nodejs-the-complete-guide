import { expect } from "chai";
import { SinonStub, stub } from 'sinon';
import { User } from "../models/user.js";
import { login } from "../controllers/auth.js";
import { connect } from "mongoose";

describe('Auth Controller', () => {
  describe('Auth Controller - login', () => {
    it('Should throw an error with code 500 if accessing the database fails', done => {
      const findOneStub: SinonStub = stub(User, 'findOne');
      findOneStub.throws();
      const req = { body: { email: 'test@test.com', password: 'tester' } };

      (login(req as any, {} as any, () => {}) as Promise<any>).then(result => {
        expect(result).to.be.an('error');
      }).finally(() => done())

      findOneStub.restore();
    });
  });

  it('Should send a response with valid user status for an existing user', done => {
    const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/test-${process.env.MONGODB_DBNAME}?authSource=${process.env.MONGODB_AUTH_SOURCE}`;
    connect(MONGODB_URI)
      .then(result => {
        // Testing logic
        const user = new User({ email: 'test@test.com', password: 'tester', name: 'Test', posts: [] });
        return user.save()
      })
      .then(user => {

      })
      .catch(err => done(err));
  });
});
