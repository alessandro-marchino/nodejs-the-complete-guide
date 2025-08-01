import { expect } from "chai";
import { SinonStub, stub } from 'sinon';
import { User } from "../models/user.js";
import { login } from "../controllers/auth.js";

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
});
