const chai = require("chai");
const chaiAlmost = require("chai-almost");
const chaiTransforms = require("./index.js");

const threejs = require("threejs-math");
let Vector3 = threejs.Vector3;

chai.use(chaiAlmost(0.01));
chai.use(chaiTransforms());

let expect = chai.expect;

describe("almost test", function(){
    it("almost equals", () => {        
        expect(3.999).to.almost.equal(4.0);
    });
    
    it("not almost equal", () =>{       
        expect(3.9).to.not.almost.equal(4.0);
    });
});

describe("Vector3 test", function(){
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

describe("AffineTransform test", function(){
    function construct_z_rotation(theta){
        const func =  (vect) => {
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            
            return new Vector3(c * vect.x - s * vect.y,
                              s * vect.x + c * vect.y,
                              vect.z);
        };
        
        return {
            "applyToVector3" : func
        };        
    };
    
    
    const quarter_turn_around_z = {
        "applyToVector3" :  (vect) => {return new Vector3(-vect.y, vect.x, vect.z);}
    };
    
    it ("quarter turn test", function(){
        const testTrans = construct_z_rotation(Math.PI/2);
        expect(testTrans).to.almost.equal(quarter_turn_around_z);
    });
    
    it ("quarter turn test; expect fail", function(){
        const testTrans = construct_z_rotation(Math.PI/2 + 0.1);
        expect(testTrans).to.almost.equal(quarter_turn_around_z);
    });
    
    
});