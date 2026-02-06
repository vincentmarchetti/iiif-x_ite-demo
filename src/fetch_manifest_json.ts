

let MANIFEST_KEY : string = "manifest";
export async function fetch_manifest_json(viewer_url_string : string ) : object | null {
    /**
    *  Not all webpages that show a IIIF manifest will use this
    *
    *  This function supports the specific case where a manifest viewer is
    *  initialized from a url or data-url passed in the query string of a URL
    *  This function will usually be called with the window.location of the
    *  webpages as the viewer_url_string
    *
    *  This async function does not do anything with the following potential failures
    *  1. malformed url or data-url in query string
    *  2. Network failure in retrieving remote url
    *  3. Failure in parsing the network data or contents of data-url,
    *     as a json object
    *  These errors will just be thrown as exceptions to be handled by client 
    *  code.
    *
    *  extracts a URI, either a URL network location
    *  or a data URI, and does what is necessary to
    *  extract the parsed json object from that URL/URI
    *
    *  If a value is not found under MANIFEST_KEY in the query part
    *  of window.location then the function will use a variable
    *  fallback_manifest_url , defined in global scope
    *
    *  otherwise a value of null is returned
    *
    *  Once a manifest_url string is identified, this function will either
    *  return a parsed Object or will throw an Error object
    *  -- Error will be thrown for network failures or json parsing error
    *  
    **/
    
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/URL
    const viewer_url : URL = new URL(viewer_url_string);
    const manifest_url_string : string | null = 
        viewer_url.searchParams.get( MANIFEST_KEY ) || fallback_manifest_url;
    
    if ( manifest_url_string  == null ) return null;
    
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch( manifest_url_string );
    if (!response.ok) {
      throw new Error(`Fetch of manifest failed: Response status: ${response.status}`);
    }
    try {
        const result = await response.json();
        return result;
    } catch (error : unknown ){
        const message = ( (x:unknown):string => {
            if (x instanceof Error) return x.message;
            return String(x);
        }) (error);
        throw new Error(`json parsing failed: ${message}`);
    }
}

