import {makeRotateTransform} from "./testSupport.js";
import {Transform} from "../dist/index.js"
import {expect} from "chai";


describe("first test", function(){
    let R;
    let T;
    
    it("createRotationTransform", () => {        
        R = makeRotateTransform(90.0,0,0);
        expect(R).to.exist;
    });
    
    it("create Transfrom from R", () =>{
        T = Transform.from_manifesto_transform(R);
        expect(T).to.exist;
    })
});

