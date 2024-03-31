interface GeoJSONFeature {
    type: 'Feature';
    properties: {};
    geometry: {
      type: string;
      coordinates: object;
    };
  }
  
  export interface GeoJSONData {
    type:'FeatureCollection';
    features: GeoJSONFeature[];
  }