import * as manifesto from "manifesto-prezi4/index.js";
import {Quaternion, Euler,  IOrder, MathUtils, Vector3} from "threejs-math";


type AxesValues = [number, number, number];
const AxesNames = ["x", "y", "z"];


Vector3.prototype.toString = function(){
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
}

export function extractAxesValues(obj : object, defaultValue:number) : AxesValues{
    return AxesNames.map( (axis_name):number => {
        const c = obj[axis_name];
        if ( c === undefined ) return defaultValue;
        return Number(c);
    }) as AxesValues;
}

/*
function insertAxesValues( values : AxesValues, obj: object ):object {
    return  AxesName.reduce( (obj :object, axes_name:string, index:number):object => {
        const val:number = values[index];
        if ((val == 0.0) && (obj[axes_name] != undefined))
            delete obj[axes_name];
        else
            obj[axes_name] = val;
        return obj;
    }, obj);        
}
*/

export abstract class Transform{

    public static from_manifesto_transform(t:manifesto.Transform | manifesto.PointSelector ) : Transform{
        if (t instanceof manifesto.RotateTransform ){
            const degreesAngles:AxesValues = extractAxesValues(t.__jsonld, 0.0);
            const order:string='ZYX';
            const radianValues = degreesAngles.map( MathUtils.degToRad );
            const eulerArgs:any[] = (radianValues as any[]).concat([order])
            const euler = new Euler().fromArray( eulerArgs as [number,number,number,IOrder] );
            const quat = new Quaternion().setFromEuler(euler);
            return new Rotation(quat);
        }
        
        if (t instanceof manifesto.TranslateTransform ||
            t instanceof manifesto.PointSelector ){
            const coords:AxesValues = extractAxesValues(t.__jsonld, 0.0);
            return new Translation( new Vector3().fromArray(coords));
        }
        
        if (t instanceof manifesto.ScaleTransform ) {
            const coords:AxesValues = extractAxesValues(t.__jsonld, 1.0);
            return new Scaling( coords );
        }

        throw new TypeError();
    }
    
    
    abstract isIdentity(tolerance?:number):boolean ;
    
    abstract applyToVector3( coord: Vector3 ):Vector3;
    
    abstract applyToPlacement(placement : Placement ):Placement;
    

    abstract get x3dTransformFields():Record<string,number[]> | null;
}

export class Translation extends Transform {
    readonly vect :Vector3;
    public constructor( vect : Vector3 ){
        super();
        this.vect = vect;       
    }
    
    isIdentity(tolerance:number=1.0e-8):boolean {
        for( let i = 0; i < 3; ++i){
            if (Math.abs(this.vect.getComponent(i as 0|1|2 )) > tolerance)
                return false;        
        };
        return true;
    }
    
    applyToVector3( a:Vector3 ):Vector3{
        const rv = this.vect.clone().add(a);
        console.log(`Translation.applyToVector3 : ${this.vect} + ${a} -> ${rv}`);
        return rv;
    }
    
    applyToPlacement( placement:Placement):Placement{
        const translation = new Translation(this.applyToVector3(placement.translation.vect));
        return new Placement(placement.scaling, placement.rotation, translation);
    }
    
    get x3dTransformFields():Record<string,number[]> | null {
        if (this.isIdentity(1.0e-8))
            return {};
            
        return {"translation" : [ this.vect.x ,this.vect.y, this.vect.z]};
    }
}
export class Rotation extends Transform{

    readonly quat : Quaternion;
    
    public constructor( quat:Quaternion ){
        super();
        this.quat = quat;        
    }
    
    applyToVector3( vect: Vector3 ):Vector3{
        return vect.clone().applyQuaternion(this.quat);
    }
    
    applyToPlacement(placement:Placement):Placement {
        const translation= new Translation(
            placement.translation.vect.clone().applyQuaternion(this.quat)
        );
        
        const rotation = new Rotation(
            this.quat.clone().multiply( placement.rotation.quat )
        );
        return new Placement(placement.scaling, rotation, translation );
    }
        
    static AxisAngle(quat:Quaternion):[Vector3, number]{
        const vec = new Vector3(quat.x, quat.y, quat.z);
        const vlen:number = vec.length();
        const angle = 2.0 * Math.atan2( vlen , quat.w);
        const axis:Vector3 = (vlen > 0.0)? vec.clone().divideScalar(vlen):
                                           new Vector3(1.0,0.0,0.0);
        return [axis,angle];
    }

    isIdentity(tolerance:number = 0.0):boolean{
        const [axis, angle ] =  Rotation.AxisAngle(this.quat);
        return Math.abs(angle) <= tolerance;
    }
    
    get x3dTransformFields():Record<string,number[]> | null {
        const [axis, angle ]:[Vector3, number] =  Rotation.AxisAngle(this.quat);
    
        if (Math.abs(angle) <= 1.0e-6)
           return   null;
        
        return {"rotation" : [ axis.x, axis.y, axis.z , angle ]};
    }
}


export class Scaling extends Transform{
    readonly scales: AxesValues;
    
    public constructor( scales: AxesValues ){
        super();
        for(let i=0; i<3;++i)
            if (scales[i] == 0.0)
                throw new Error("0 valued scale axes not supportd");

        this.scales = scales;    
    };
    
