import { expect } from "chai";
import { isAuth } from "../middleware/auth.js";

describe('middleware/is-auth', () => {
  it('Should throw an error if no Authorization header is present', () => {
    const req = { get() { return null } };
    expect(() => isAuth(req as any, {} as any, () => {})).to.throw('Not authenticated.');
  });
});
