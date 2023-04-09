import {
  bloggerPolicy,
  adminPolicy,
} from '../../models/__mocks__/policy.mock.js';
import { blogger, admin } from '../../models/__mocks__/user.mock.js';
import { post } from '../../models/__mocks__/resource.mock.js';
import { AccessValidator } from '../access-validator.js';

describe('AccessValidator', () => {
  const validator = new AccessValidator();
  describe('asserts', () => {
    it('properly prevents actions that arent enabled by policy', () => {
      expect(
        validator
          .check(bloggerPolicy)
          .resource(post)
          .allows(['User::create'])
          .by(blogger),
      ).toBe(false);
    });

    it('allows actions on resources that are enabled by policy', () => {
      expect(
        validator
          .check(adminPolicy)
          .resource(post)
          .allows(['Post::update'])
          .by(admin),
      ).toBe(true);
    });

    it('allows action on other resources based on policy', () => {
      expect(
        validator
          .check(adminPolicy)
          .resource(blogger)
          .allows(['User::update'])
          .by(admin),
      ).toBe(true);
    });

    it('allows resource to self reference and allow update if resource targets owner', () => {
      expect(
        validator
          .check(bloggerPolicy)
          .allows(['User::update'])
          .on(blogger)
          .by(blogger),
      ).toBe(true);
    });
  });
});
