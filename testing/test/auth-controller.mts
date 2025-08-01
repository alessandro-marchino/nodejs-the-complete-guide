import { expect } from "chai";
import { SinonStub, stub } from 'sinon';
import { User } from "../models/user.js";
import { login } from "../controllers/auth.js";

describe('Auth Controller', () => {
  describe('Auth Controller - login', () => {
    it('Should throw an error with code 500 if accessing the database fails', () => {
      const findOneStub: SinonStub = stub(User, 'findOne');
      findOneStub.throws();

      expect(() => login({} as any, {} as any, () => {})).to.throw();

      findOneStub.restore();
    });
  });
});
