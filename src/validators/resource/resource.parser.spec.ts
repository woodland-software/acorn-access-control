import { ResourceParser } from './resource.parser';
describe('ResourceParser', () => {
  const parser = new ResourceParser();

  const resource = {
    id: '5678',
    name: 'Resource',
    title: 'Resource title',
    createdBy: '1234',
  };
  it('properly resolves a key', () => {
    expect(parser.resolveKey(resource)).toBe('Resource');
  });
});
