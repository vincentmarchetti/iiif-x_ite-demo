import {T} from "./testSupport.js";
import {Transform, transformsToPlacements} from "../dist/index.js"
import {expect} from "chai";

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

