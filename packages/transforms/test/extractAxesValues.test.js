import {expect} from "chai";
import {extractAxesValues} from "../dist-commonjs/index.js"



describe("test extractAxesValues", function(){

    [
        [{x:1, y:2, z:3},  0.0,  [1.0,2.0,3.0]],
        [{x:1.5, z:-1.5},  1.0,  [1.5,1.0,-1.5]]
    ].forEach( function(testcase) {
        const [axes_values, default_value, exact_result] = testcase;
        it(`argument: ${JSON.stringify(axes_values)} default ${default_value}`, function(){
            const test_result = extractAxesValues(axes_values, default_value);
            expect(test_result).to.exist;
            expect(test_result).to.have.lengthOf(3);
            expect(test_result).to.deep.equal(exact_result);
            
            
        });
    });

});