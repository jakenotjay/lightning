import React from 'react';
import PropTypes from 'prop-types';
import ReactMap from 'google-map-react';
import Place from '@material-ui/icons/Place';
import PlaceOutlined from '@material-ui/icons/PlaceOutlined';

function Map(props) {

    const centerValues = {
        center: {
            lat: 51.2437,
            lng: -0.5896
        },
        zoom: 16
    }

    return(
        <div style={{height: '100%', width: '100%'}}>
            <ReactMap
                bootstrapURLKeys={{key : 'AIzaSyCxuG_WgDO0BcoObCchcg2FP2P8teJnBiQ'}}
                defaultCenter={centerValues.center}
                defaultZoom={centerValues.zoom}    
            >
                {props.Reports.map((report, index) => (
                    (props.Triangulated === true && index === 3 ) ? 
                        <PlaceOutlined
                            key={report.ReportID}
                            lat={report.Latitude}
                            lng={report.Longitude}
                         />:
                        <Place 
                            key={report.ReportID}
                            lat={report.Latitude}
                            lng={report.Longitude}
                        />
                    ))
                }
            </ReactMap>
        </div>
    )
}

export default Map;

Map.propTypes = {
    Reports : PropTypes.arrayOf(PropTypes.shape({
      ReportID : PropTypes.number,
      DateTime : PropTypes.string,
      Location : PropTypes.string,
      Longitude : PropTypes.float,
      Latitude : PropTypes.float
    })).isRequired,
    Triangulated : PropTypes.bool
  }
