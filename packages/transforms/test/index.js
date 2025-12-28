//const chaix = require("chai");
//const chaiAlmost = require("chai-almost");

import {T} from "./testSupport.js";
import {Transform, transformsToPlacements} from "../dist/index.js"
import * as chai from "chai";

// at 1:11 PM Dec 28 2025: when the following is uncommented, in the
// attempt to install the almost extension to chai, the
// mocha test fails at finding any tests
// const chaiAlmost = require("chai-almost");
import * as chai_ext from "chai-almost/index.js"

let expect = chai.expect;

function labels(aList){
    return aList.reduce( (accum,t) => {return accum+t.label;},"[") + "]";
}

describe("first test", function(){
    
    it("creates lists", () => {        
        let transList = [T(1.0,2.0,3.0)];
        expect(transList).to.exist;
        
        expect(labels(transList)).to.be.a('string');
        
        let tlist = transList.map(Transform.from_manifesto_transform);
        expect(tlist).to.be.a('array');
        
        let placements = transformsToPlacements(tlist);
        expect(placements).to.be.a('array');
    });
});

