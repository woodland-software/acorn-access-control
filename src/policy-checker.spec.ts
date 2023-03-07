import { bloggerPolicy, adminPolicy } from './models/mocks/policy.mock';
import { blogger, admin } from './models/mocks/user.mock';
import { post } from './models/mocks/resource.mock';
import { PolicyChecker } from './policy-checker';

describe('PolicyChecker', () => {
  const policyChecker = new PolicyChecker();
  describe('asserts', () => {
    it('properly prevents actions that arent enabled by policy', () => {
      expect(
        policyChecker
          .check(bloggerPolicy)
          .resource(post)
          .allows(['User::create'])
          .by(blogger),
      ).toBe(false);
    });

    it('allows actions on resources that are enabled by policy', () => {
      expect(
        policyChecker
          .check(adminPolicy)
          .resource(post)
          .allows(['Post::update'])
          .by(admin),
      ).toBe(true);
    });

    it('allows action on other resources based on policy', () => {
      expect(
        policyChecker
          .check(adminPolicy)
          .resource(blogger)
          .allows(['User::update'])
          .by(admin),
      ).toBe(true);
    });

    it('allows resource to self reference and allow update if resource targets owner', () => {
      expect(
        policyChecker
          .check(bloggerPolicy)
          .allows(['User::update'])
          .on(blogger)
          .by(blogger),
      ).toBe(true);
    });
  });
});
