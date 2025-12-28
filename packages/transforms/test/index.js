import {T} from "./testSupport.js";
import {Transform} from "../dist/index.js"
import {expect} from "chai";


describe("first test", function(){
    
    it("creates lists", () => {        
        let transList = [T(1.0,2.0,3.0)];
        expect(transList).to.exist;
    });
    

});

