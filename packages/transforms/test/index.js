import {expect} from "chai";


import {S,R,T} from "./support.js";
import {Transform, transformsToPlacements} from "../dist-commonjs/index.js"


function labels(aList){
    return aList.reduce( (accum,t) => {return accum+t.label;},"[") + "]";
}

const testCases = [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ];

describe(`test case`, function(){

    [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ].forEach( function(tc){
        it(`test case ${labels(tc)}`, function(){        
            let manifestoList = tc;
            
            let transformsList = manifestoList.map(Transform.from_manifesto_transform);
            expect(transformsList).to.be.a('array');
            
            let placements = transformsToPlacements(transformsList);
            expect(placements).to.be.a('array');
            
            expect(placements).to.almost.equal(transformsList);
        });
    });
});

describe('test case 2', function(){

    [
        [R(0.0,75.0,15.0) , {"rotation" : [0.12867778 , 0.97740474,  0.16769614 , 1.33113625]}]
    ].forEach( function(tc){
        it('subcase', function(){
            const transform = Transform.from_manifesto_transform(tc[0]);
            const exactDict = tc[1];
            const testDict = transform.x3dTransformFields;
            
            const rotation = exactDict["rotation"];
            
            if (rotation != undefined)
            {
                expect(testDict).to.exist;
                expect(testDict["rotation"]).to.be.almost.deep.equal(rotation);
            }
            else{
                expect(testDict["rotation"]).to.not.exist;
            }
        })
    })
})



