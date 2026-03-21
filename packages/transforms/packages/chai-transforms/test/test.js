import {expect}  from "chai";
import {Vector3} from "threejs-math";

describe("almost test", function(){
    it("almost equals", () => {  
        const close_to_4 = 4.0 - 1.0e-8;      
        expect(close_to_4).to.almost.equal(4.0);
    });
    
    it("not almost equal", () =>{  
        const far_from_4 = 4.0 + 1.5e-7;     
        expect(3.9).to.not.almost.equal(4.0);
    });
});

describe("Vector3 test", function(){
    it("With vectors, almost equal, assert almost equal" , () => {
        const test =  new Vector3(1.0,2.0,3.0);
        const exact = new Vector3(1.0 + 1.0e-8,2.0 - 3.0e-9 ,3.00 + 4.2e-9 );
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
        expect(test).to.not.almost.equal(exact);
    })
});
