// apps/strapi/__tests__/api-doc.test.js
// Squelette de test backend KISS

describe('API Documentation', () => {
  it('doit exister', () => {
    const fs = require('fs');
    expect(fs.existsSync(__dirname + '/../API_DOC.md')).toBe(true);
  });
});
