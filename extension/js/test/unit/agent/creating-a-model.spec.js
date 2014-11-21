describe('Creating a Model', function() {

  beforeEach(function() {

    this.sinon.spy(window, 'registerAppComponent')

    this.myModel = new Backbone.Model({
      foo: 'bar'
    });
  })

  it('calls registerAppComponent', function() {
    expect(window.registerAppComponent).to.be.called.calledOnce;
  });

  it('callls registerAppComponent with data', function() {
    var callData = window.registerAppComponent.getCall(0).args[2];

    expect(callData.attributes.value).to.deep.equal({foo: "bar"});
    expect(callData.attributes.serialized).to.deep.equal({
      foo: {
        cid: undefined,
        key: "foo",
        name: "foo",
        value: "bar",
        type: "type-string"
      }
    });
  })
})
