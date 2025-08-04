import { expect } from "chai";
import { SinonStub, stub } from 'sinon';
import { User } from "../models/user.js";
import { getUserStatus, login } from "../controllers/auth.js";
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
    connect('mongodb://test-postapp:mypass@localhost:27017/test-postapp?authSource=test-postapp')
      .then(result => {
        console.log('connected')
        // Testing logic
        const user = new User({ email: 'test@test.com', password: 'tester', name: 'Test', posts: [], _id: '5c0f66b979af55031b34728a' });
        return user.save()
      })
      .then(user => {
        const req = { userId: '5c0f66b979af55031b34728a' } as any;
        const res = {
          statusCode: 500,
          userStatus: null,
          status(code: number) {
            this.statusCode = code;
            return this;
          },
          json(obj: any) {
            this.userStatus = obj.status
            return this;
          }
        } as any;
        return (getUserStatus(req, res, () => {}) as Promise<any>)
          .then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
          })
      })
      .catch(err => done(err));
  });
});
