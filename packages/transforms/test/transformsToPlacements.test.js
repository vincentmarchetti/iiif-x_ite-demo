import {expect} from "chai";


import {S,R,T,Vector3} from "./support.js";
import {Transform, transformsToPlacements} from "../dist-commonjs/index.js"

function applyListToVector3(operatorList, vect){
    return operatorList.reduce( function(accum,operator){
        return operator.applyToVector3(accum);
    },
    vect);
}
const testCases = [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ];

describe(`transformsToPlacements`, function(){

    [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ].forEach( function(manifestoList){
        it(`argument [${manifestoList}]`, function(){        
            const transformsList = manifestoList.map(Transform.from_manifesto_transform);
            expect(transformsList).to.be.a('array');
            
            let placements = transformsToPlacements(transformsList);
            expect(placements).to.be.a('array');
            
            const testCoords = [0.0,1.0];
            for (let i = 0; i<2;++i)
            for (let j = 0; j<2;++j)
            for (let k = 0; k<2;++k){
                const target = new Vector3(testCoords[i],testCoords[j],testCoords[k]);
                const applied_transforms = applyListToVector3(transformsList, target);
                const applied_placements = applyListToVector3(placements    , target);
                expect(applied_placements).to.almost.equal(applied_transforms);
            }
        });
    });
});




