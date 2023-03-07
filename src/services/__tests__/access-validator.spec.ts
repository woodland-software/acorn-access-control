import { bloggerPolicy, adminPolicy } from '../../../tests/mocks/policy.mock';
import { blogger, admin } from '../../../tests/mocks/user.mock';
import { post } from '../../../tests/mocks/resource.mock';
import { AccessValidator } from '../access-validator';

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
