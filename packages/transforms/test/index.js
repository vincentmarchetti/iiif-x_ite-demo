import {expect} from "chai";


import {S,R,T} from "./support.js";
import {Transform, transformsToPlacements} from "../dist-commonjs/index.js"


function labels(aList){
    return aList.reduce( (accum,t) => {return accum+t.label;},"[") + "]";
}

describe("first test", function(){
    
    it("creates lists", () => {        
        let transList = [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)];
        expect(transList).to.exist;
        
        expect(labels(transList)).to.be.a('string');
        
        let tlist = transList.map(Transform.from_manifesto_transform);
        expect(tlist).to.be.a('array');
        
        let placements = transformsToPlacements(tlist);
        expect(placements).to.be.a('array');
        
        expect(placements).to.almost.equal(tlist);
    });
});

