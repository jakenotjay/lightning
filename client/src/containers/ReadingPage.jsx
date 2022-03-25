import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles'
import AppToolbar from '../components/AppToolbar.jsx';
import DataTable from '../components/DataTable.jsx';
import Graph from '../components/Graph.jsx';
import OptionButtons from '../components/OptionButtons.jsx';
import Map from '../components/Map.jsx';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      overflowX: 'auto',
      height: '100%',
      marginTop: theme.spacing(3),
      maxHeight: '500px'
    },
  }));
  
function MapContainer(props) {
    const classes = useStyles();
    var triangulated = false;

    if(props.Reports.length > 1) {
        triangulated = true;
    } 
  
    return (
      <Paper className={classes.root}>
        <Map Reports={props.Reports} Triangulated={triangulated}/>
      </Paper>
    )
}


class ReadingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Reports: props.location.state.Reports,
            match : props.match,
            Readings : [],
            Indexes :[],
            Locations: [{
                ReportID : null,
                DateTime : null,
                Location : null,
                Longitude : null,
                Latitude : null            
            }]
        } 

        this.getReadings = this.getReadings.bind(this);
        this.copyToClip = this.copyToClip.bind(this);
    }

    componentDidMount(){
        this.getReadings();
        this.getMapPoints();
    }

    getMapPoints = async() => {
        var url = '/api/mapPoints?reportID='+this.state.match.params.reportID;
        await fetch(url)
        .then(async(res) => res.json())
        .then(res => {
            this.setState({Locations: res.Locations})
        });
    }

    getReadings = async() => {
        var url = '/api/readings?reportID='+this.state.match.params.reportID 
        await fetch(url)
        .then(async(res) => res.json())
        .then(res => {
            this.setState({allReadings : res.ReadingsData})
            var responseReadings = res.ReadingsData;
            var length = responseReadings.length;
            var step = Math.floor(length/20);
            var readings = [];
            for(var i = 0; i < length; i += step){
                readings.push(responseReadings[i].ReadingData);
            }
            var indexes = readings.map((value, index) => {
                return index;
            })
            this.setState({
                Readings : readings,
                Indexes : indexes
            });
        })
    }

    getReadingstxt = async() => {
        var url = '/api/readingstxt?reportID='+this.state.match.params.reportID;
        await fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = "readings.txt";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    getReadingscsv = async() => {
        var url = '/api/readingscsv?reportID='+this.state.match.params.reportID;
        await fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = "readings.csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    copyToClip() {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                var text = "";
                var readings = this.state.Readings;
                readings.forEach(reading => {
                    text += reading+"\n";
                });

                navigator.clipboard.writeText(text).then(function() {

                });
            }
          });
    }


    render() { 
        return(
            <div>
                <AppToolbar />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} >
                        <Graph readings={this.state.Readings} indexes={this.state.Indexes}/>
                        <MapContainer Reports={this.state.Locations} />
                        <OptionButtons 
                            getReadingstxt={() => this.getReadingstxt} 
                            getReadingscsv={() => this.getReadingscsv}
                            copyToClip={() => this.copyToClip}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <DataTable readings={this.state.Readings}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default ReadingPage;

ReadingPage.propTypes = {
    match : PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
}

MapContainer.propTypes = {
    Reports : PropTypes.arrayOf(PropTypes.shape({
      ReportID : PropTypes.number,
      DateTime : PropTypes.string,
      Location : PropTypes.string,
      Longitude : PropTypes.float,
      Latitude : PropTypes.float
    })).isRequired,
  }