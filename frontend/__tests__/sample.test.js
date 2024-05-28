function add(a, b) {
  return a + b;
}

describe('Same test 101', () => {
  it('works as expected', () => {
    // we run our expect statements to see if the test will pass
    expect(1).toEqual(1);
    const age = 100;
    expect(age).toEqual(100);
    expect(add(1, 2)).toBeGreaterThanOrEqual(3);
  });
});
