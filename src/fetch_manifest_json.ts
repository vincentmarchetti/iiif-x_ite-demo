

let MANIFEST_KEY : string = "manifest";
export async function fetch_manifest_json(viewer_url_string : string ) : object | null {
    /**
    *  extracts a URI, either a URL network location
    *  or a data URI, and does what is necessary to
    *  extract text from that URL/URI
    *
    *  returns null is there is no "manifest" parameters in the query
    *  part of the url string
    *
    **/
    
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/URL
    const viewer_url : URL = new URL(viewer_url_string);
    const manifest_url_string : string | null = viewer_url.searchParams.get( MANIFEST_KEY );
    
    if ( manifest_url_string  === null ) return null;
    
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch( manifest_url_string );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
}