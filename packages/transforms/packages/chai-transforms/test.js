const chai = require("chai");
const chaiAlmost = require("chai-almost");
const chaiTransforms = require("./index.js");

const Vector3 = require("threejs-math").Vector3;

chai.use(chaiAlmost(0.01));
chai.use(chaiTransforms());

let expect = chai.expect;

describe("first test", function(){
    it("almost equals", () => {        
        expect(3.999).to.almost.equal(4.0);
    });
    
    it("not almost equal", () =>{       
        expect(3.9).to.not.almost.equal(4.0);
    });
    
    it("With vectors, almost equal, assert almost equal" , () => {
        const test = new Vector3(1.0,2.0,3.0);
        const exact = new Vector3(1.0,2.0,3.001);
        expect(test).to.almost.equal(exact);
    });
    
    it("With vectors, not almost equal, assert not almost equal" , () => {
        const test = new Vector3(1.0,2.0,3.0);
        const exact = new Vector3(1.0,2.0,3.101);
        expect(test).to.not.almost.equal(exact);
    })

    
    it("With vectors, almost equal, assert not almost equal, expect fail" , () => {
        const test = new Vector3(1.0,2.0,3.0);
        const exact = new Vector3(1.0,2.0,3.001);
        expect(test).to.not.almost.equal(exact);
    })
    
    it("With vectors, not almost equal, assert almost equal, expect fail" , () => {
        const test = new Vector3(1.0,2.0,3.0);
        const exact = new Vector3(1.0,2.0,3.101);
        expect(test).to.almost.equal(exact);
    })
    
    
});
