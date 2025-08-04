import { expect } from "chai";
import { User, UserDocument } from "../models/user.js";
import { connect, disconnect } from "mongoose";
import { createPost } from "../controllers/feed.js";

describe('Feed Controller', () => {
  before(done => {
    connect('mongodb://test-postapp:mypass@localhost:27017/test-postapp?authSource=test-postapp')
      .then(() => {
        // Testing logic
        const user = new User({ email: 'test@test.com', password: 'tester', name: 'Test', posts: [], _id: '5c0f66b979af55031b34728a' });
        return user.save()
      })
      .then(() => done())
      .catch(err => done(err));
  });
  after(done => {
    User.deleteMany({})
      .then(() => disconnect())
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should add a created post to the posts of the creator', done => {
    const req = {
      userId: '5c0f66b979af55031b34728a',
      file: {
        path: '/images/test.png'
      },
      body: {
        title: 'Test post',
        content: 'A test post'
      }
    } as any;
    const res = {
      statusCode: 500,
      data: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(obj: any) {
        this.data = obj;
        return this;
      }
    } as any;
    (createPost(req, res, () => {}) as Promise<UserDocument>)
      .then(savedUser => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.data.message).to.be.equal('Post created successfully!');
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch(err => done(err));
  });
});