    public static  fromScalar( s:number ):Scaling {
        return new Scaling( [s,s,s]);        
    }
    
    isIdentity = (tolerance:number = 1.0e-6):boolean => {
        return this.scales.reduce( (accum: boolean, x:number):boolean => {
            return accum && (Math.abs(Math.log(x)) <= tolerance)
        }, true);
    };
    
    isUniform = (tolerance:number = 0.0): boolean => {
        const testUniform = Math.abs(this.scales[0] );
        for (let i=1; i < 3; ++i)
            if ( Math.abs( Math.abs(this.scales[i]) - testUniform) > tolerance)
                return false;
        return true;
    }
    
    applyToVector3( coord: Vector3 ):Vector3{
        return new Vector3().fromArray(
            this.scales.map( (val:number, index:0 | 1 | 2):number =>{
                return val * coord.getComponent(index);
            })
        );
    }  
    
    /*
    private decompose():[Rotation, Scaling] | null {
    
        const uscale = Math.abs( this.scales[0]);
        for (let i = 1; i<3; ++i)
            if (Math.abs(this.scales[i]) != uscale)
                return null
        
        const neg_count = this.scales.reduce( (accum:number, value:number):number =>{
                    if (value < 0.0) return accum+1;
                    return accum;
                    }, 0);

        const scaling:Scaling = (neg_count % 2 == 0)? Scaling.fromScalar(uscale):
                                                      Scaling.fromScalar(-uscale);
                                                      
        const rotation : Rotation = ( () => {
            if ( neg_count == 0 || neg_count == 3)
                return new Rotation( new Quaternion() );
                
            const axis = new Vector3(0,0,0);
            const angle:number = Math.PI;
            
            for (let i = 0; i<3;++i){
                if (neg_count == 1 && this.scales[i] > 0.0) continue;
                if (neg_count == 2 && this.scales[i] < 0.0) continue;
                axis.setComponent(i as 0|1|2, 1.0); 
                break;
            }
            return new Rotation(
                new  Quaternion().setFromAxisAngle(axis,angle)
            );
        })();
        
        
        return [rotation,scaling];
    }
    */
    
    applyToPlacement(placement : Placement ):Placement {
        
        if (!this.isUniform())
            throw new Error("pre contract: cannot apply non-uniform scaling to Placement");
            
        const uscale = Math.abs( this.scales[0]);
        
        const neg_count = this.scales.reduce( (accum:number, value:number):number =>{
                    if (value < 0.0) return accum+1;
                    return accum;
                    }, 0);

        const translation  = new Translation(
            this.applyToVector3(placement.translation.vect)
        );

        const scaling_component:Scaling = (neg_count % 2 == 0)? Scaling.fromScalar(uscale):
                                                      Scaling.fromScalar(-uscale);
                                                      
        const rotation_component : Rotation = ( () => {
            if ( neg_count == 0 || neg_count == 3)
                return new Rotation( new Quaternion() );
                
            const axis = new Vector3(0,0,0);
            const angle:number = Math.PI;
            
            for (let i = 0; i<3;++i){
                if (neg_count == 1 && this.scales[i] > 0.0) continue;
                if (neg_count == 2 && this.scales[i] < 0.0) continue;
                axis.setComponent(i as 0|1|2, 1.0); 
                break;
            }
            return new Rotation(
                new  Quaternion().setFromAxisAngle(axis,angle)
            );
        })();
        
        const rotation = new Rotation(
            rotation_component.quat.clone().multiply( placement.rotation.quat )
        );

        const scaling = new Scaling(
            placement.scaling.scales.map( (v:number, index:number):number =>
                {return v * scaling_component.scales[index as 0|1|2];}
                ) as AxesValues
        );
        return new Placement(scaling, rotation, translation);
    } 
    
    get x3dTransformFields():Record<string,number[]> | null {
        if (this.isIdentity(1.0e-6))
            return {};
            
        return {"scale" : [this.scales[0] , this.scales[1] , this.scales[2]]};
    }
}



export class Placement {
    scaling : Scaling;
    rotation : Rotation;
    translation : Translation;
    
    public constructor( scaling? : Scaling, rotation? : Rotation, translation? : Translation ){
        this.scaling = scaling || new Scaling([1.0,1.0,1.0]);
        this.rotation = rotation || new Rotation( new Quaternion() );
        this.translation = translation || new Translation( new Vector3() );
    }
    
    applyToVector3( coord: Vector3 ):Vector3{
        return this.translation.applyToVector3(
            this.rotation.applyToVector3(
                this.scaling.applyToVector3( coord )
            )
        );
    }
}

export function transformsToPlacements( transforms:Transform[]):Placement[]{
    return transforms.reduce( (accum:Placement[], t:Transform ):Placement[] =>{
        if (accum.length == 0) accum.push(new Placement() );
        
        const placement:Placement = accum[ accum.length-1 ];
        if ( !t.applyToPlacement( accum[ accum.length-1 ] )){
            const next = new Placement();
            t.applyToPlacement(next);
            accum.push(next);
        }
        return accum;
    }, []);
}
