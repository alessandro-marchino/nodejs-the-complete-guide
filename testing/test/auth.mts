import { expect } from "chai";
import { isAuth } from "../middleware/auth.js";

describe('Auth middleware', () => {
  it('Should throw an error if no Authorization header is present', () => {
    const req = { get() { return null } };
    expect(() => isAuth(req as any, {} as any, () => {})).to.throw('Not authenticated.');
  });

  it('Should throw an error if the Authorization header is only one string', () => {
    const req = { get() { return 'xyz' } };
    expect(() => isAuth(req as any, {} as any, () => {})).to.throw();
  });

  it('Should throw an error if the token cannot be verified', () => {
    const req = { get() { return 'Bearer xyz' } };
    expect(() => isAuth(req as any, {} as any, () => {})).to.throw();
  });

  it('Should yield a user id after decoding a token', () => {
    const req = { get() { return 'Bearer xyz' } };
    isAuth(req as any, {} as any, () => {});
    expect(req).to.have.property('userId');
  });
});
